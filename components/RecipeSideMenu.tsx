import { Recipe } from "@/types/recipe";
import PlanRecipeComponent from "./PlanRecipe";
import GroceryListButton from "./AddToGroceryListButton";

export interface RecipeSideMenuProps {
  recipe: Recipe
}

export default function RecipeSideMenu({recipe}: RecipeSideMenuProps) {
  return (
    <>
      <PlanRecipeComponent recipe={recipe} />
      <GroceryListButton recipe={recipe} />

    </>
  )
}