import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CuratedRecipesState } from '@/types/recipe';
import { supabase } from '@/services/SupabaseClient';

const initialState: CuratedRecipesState = {
  trending: [],
  curated: [],
  loading: false,
  error: null,
};

export const fetchCuratedRecipes = createAsyncThunk(
  'curatedRecipes/fetch',
  async (_, { rejectWithValue }) => {
    const recipes = {};
    const results = await Promise.all([
      supabase
      .from('curated_recipes')
      .select(`
        recipe:recipes (
          *
        )
      `),
      supabase
      .from('trending_recipes')
      .select(`
        recipe:recipes (
          *
        )
      `)
    ]);

    if (results[0].error) return rejectWithValue(results[0].error.message);

    if (results[1].error) return rejectWithValue(results[1].error.message);

    return {
      curated: results[0].data.map(item => item.recipe).flat(),
      trending: results[1].data.map(item => item.recipe).flat()
    };
  }
);

const curatedRecipesSlice = createSlice({
  name: 'curatedRecipes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCuratedRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCuratedRecipes.fulfilled, (state, action) => {
        state.trending = action.payload.trending;
        state.curated = action.payload.curated;

        state.loading = false;
      })
      .addCase(fetchCuratedRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default curatedRecipesSlice.reducer;