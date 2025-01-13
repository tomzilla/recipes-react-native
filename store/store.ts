import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tagsReducer from './tagsSlice';
import mealPlanReducer from './mealPlanSlice';
import savedRecipesReducer from './savedRecipesSlice';
import curatedRecipesReducers from './curatedRecipesSlice';
import groceryItemsReducers from './groceryItemsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tags: tagsReducer,
    savedRecipes: savedRecipesReducer,
    mealPlan: mealPlanReducer,
    curatedRecipes: curatedRecipesReducers,
    groceryItems: groceryItemsReducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
