import { theme } from "@/constants/Colors";
import { supabase } from "@/services/SupabaseClient";
import { Recipe } from "@/types/recipe";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Modal } from "react-native";

import { Picker } from '@react-native-picker/picker';
import { useAuth } from "@/hooks/useAuth";
import { useColorScheme } from "react-native";
import { useMealPlan } from "@/hooks/useMealPlan";
import { FontAwesome } from "@expo/vector-icons";
interface PlanRecipeComponentProps {
  recipe: Recipe
}

export default function PlanRecipeComponent({recipe}: PlanRecipeComponentProps) {
  const auth = useAuth();

  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];
  const {fetchMealPlans} = useMealPlan();
  const [mealType, setMealType] = useState<"Breakfast" | "Lunch" | "Dinner">("Breakfast");
  const [planDate, setPlanDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility

  const handleAddToMealPlan = async () => {
    const { error } = await supabase.from("meal_plan").insert({
      user_id: auth?.user?.id, // Adjust based on your auth implementation
      recipe_id: recipe?.id,
      plan_date: planDate.toISOString(),
      meal_type: mealType.toLowerCase(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      Alert.alert("Error", "Failed to add to meal plan. Please try again.");
    } else {
      Alert.alert("Success", "Recipe added to meal plan!");
      console.log('success');
    }
    fetchMealPlans();
    setModalVisible(false);
  };

  return (
    <View>
    <View style={styles.floatingButton}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.brand }]}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome size={28} name="calendar" color={theme.light.surface} />
      </TouchableOpacity>
      </View>
    
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Plan this recipe:</Text>
            <Picker
              selectedValue={mealType}
              style={styles.picker}
              onValueChange={(itemValue) => setMealType(itemValue as "Breakfast" | "Lunch" | "Dinner")}
            >
              <Picker.Item label="Breakfast" value="Breakfast" />
              <Picker.Item label="Lunch" value="Lunch" />
              <Picker.Item label="Dinner" value="Dinner" />
            </Picker>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Select Date:</Text>
            <TextInput
              style={[styles.dateInput, { borderColor: colors.border, color: colors.textPrimary }]}
              value={planDate.toDateString()}
              onFocus={() => setShowDatePicker(true)}
              editable={false}
            />
            {showDatePicker && (
              <DateTimePicker
                value={planDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setPlanDate(date);
                }}
              />
            )}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                onPress={handleAddToMealPlan}
              >
                <Text style={[styles.buttonText, { color: colors.surface }]}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.wine }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color: colors.surface }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    borderRadius: 30,
  },
  container: {
    flex: 1,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "80%",
    padding: 16,
    borderRadius: 8,
  },
  mealPlanContainer: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  picker: {
    height: 50,
    marginBottom: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
})