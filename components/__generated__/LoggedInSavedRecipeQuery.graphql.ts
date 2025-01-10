/**
 * @generated SignedSource<<d2227ff2842aeb38fd7d43121ced11ce>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LoggedInSavedRecipeQuery$variables = {
  userId: string;
};
export type LoggedInSavedRecipeQuery$data = {
  readonly saved_recipesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly recipes: {
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
        } | null | undefined;
      };
    }>;
  } | null | undefined;
};
export type LoggedInSavedRecipeQuery = {
  response: LoggedInSavedRecipeQuery$data;
  variables: LoggedInSavedRecipeQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userId"
  }
],
v1 = [
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "json",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LoggedInSavedRecipeQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "recipes",
                    "kind": "LinkedField",
                    "name": "recipes",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v3/*: any*/),
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
                                      (v4/*: any*/),
                                      (v5/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LoggedInSavedRecipeQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "recipes",
                    "kind": "LinkedField",
                    "name": "recipes",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v3/*: any*/),
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
                                      (v4/*: any*/),
                                      (v5/*: any*/),
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
    "cacheID": "202e597b7a6ea343859b2fc4990afbbc",
    "id": null,
    "metadata": {},
    "name": "LoggedInSavedRecipeQuery",
    "operationKind": "query",
    "text": "query LoggedInSavedRecipeQuery(\n  $userId: UUID!\n) {\n  saved_recipesCollection(filter: {user_id: {eq: $userId}}) {\n    edges {\n      node {\n        recipes {\n          json\n          title\n          recipe_tagsCollection {\n            edges {\n              node {\n                tags {\n                  name\n                  id\n                  nodeId\n                }\n                nodeId\n              }\n            }\n          }\n          nodeId\n        }\n        nodeId\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "59fed7ddaf379ec8b05e55d9dffa1070";

export default node;
