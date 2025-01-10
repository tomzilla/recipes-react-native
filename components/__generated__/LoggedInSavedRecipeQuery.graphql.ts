/**
 * @generated SignedSource<<e572c6cecdb09f888ed8357e01d727b1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LoggedInSavedRecipeQuery$variables = {
  tagIds?: ReadonlyArray<number> | null | undefined;
  userId: string;
};
export type LoggedInSavedRecipeQuery$data = {
  readonly saved_recipesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly created_at: string;
        readonly recipes: {
          readonly created_at: string;
          readonly id: string;
          readonly json: string | null | undefined;
          readonly recipe_tagsCollection: {
            readonly edges: ReadonlyArray<{
              readonly node: {
                readonly tags: {
                  readonly id: number;
                  readonly name: string;
                };
              };
            }>;
          } | null | undefined;
          readonly title: string | null | undefined;
          readonly url: string;
        } | null | undefined;
        readonly state: string | null | undefined;
        readonly user_id: string;
      };
    }>;
  } | null | undefined;
};
export type LoggedInSavedRecipeQuery = {
  response: LoggedInSavedRecipeQuery$data;
  variables: LoggedInSavedRecipeQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "tagIds"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userId"
},
v2 = [
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "eq",
            "variableName": "userId"
          }
        ],
        "kind": "ObjectValue",
        "name": "user_id"
      }
    ],
    "kind": "ObjectValue",
    "name": "filter"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "user_id",
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
  "name": "state",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "json",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v10 = [
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "in",
            "variableName": "tagIds"
          }
        ],
        "kind": "ObjectValue",
        "name": "tag_id"
      }
    ],
    "kind": "ObjectValue",
    "name": "filter"
  }
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v12 = {
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
    "name": "LoggedInSavedRecipeQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "saved_recipesConnection",
        "kind": "LinkedField",
        "name": "saved_recipesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "saved_recipesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "saved_recipes",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "recipes",
                    "kind": "LinkedField",
                    "name": "recipes",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v4/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      {
                        "alias": null,
                        "args": (v10/*: any*/),
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
                                      (v11/*: any*/),
                                      (v6/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "LoggedInSavedRecipeQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "saved_recipesConnection",
        "kind": "LinkedField",
        "name": "saved_recipesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "saved_recipesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "saved_recipes",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "recipes",
                    "kind": "LinkedField",
                    "name": "recipes",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v4/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      {
                        "alias": null,
                        "args": (v10/*: any*/),
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
                                      (v11/*: any*/),
                                      (v6/*: any*/),
                                      (v12/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v12/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v12/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v12/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e405293986487e5513d2c64b29a46cd9",
    "id": null,
    "metadata": {},
    "name": "LoggedInSavedRecipeQuery",
    "operationKind": "query",
    "text": "query LoggedInSavedRecipeQuery(\n  $userId: UUID!\n  $tagIds: [Int!]\n) {\n  saved_recipesCollection(filter: {user_id: {eq: $userId}}) {\n    edges {\n      node {\n        user_id\n        created_at\n        state\n        recipes {\n          id\n          url\n          created_at\n          json\n          title\n          recipe_tagsCollection(filter: {tag_id: {in: $tagIds}}) {\n            edges {\n              node {\n                tags {\n                  name\n                  id\n                  nodeId\n                }\n                nodeId\n              }\n            }\n          }\n          nodeId\n        }\n        nodeId\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b6bf8f4b4ba3d75ee16c5b0834c3de3c";

export default node;
