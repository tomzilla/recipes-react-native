import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime'
import { supabase, supabaseAnonKey, supabaseUrl } from './SupabaseClient'
import RelayModernEnvironment from 'relay-runtime/lib/store/RelayModernEnvironment'

const fetchQuery: FetchFunction = async (operation, variables) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const response = await fetch(`${supabaseUrl}/graphql/v1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${session?.access_token ?? supabaseAnonKey}`,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  })

  return await response.json()
}

const network = Network.create(fetchQuery)
const store = new Store(new RecordSource())

const environment = new RelayModernEnvironment({
  network,
  store,
  getDataID: (node) => node.nodeId,
  missingFieldHandlers: [
    {
      handle(field, _record, argValues) {
        if (field.name === 'node' && 'nodeId' in argValues) {
          // If field is node(nodeId: $nodeId), look up the record by the value of $nodeId
          return argValues.nodeId
        }

        return undefined
      },
      kind: 'linked',
    },
  ],
})

export default environment
