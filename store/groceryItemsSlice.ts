import { supabase } from '@/services/SupabaseClient';
import { GroceryItem, GroceryItemsState } from '@/types/grocery';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const initialState: GroceryItemsState = {
  items: [],
  loading: false,
  error: null,
  clearCheckedConfirmation: false,
  clearAllConfirmation: false,
};

export const fetchGroceryItems = createAsyncThunk(
  'groceryItems/fetch',
  async (userId: string) => {
    const { data, error } = await supabase
      .from("grocery_items")
      .select("*")
      .eq("user_id", userId)
      .order('checked_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
);

export const addGroceryItem = createAsyncThunk(
  'groceryItems/add',
  async (item: Pick<GroceryItem, 'name' | 'recipe_id'>, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from('grocery_items')
      .insert([item])
      .select()
      .single();
    
    if (error) return rejectWithValue(error.message);
    return data;
  }
);

export const toggleGroceryItem = createAsyncThunk(
  'groceryList/toggleItem',
  async ({ item }: { item: GroceryItem }) => {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("grocery_items")
      .update({
        checked: !item.checked,
        checked_at: !item.checked ? now : null
      })
      .eq("id", item.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);


export const clearCheckedItems = createAsyncThunk(
  'groceryItems/clearChecked',
  async (userId: string) => {
    const { error } = await supabase
      .from("grocery_items")
      .delete()
      .eq("user_id", userId)
      .eq("checked", true);

    if (error) throw error;
  }
);

export const clearAllItems = createAsyncThunk(
  'groceryItems/clearAll',
  async (userId: string) => {
    const { error } = await supabase
      .from("grocery_items")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
  }
);


export const deleteGroceryItem = createAsyncThunk(
  'groceryItems/delete',
  async (id: number, { rejectWithValue }) => {
    const { error } = await supabase
      .from('grocery_items')
      .delete()
      .eq('id', id);
    
    if (error) return rejectWithValue(error.message);
    return id;
  }
);

const groceryItemsSlice = createSlice({
  name: 'groceryItems',
  initialState,
  reducers: {
    setClearCheckedConfirmation(state, action: PayloadAction<boolean>) {
      state.clearCheckedConfirmation = action.payload;
    },
    setClearAllConfirmation(state, action: PayloadAction<boolean>) {
      state.clearAllConfirmation = action.payload;
    },
  },  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchGroceryItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroceryItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchGroceryItems.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Add cases
      .addCase(addGroceryItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Toggle cases
      .addCase(toggleGroceryItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete cases
      .addCase(deleteGroceryItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      //clear checked
      .addCase(clearCheckedItems.fulfilled, (state) => {
        state.items = state.items.filter(item => !item.checked);
        state.clearCheckedConfirmation = false;
      })
      // Clear all items
      .addCase(clearAllItems.fulfilled, (state) => {
        state.items = [];
      });
  },
});
export const { setClearCheckedConfirmation, setClearAllConfirmation } = groceryItemsSlice.actions;

export default groceryItemsSlice.reducer;