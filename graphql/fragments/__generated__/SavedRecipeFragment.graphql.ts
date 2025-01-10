/**
 * @generated SignedSource<<5c4672bd908bc47442a97439a9143ec3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SavedRecipeFragment$data = {
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
  readonly " $fragmentType": "SavedRecipeFragment";
};
export type SavedRecipeFragment$key = {
  readonly " $data"?: SavedRecipeFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SavedRecipeFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created_at",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SavedRecipeFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "user_id",
      "storageKey": null
    },
    (v0/*: any*/),
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
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "url",
          "storageKey": null
        },
        (v0/*: any*/),
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
                        (v1/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "name",
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
  "type": "saved_recipes",
  "abstractKey": null
};
})();

(node as any).hash = "7135b22df806e4097923c9bc1d2949a5";

export default node;
