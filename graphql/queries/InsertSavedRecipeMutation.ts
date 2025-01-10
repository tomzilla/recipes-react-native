import { graphql } from "relay-runtime";

export const InsertSavedRecipeMutation = graphql`
    mutation InsertSavedRecipeMutation($userId:UUID!, $recipeId:BigInt!) {
      insertIntosaved_recipesCollection (
        objects: [
          {
            user_id: $userId
            recipe_id: $recipeId
            state: "save"
          }
        ]
      ){
        records {
          ...SavedRecipeFragment
        }
        affectedCount
      }
    }
  `;