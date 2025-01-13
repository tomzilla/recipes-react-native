import { theme } from '@/constants/Colors';
import { useCuratedRecipes } from '@/hooks/useCuratedRecipes';
import { Recipe } from '@/types/recipe';
import React from 'react';
import { View, Text, ScrollView, useColorScheme, StyleSheet } from 'react-native';
import RecipeGroup from './RecipeGroup';

interface CuratedRecipesViewProps {
  onRecipePress: (recipe: Recipe) => void;
}
export const CuratedRecipesView: React.FC<CuratedRecipesViewProps> = ({ onRecipePress }) => {
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];
  const { trending, curated, loading, error } = useCuratedRecipes();
  const styles = getStyles(colors);
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading recipes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Example grouping - modify based on your categorization needs
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <RecipeGroup
        title="Featured Recipes"
        recipes={curated}
        onRecipePress={onRecipePress}
        colors={colors}
      />
      <RecipeGroup
        title="Trending Now"
        recipes={trending}
        onRecipePress={onRecipePress}
        colors={colors}
      />
    </ScrollView>
  );
};

const getStyles = (colors: typeof theme.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  loadingText: {
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.brand,
    textAlign: 'center',
    padding: 20,
  },
});
