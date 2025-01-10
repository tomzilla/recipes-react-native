import { Pressable, Text } from "react-native";
import { SavedRecipesType } from "@/types/saved_recipes";
import { useColorScheme } from "react-native";
import { theme } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
function getDomain(url: string) {
  const u = URL.parse(url);
  if (!u) {
    return '';
  }
  return `${u?.protocol}//${u.host}`;
}

interface ViewSavedRecipeButtonProps {
  recipe: SavedRecipesType
}

export function ViewSavedRecipeButton({ recipe }: ViewSavedRecipeButtonProps) {
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];

  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonText: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '500',
    }
  });

  return (
    <Pressable style={styles.button}
      onPress={() => {
        router.push(`/home/recipes/${recipe.recipe.id}`);
      }}
    >
      <Text style={styles.buttonText}>{recipe.recipe.title}</Text>
      <Text className="text-xs text-gray-500">{getDomain(recipe.recipe.url)}</Text>
      <Text className="text-xs text-gray-500">{recipe.recipe.created_at && new Date(recipe.recipe.created_at).toDateString()}</Text>
    </Pressable>
  );
}