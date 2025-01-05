import { Tables } from '@/services/database.types';
import { supabase } from '@/services/SupabaseClient';
import { TagsState } from '@/types/tags';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const initialState: TagsState = {
  selectedTags: [],
  availableTags: [],
  isLoading: false,
  error: null,
};

export const fetchTags = createAsyncThunk(
  'tags/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name');

      if (error) throw error;
      return data as Tables<'tags'>[];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setSelectedTags: (state, action: PayloadAction<number[]>) => {
      state.selectedTags = action.payload;
    },
    toggleTag: (state, action: PayloadAction<number>) => {
      const tagId = action.payload;
      const index = state.selectedTags.indexOf(tagId);
      if (index === -1) {
        state.selectedTags.push(tagId);
      } else {
        state.selectedTags.splice(index, 1);
      }
    },
    clearSelectedTags: (state) => {
      state.selectedTags = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action: PayloadAction<Tables<'tags'>[]>) => {
        state.isLoading = false;
        state.availableTags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTags, toggleTag, clearSelectedTags } = tagsSlice.actions;
export default tagsSlice.reducer;
