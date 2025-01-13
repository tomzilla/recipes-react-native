export interface GroceryItem {
  id: number;
  name: string;
  checked: boolean;
  checked_at: string | null;
  user_id: string;
  recipe_id: number | null;
  created_at: string;
}

export interface GroceryItemsState {
  items: GroceryItem[];
  loading: boolean;
  error: string | null;
  clearCheckedConfirmation: boolean;
  clearAllConfirmation: boolean;
}

