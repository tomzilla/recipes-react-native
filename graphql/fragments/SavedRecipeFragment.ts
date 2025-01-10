import { graphql } from 'react-relay';

export const SavedRecipeFragment = graphql`
  fragment SavedRecipeFragment on saved_recipes {
    user_id
    created_at
    state
    recipes {
      id
      url
      created_at
      json
      title
      recipe_tagsCollection {
        edges {
          node {
            tags {
              id
              name
            }
          }
        }
      }
    }
  }
`;