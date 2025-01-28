import { theme } from '@/constants/Colors';
import { NewColorMode } from '@/constants/NewColors';
import { supabase } from '@/services/SupabaseClient';
import { Recipe } from '@/types/recipe';
import React, { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Pressable } from 'react-native';


interface RecipeGroupProps {
  title?: string;
  recipes: Recipe[];
  onRecipePress: (recipe: Recipe) => void;
  colors: NewColorMode;
  accessoryButton?: ReactElement
}
const RecipeGroup = ({ title, recipes, onRecipePress, colors, accessoryButton }: RecipeGroupProps) => {
  const styles = getStyles(colors);

  return (
    <View style={styles.groupContainer}>
      {title && (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{title}</Text>
        </View>)}

      <View style={styles.recipesGrid}>
        {recipes.map((recipe, index) => (<>
          <Pressable
            key={recipe.id}
            style={[styles.recipeCard, index % 2 === 0 && styles.leftCard]}
            onPress={() => onRecipePress(recipe)}
          >
            <View style={{
              backgroundImage: `url('${recipe.image_url ? supabase.storage.from('recipe_images').getPublicUrl(recipe.image_url).data.publicUrl : ""}')`,
              ...styles.recipeImagePlaceholder
            }} />
            <View style={styles.recipeContent}>
              <Text style={styles.recipeTitle} numberOfLines={2}>
                {recipe.title}
              </Text>
            </View>
          </Pressable>
          {accessoryButton}
        </>
        ))}
      </View >
    </View>
  );
};

const getStyles = (colors: NewColorMode) => StyleSheet.create({
  contentContainer: {
    paddingVertical: 16,
  },
  groupContainer: {
    marginBottom: 24,
  },
  headerContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDarkerGray,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  recipeCard: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  leftCard: {
    paddingRight: 8,
  },
  recipeImagePlaceholder: {
    backgroundColor: colors.disabled,
    height: 130,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    borderRadius: 12,
    marginBottom: 8,
  },
  recipeContent: {
    paddingHorizontal: 4,
  },
  recipeTitle: {
    lineHeight: 20,
    height: 40,
    fontSize: 15,
    wordWrap: 'ellipsis',
    fontWeight: '600',
    color: colors.textDarkGray,
  },
});

export default RecipeGroup;