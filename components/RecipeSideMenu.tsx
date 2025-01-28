import { Recipe } from "@/types/recipe";
import PlanRecipeComponent from "./PlanRecipe";
import GroceryListButton from "./AddToGroceryListButton";
import AddFavoriteRecipeButton from "./AddFavoriteRecipeButton";
import { View } from "react-native";
import { StyleSheet } from "nativewind";

export interface RecipeSideMenuProps {
  recipe: Recipe
}

export default function RecipeSideMenu({recipe}: RecipeSideMenuProps) {
  return (
    <View style={[styles.floatingContainer]}>
      <AddFavoriteRecipeButton recipe={recipe} />
      <GroceryListButton recipe={recipe} />
      <PlanRecipeComponent recipe={recipe} />
    </View>
  )
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    right: 32,
    bottom: 0,
    zIndex: 1,
    paddingVertical: 16,
  }
})