import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSavedRecipes,
  selectAllSavedRecipes,
  selectSavedRecipesError,
  selectSavedRecipesStatus,
} from "../store/savedRecipesSlice";
import { AppDispatch } from "@/store/store";

export const useSavedRecipes = (userId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const recipes = useSelector(selectAllSavedRecipes);
  const status = useSelector(selectSavedRecipesStatus);
  const error = useSelector(selectSavedRecipesError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSavedRecipes(userId));
    }
  }, [status, userId, dispatch]);

  return {
    recipes,
    status,
    error,
    fetchSavedRecipes: () => dispatch(fetchSavedRecipes(userId)),
  };
};
