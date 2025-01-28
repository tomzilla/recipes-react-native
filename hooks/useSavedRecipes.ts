import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSavedRecipes,
  selectAllSavedRecipes,
  selectRecipeIds,
  selectSavedRecipesError,
  selectSavedRecipesStatus,
} from "../store/savedRecipesSlice";
import { AppDispatch } from "@/store/store";
import { supabase } from "@/services/SupabaseClient";

export const useSavedRecipes = (userId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const recipes = useSelector(selectAllSavedRecipes);
  const status = useSelector(selectSavedRecipesStatus);
  const recipeIds = useSelector(selectRecipeIds);
  const error = useSelector(selectSavedRecipesError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSavedRecipes(userId));
    }
  }, [status, userId, dispatch]);

  const saveRecipe = async (recipeId: number) => {
    console.log('Saving recipe to profile');
    await supabase.from('saved_recipes').upsert({
      user_id: userId,
      recipe_id: recipeId,
      state: 'saved',
    });

    fetchSavedRecipes(userId);
  };

  const unsaveRecipe = async (recipeId: number) => {
    console.log('Unsaving recipe');
    await supabase.from('saved_recipes').delete().eq('user_id', userId).eq('recipe_id', recipeId);
    fetchSavedRecipes(userId);
  };
  
  return {
    saveRecipe,
    unsaveRecipe,
    recipes,
    recipeIds,
    status,
    error,
    fetchSavedRecipes: () => dispatch(fetchSavedRecipes(userId)),
  };
};
