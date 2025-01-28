import { theme } from "@/constants/Colors";
import { Recipe } from "@/types/recipe";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useColorScheme } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useCallback } from "react";

interface AddFavoriteRecipeButtonProps {
  recipe: Recipe;
}

export default function AddFavoriteRecipeButton({ recipe }: AddFavoriteRecipeButtonProps) {
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];
  const auth = useAuth();
  if (!auth?.user?.id) {
    return null;
  }

  const {recipeIds, saveRecipe, unsaveRecipe, fetchSavedRecipes} = useSavedRecipes(auth?.user?.id);

  const handlePress = useCallback(() => {
    (async () => {
      let p;
      console.log(recipeIds, recipe.id)
      if (recipe.id.toString() in recipeIds) {
        p = unsaveRecipe(recipe.id);
      } else {
        p = saveRecipe(recipe.id);
      }
      await p;
      console.log('refreshing');
      fetchSavedRecipes();
    })();
  }, [recipeIds]);

  return (
    <View>
      <View style={[styles.floatingButton]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.secondary }]}
          onPress={() => handlePress()}
        >
          <FontAwesome size={28} name="heart" color={recipe.id.toString() in recipeIds ? 'red' : theme.light.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    marginTop: 16,
    borderRadius: 30,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  }
});