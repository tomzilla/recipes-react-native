// AddToGroceryListModal.tsx
import { theme } from "@/constants/Colors";
import { supabase } from "@/services/SupabaseClient";
import { Recipe } from "@/types/recipe";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useColorScheme } from "react-native";
import { Checkbox } from '@/vendor/components/ui/checkbox';

interface IngredientSelection {
  id: string;
  name: string;
  isSelected: boolean;
}

interface AddToGroceryListModalProps {
  recipe: Recipe;
  isVisible: boolean;
  onClose: () => void;
}

export function AddToGroceryListModal({ recipe, isVisible, onClose }: AddToGroceryListModalProps) {
  const auth = useAuth();
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];
  const [ingredients, setIngredients] = useState<IngredientSelection[]>([]);
  useEffect(() => {
    if (isVisible) {
      loadIngredients();
    }

  }, [isVisible]);

  const loadIngredients = () => {
    const uniqueIngredients: string[] = [];
    
    recipe.json.steps.forEach((step) => {
      step.inputs.forEach((ingredient) => {

        if (ingredient.type == 'ingredient' && !uniqueIngredients.includes(ingredient.name)) {
          uniqueIngredients.push(ingredient.name);
        }
      })

    });

    setIngredients(
      uniqueIngredients.map((name) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        isSelected: true // All ingredients selected by default
      }))
    );
  };

  const toggleIngredient = (ingredientId: string) => {
    setIngredients(prev =>
      prev.map(ing =>
        ing.id === ingredientId
          ? { ...ing, isSelected: !ing.isSelected }
          : ing
      )
    );
  };

  const toggleAll = (value: boolean) => {
    setIngredients(prev =>
      prev.map(ing => ({ ...ing, isSelected: value }))
    );
  };

  const handleAddToGroceryList = async () => {
    try {
      const selectedIngredients = ingredients.filter(ing => ing.isSelected);
      
      if (selectedIngredients.length === 0) {
        Alert.alert("No Selection", "Please select at least one ingredient to add.");
        return;
      }

      const { error: insertError } = await supabase
      .from("grocery_items")
      .insert(
        ingredients.map(ingredient => ({
          user_id: auth?.user?.id,
          name: ingredient.name,
          recipe_id: recipe.id,
          checked: false,
        }))
      );

      if (insertError) throw insertError;

      Alert.alert("Success", "Selected ingredients added to grocery list!");
      onClose();
    } catch (error) {
      console.error("Error adding to grocery list:", error);
      Alert.alert("Error", "Failed to add ingredients to grocery list. Please try again.");
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Add ingredients from "{recipe?.title}"
          </Text>
          
          {/* Select All Option */}
          <TouchableOpacity
            style={styles.selectAllContainer}
            onPress={() => toggleAll(ingredients.some(ing => !ing.isSelected))}
          >
            <Checkbox 
              checked={ingredients.every(ing => ing.isSelected)}
              onCheckedChange={(checked) => toggleAll(checked)}
            />
            <Text style={[styles.selectAllText, { color: colors.textPrimary }]}>
              Select All
            </Text>
          </TouchableOpacity>

          {/* Ingredients List */}
          <ScrollView style={styles.ingredientsList}>
            {ingredients.map(ingredient => (
              <TouchableOpacity
                key={ingredient.id}
                style={styles.ingredientRow}
                onPress={() => toggleIngredient(ingredient.id)}
              >
                <Checkbox 
                  checked={ingredient.isSelected}
                  onCheckedChange={() => toggleIngredient(ingredient.id)}
                />
                <View style={styles.ingredientInfo}>
                  <Text style={[styles.ingredientName, { color: colors.secondary }]}>
                    {ingredient.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.secondary }]}
              onPress={handleAddToGroceryList}
            >
              <Text style={[styles.buttonText, { color: colors.surface }]}>
                Add Selected
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.wine }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: colors.surface }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: 'center',
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectAllText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  ingredientsList: {
    maxHeight: 400,
    marginVertical: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ingredientInfo: {
    marginLeft: 12,
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
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
  },
});
