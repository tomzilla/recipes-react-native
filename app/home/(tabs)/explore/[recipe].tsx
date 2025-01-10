import RecipeComponent from "@/components/Recipe";
import { supabase } from "@/services/SupabaseClient";
import { Recipe } from "@/types/recipe";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/constants/Colors";
import PlanRecipeComponent from "@/components/PlanRecipe";

export default function Index() {
  const local = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const auth = useAuth();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", local.recipe)
        .returns<Recipe>()
        .limit(1)
        .single();
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
    <View style={[styles.container, { backgroundColor: theme.light.background }]}>
      <RecipeComponent recipe={recipe} />
      <PlanRecipeComponent recipe={recipe} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }});