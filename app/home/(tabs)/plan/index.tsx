import { theme } from "@/constants/Colors";
import { useMealPlan } from "@/hooks/useMealPlan";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, useColorScheme, TouchableOpacity } from "react-native";

export default function Plan() {
  const { meals, fetchMealPlans } = useMealPlan();
  const [mealPlanByDate, setMealPlanByDate] = useState<{ [date: string]: typeof meals }>({});
  const colorScheme = useColorScheme();
  const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    fetchMealPlans();
  }, []);

  useEffect(() => {
    const generateMealPlanForNext10Days = () => {
      const today = new Date();
      const next10Days = Array.from({ length: 10 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() + i);
        return date.toISOString().split("T")[0]; // ISO date string (YYYY-MM-DD)
      });

      const groupedMeals: { [date: string]: typeof meals } = {};
      next10Days.forEach((date) => {
        groupedMeals[date] = meals.filter((meal) => meal.plan_date.startsWith(date));
      });

      setMealPlanByDate(groupedMeals);
    };

    generateMealPlanForNext10Days();
  }, [meals]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    dateSection: {
      marginBottom: 24,
    },
    dateHeader: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
    },
    mealItem: {
      padding: 8,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: colors.surface,
    },
    mealText: {
      fontSize: 16,
      textTransform: "capitalize"
    },
    noMealText: {
      fontSize: 14,
      fontStyle: "italic",
    },
  });
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={Object.keys(mealPlanByDate)}
        keyExtractor={(date) => date}
        renderItem={({ item: date }) => (
          <View style={styles.dateSection}>
            <Text style={[styles.dateHeader, { color: colors.textPrimary }]}>
              {new Date(date).toDateString()}
            </Text>
            {mealPlanByDate[date].length > 0 ? (
              mealPlanByDate[date].map((meal) => (
                <TouchableOpacity
                  key={meal.recipe_id}
                  style={styles.mealItem}
                  onPress={() => router.push(`/home/plan/${meal.recipe.id}`)} // Navigate on press
                >
                  <Text style={[styles.mealText, { color: colors.textSecondary }]}>
                    {meal.recipe.title} - {meal.meal_type}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={[styles.noMealText, { color: colors.textSecondary }]}>
                No meals planned.
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

