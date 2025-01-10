import AddRecipeButton from "@/components/AddRecipeButton";
import { withUser } from "@/components/WithUser";
import { theme } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
function TabLayout() {
  const FloatingButtonWrapper = () => (
    <View style={styles.floatingButton}>
      <AddRecipeButton />
    </View>
  );
  return (
    <>
      <FloatingButtonWrapper />
      <Tabs screenOptions={{
        headerShown: false, tabBarActiveTintColor: 'blue', title: "",
        headerStyle: {
          backgroundColor: theme.light.backgroundAlt,
        },
        headerTintColor: theme.light.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: theme.light.textPrimary,
        },
        tabBarStyle: {
          backgroundColor: theme.light.backgroundAlt,
          borderTopColor: theme.light.backgroundAlt,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          elevation: 0,
        }
      }}>
        <Tabs.Screen name="recipes"
          options={{
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={theme.light.secondary} />,
          }} />
        <Tabs.Screen name="plan"
          options={{
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="calendar" color={theme.light.secondary} />,
          }} />
        <Tabs.Screen name="explore"
          options={{
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={theme.light.secondary} />,
          }} />
        <Tabs.Screen name="premium"
          options={{
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="star" color={theme.light.secondary} />,
          }} />
      </Tabs>
    </>
  );
}
const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20, // Adjust this value to position the button vertically
    alignSelf: 'center',
    zIndex: 1,
  }
});
export default withUser(TabLayout);