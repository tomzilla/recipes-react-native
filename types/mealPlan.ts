import { Tables } from '@/services/database.types';
import { Recipe } from './recipe';

// Types
export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MealPlan extends Tables<'meal_plan'> {
  recipe: Recipe
};

interface MealPlanState {
  meals: MealPlan[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: MealPlanState = {
  meals: [],
  loading: false,
  error: null,
};