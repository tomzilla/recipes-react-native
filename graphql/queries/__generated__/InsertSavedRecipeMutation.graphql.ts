/**
 * @generated SignedSource<<8d0c45b033edfef72f27995a333d6d39>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type InsertSavedRecipeMutation$variables = {
  recipeId: string;
  userId: string;
};
export type InsertSavedRecipeMutation$data = {
  readonly insertIntosaved_recipesCollection: {
    readonly affectedCount: number;
    readonly records: ReadonlyArray<{
      readonly created_at: string;
      readonly recipe_id: string;
      readonly state: string | null | undefined;
      readonly user_id: string;
    }>;
  } | null | undefined;
};
export type InsertSavedRecipeMutation = {
  response: InsertSavedRecipeMutation$data;
  variables: InsertSavedRecipeMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "recipeId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userId"
},
v2 = [
  {
    "items": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "recipe_id",
            "variableName": "recipeId"
          },
          {
            "kind": "Literal",
            "name": "state",
            "value": "save"
          },
          {
            "kind": "Variable",
            "name": "user_id",
            "variableName": "userId"
          }
        ],
        "kind": "ObjectValue",
        "name": "objects.0"
      }
    ],
    "kind": "ListValue",
    "name": "objects"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created_at",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "user_id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "recipe_id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "affectedCount",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "InsertSavedRecipeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "saved_recipesInsertResponse",
        "kind": "LinkedField",
        "name": "insertIntosaved_recipesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "saved_recipes",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          },
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "InsertSavedRecipeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "saved_recipesInsertResponse",
        "kind": "LinkedField",
        "name": "insertIntosaved_recipesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "saved_recipes",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "nodeId",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "792a2d1f042d41902dbc859a4407604b",
    "id": null,
    "metadata": {},
    "name": "InsertSavedRecipeMutation",
    "operationKind": "mutation",
    "text": "mutation InsertSavedRecipeMutation(\n  $userId: UUID!\n  $recipeId: BigInt!\n) {\n  insertIntosaved_recipesCollection(objects: [{user_id: $userId, recipe_id: $recipeId, state: \"save\"}]) {\n    records {\n      state\n      created_at\n      user_id\n      recipe_id\n      nodeId\n    }\n    affectedCount\n  }\n}\n"
  }
};
})();

(node as any).hash = "8dd83482b087e2317fcaead380ebf393";

export default node;
