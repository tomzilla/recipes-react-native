import RecipeComponent from "@/components/Recipe";
import { supabase } from "@/services/SupabaseClient";
import { Recipe } from "@/types/recipe";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";

export default function Index() {
  const local = useLocalSearchParams();
  console.log("LOCAL: ", local);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  useEffect(() => {
    (async () => {
      const {data, error} = await supabase.from('recipes').select('*').eq('id', local.recipe).returns<Recipe>().limit(1).single();
      if (data) {
        setRecipe(data);
      } else {
        console.warn("Failed to load recipe: ", error);
      }
    })();
  }, [local.recipe]);

  if (!recipe) {
    return null;
  }
  
  return (
    <RecipeComponent recipe={recipe} />
  )
}