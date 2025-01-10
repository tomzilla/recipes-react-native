import { Gift } from 'lucide-react';
import { ViewSavedRecipeButton } from './ViewSavedRecipeButton';
import { SavedRecipesType } from '@/types/saved_recipes';
import { theme } from '@/constants/Colors';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import RecipeGroup from './RecipeGroup';
import { ScrollView } from 'react-native-gesture-handler';
import { Recipe } from '@/types/recipe';

interface SavedRecipesProps {
  savedRecipes: SavedRecipesType[]
}

export function SavedRecipes({ savedRecipes }: SavedRecipesProps) {
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];

  const styles = getStyles(colors);

  return (
    <ScrollView 
    style={styles.container}
    contentContainerStyle={styles.contentContainer}
  >
    <RecipeGroup
      title="Featured Recipes"
      recipes={savedRecipes.map((savedReciep) => savedReciep.recipe)}
      onRecipePress={(recipe) => {
        router.push(`/home/recipes/${recipe.id}`);
      }}
      colors={colors}
    />
    </ScrollView>
  );
}

const getStyles = (colors: typeof theme.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  // loadingText: {
  //   color: colors.textSecondary,
  //   textAlign: 'center',
  //   padding: 20,
  // },
  // errorText: {
  //   color: colors.brand,
  //   textAlign: 'center',
  //   padding: 20,
  // },
});
