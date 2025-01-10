import { Tables } from '@/services/database.types';
import { PostgrestError } from '@supabase/supabase-js';
import { Recipe } from './recipe';

export interface TaggedRecipe extends Recipe {
  recipe_tags: {
    tag: Tables<'tags'>
  }[]
}

export interface SavedRecipesType {
  recipe: TaggedRecipe
  user_id: string
  state: string
  created_at: string
}

export interface SavedRecipesState {
  recipes: SavedRecipesType[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: PostgrestError | null
}
