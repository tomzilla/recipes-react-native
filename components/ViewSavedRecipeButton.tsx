import { Tables } from "@/services/database.types";
import { Button } from "@rneui/themed";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react"

interface ViewSavedRecipeButtonProps {
    recipe: Tables<'recipes'>
}
export function ViewSavedRecipeButton({recipe}: ViewSavedRecipeButtonProps) {
    return (
    <Button 
        size="sm"
        className="w-full"
        onPress={() => {
          router.push(`/home/recipes/${recipe.id}`);
        }}
    >
        View Recipe
        <ArrowRight size={14} className="ml-1" />
    </Button>);
}
