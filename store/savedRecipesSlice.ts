import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PostgrestError } from '@supabase/supabase-js';
import { SavedRecipesState, SavedRecipesType } from '@/types/saved_recipes';
import { supabase } from '@/services/SupabaseClient';
import { RootState } from './store';

const initialState: SavedRecipesState = {
  recipes: [],
  recipeIds: {},
  status: 'idle',
  error: null
};

export const fetchSavedRecipes = createAsyncThunk(
  'savedRecipes/fetchSavedRecipes',
  async (userId: string) => {
    const supabaseQuery = supabase
      .from('saved_recipes')
      .select(`
        recipe:recipes!inner(
          *,
          recipe_tags!left(
            tag:tags!inner(name, id)
          )
        ),
        user_id,
        state,
        created_at
      `)
      .limit(1, { referencedTable: 'recipes' })
      .eq('user_id', userId);

    const { data, error } = await supabaseQuery.returns<SavedRecipesType[]>();
    // hvrdQnX6bV2WqPI5
    if (error) {
      throw error;
    }
    
    return data;
  }
);

const savedRecipesSlice = createSlice({
  name: 'savedRecipes',
  initialState,
  reducers: {
    clearSavedRecipes: (state) => {
      state.recipes = [];
      state.status = 'idle';
      state.recipeIds = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedRecipes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSavedRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // @ts-ignore
        state.recipes = action.payload;
        const newRecipeIds:any = {};
        action.payload.forEach((savedRecipe) => {
          newRecipeIds[savedRecipe.recipe.id.toString()] = savedRecipe;
        });
        state.recipeIds = newRecipeIds;
        state.error = null;
      })
      .addCase(fetchSavedRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error as PostgrestError;
      });
  },
});

export const selectAllSavedRecipes = (state: RootState) => state.savedRecipes.recipes;
export const selectRecipeIds = (state: RootState) => state.savedRecipes.recipeIds;
export const selectSavedRecipesStatus = (state: RootState) => state.savedRecipes.status;
export const selectSavedRecipesError = (state: RootState) => state.savedRecipes.error;

export const { clearSavedRecipes } = savedRecipesSlice.actions;
export default savedRecipesSlice.reducer;
