import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../types/auth';
import { User } from '@supabase/supabase-js';
import { RecipeData, RecipeDataState } from '@/types/recipe';

const initialState: RecipeDataState = {
  cache: {},
};

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<RecipeData>) => {
      state.cache = action.payload;
    },
  },
});
export const { setUser, clearUser, setLoading, setError, setInitialized } = recipeSlice.actions;
export default recipeSlice.reducer;
