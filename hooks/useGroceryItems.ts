import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, type RootState } from '@/store/store';
import {
  fetchGroceryItems,
  addGroceryItem,
  toggleGroceryItem,
  deleteGroceryItem,
  setClearAllConfirmation as setClearAllConfirmationAction,
  setClearCheckedConfirmation as setClearCheckedConfirmationAction,
  clearCheckedItems,
  clearAllItems,
} from '../store/groceryItemsSlice';
import { clearAllListeners } from '@reduxjs/toolkit';
import { GroceryItem } from '@/types/grocery';

export function useGroceryItems(userId: string) {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.groceryItems.items);
  const loading = useSelector((state: RootState) => state.groceryItems.loading);
  const error = useSelector((state: RootState) => state.groceryItems.error);
  const clearAllConfirmation = useSelector((state: RootState) => 
    state.groceryItems.clearAllConfirmation);
  const clearCheckedConfirmation = useSelector((state: RootState) => 
    state.groceryItems.clearCheckedConfirmation);


  const fetchItems = useCallback(() => {
    dispatch(fetchGroceryItems(userId));
  }, [dispatch]);

  const addItem = useCallback((name: string, recipeId?: number) => {
    dispatch(addGroceryItem({ name, recipe_id: recipeId || null }));
  }, [dispatch]);

  const toggleItem = useCallback((item: GroceryItem) => {
    dispatch(toggleGroceryItem({item}));
  }, [dispatch]);

  const deleteItem = useCallback((id: number) => {
    dispatch(deleteGroceryItem(id));
  }, [dispatch]);

  const setClearAllConfirmation = useCallback((v: boolean) => {
    dispatch(setClearAllConfirmationAction(v));
  }, [dispatch]);

  const setClearCheckedConfirmation = useCallback((v: boolean) => {
    dispatch(setClearCheckedConfirmationAction(v));
  }, [dispatch]);

  const clearCheckedGroceryItems = useCallback(() => {
    dispatch(clearCheckedItems(userId));
  }, [dispatch])

  const clearAllGroceryItems = useCallback(() => {
    dispatch(clearAllItems(userId));
  }, [dispatch]);

  return {
    items,
    loading,
    clearCheckedGroceryItems,
    clearAllGroceryItems,
    error,
    fetchItems,
    addItem,
    toggleItem,
    deleteItem,
    clearCheckedConfirmation,
    clearAllConfirmation,
    setClearCheckedConfirmation,
    setClearAllConfirmation,
    clearAllListeners,
  };
}
