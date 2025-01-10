import { supabase } from "@/services/SupabaseClient";
import { setError } from "@/store/authSlice";
import { addMealPlan, removeMealPlan, setLoading, setMealPlans } from "@/store/mealPlanSlice";
import { RootState } from "@/store/store";
import { MealPlan, MealType } from "@/types/mealPlan";
import { useDispatch, useSelector } from "react-redux";

export const useMealPlan = () => {
  const dispatch = useDispatch();
  const { meals, loading, error } = useSelector((state: RootState) => state.mealPlan);
  const fetchMealPlans = async () =>  {
    try {
      dispatch(setLoading(true));
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('meal_plan')
        .select(`
          *,
          recipe:recipes (
            id,
            title
          )
        `)
        .gte('plan_date', today)
        .order('plan_date', { ascending: true });
      
      if (error) throw error;
      
      dispatch(setMealPlans(data));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch meal plans'));
    }
  };

  const createMealPlan = async(newMeal: Omit<MealPlan, 'created_at' | 'updated_at'>) => {
      try {
        dispatch(setLoading(true));
        
        const { data, error } = await supabase
          .from('meal_plan')
          .insert([newMeal])
          .select(`
            *,
            recipe:recipes (
              id,
              title
            )
          `)
          .single();
        
        if (error) throw error;
        
        dispatch(addMealPlan(data));
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : 'Failed to create meal plan'));
      }
  };

  const deleteMealPlan = async(
    id: number
  ) => {
    try {
      dispatch(setLoading(true));
      
      const { error } = await supabase
        .from('meal_plan')
        .delete()
        .match({ 
          id
        });
      
      if (error) throw error;
      
      dispatch(removeMealPlan({id}));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to delete meal plan'));
    }
  };
  
  return {
    meals,
    loading,
    error,
    fetchMealPlans,
    createMealPlan,
    deleteMealPlan
  };
}