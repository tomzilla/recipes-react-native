import { MealPlan, MealType } from "@/types/mealPlan";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MealPlanState {
  meals: MealPlan[];
  loading: boolean;
  error: string | null;
}
// Slice
const initialState: MealPlanState = {
  meals: [],
  loading: false,
  error: null,
};


const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState,
  reducers: {
    setMealPlans: (state, action: PayloadAction<MealPlan[]>) => {
      //@ts-ignore
      state.meals = action.payload;
      state.loading = false;
      state.error = null;
    },
    addMealPlan: (state, action: PayloadAction<MealPlan>) => {
      state.meals.push(action.payload);
    },
    removeMealPlan: (state, action: PayloadAction<{ id: number }>) => {
      const { id } = action.payload;
      state.meals = state.meals.filter(
        meal => 
          (meal.id !== id)
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {setMealPlans, addMealPlan, removeMealPlan, setLoading, setError } = mealPlanSlice.actions;
export default mealPlanSlice.reducer;
