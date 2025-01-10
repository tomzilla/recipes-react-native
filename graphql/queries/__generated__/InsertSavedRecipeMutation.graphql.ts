/**
 * @generated SignedSource<<c1ea4915f4cba5fa2a837cf868e8a407>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type InsertSavedRecipeMutation$variables = {
  recipeId: string;
  userId: string;
};
export type InsertSavedRecipeMutation$data = {
  readonly insertIntosaved_recipesCollection: {
    readonly affectedCount: number;
    readonly records: ReadonlyArray<{
      readonly " $fragmentSpreads": FragmentRefs<"SavedRecipeFragment">;
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
  "name": "affectedCount",
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
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nodeId",
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
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "SavedRecipeFragment"
              }
            ],
            "storageKey": null
          },
          (v3/*: any*/)
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "user_id",
                "storageKey": null
              },
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "state",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "recipes",
                "kind": "LinkedField",
                "name": "recipes",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "url",
                    "storageKey": null
                  },
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "json",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "title",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "recipe_tagsConnection",
                    "kind": "LinkedField",
                    "name": "recipe_tagsCollection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "recipe_tagsEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "recipe_tags",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "tags",
                                "kind": "LinkedField",
                                "name": "tags",
                                "plural": false,
                                "selections": [
                                  (v5/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "name",
                                    "storageKey": null
                                  },
                                  (v6/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v6/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v6/*: any*/)
                ],
                "storageKey": null
              },
              (v6/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "bda4f5a78f45559175d1ec6e98a3233a",
    "id": null,
    "metadata": {},
    "name": "InsertSavedRecipeMutation",
    "operationKind": "mutation",
    "text": "mutation InsertSavedRecipeMutation(\n  $userId: UUID!\n  $recipeId: BigInt!\n) {\n  insertIntosaved_recipesCollection(objects: [{user_id: $userId, recipe_id: $recipeId, state: \"save\"}]) {\n    records {\n      ...SavedRecipeFragment\n      nodeId\n    }\n    affectedCount\n  }\n}\n\nfragment SavedRecipeFragment on saved_recipes {\n  user_id\n  created_at\n  state\n  recipes {\n    id\n    url\n    created_at\n    json\n    title\n    recipe_tagsCollection {\n      edges {\n        node {\n          tags {\n            id\n            name\n            nodeId\n          }\n          nodeId\n        }\n      }\n    }\n    nodeId\n  }\n}\n"
  }
};
})();

(node as any).hash = "073b12a77a03d713b9d24782b9b5c993";

export default node;
