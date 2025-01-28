import AddRecipeButton from "@/components/AddRecipeButton";
import { withUser } from "@/components/WithUser";
import { theme } from "@/constants/Colors";
import { NewColorMode } from "@/constants/NewColors";
import { useColors } from "@/hooks/useColors";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
function TabLayout() {
  const colors = useColors();
  const styles = getStyles(colors);
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
          backgroundColor: colors.white,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: colors.textDarkerGray,
        },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.white,
          borderTopWidth: 1,
          minHeight: 80,
          paddingTop: 20,
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          elevation: 2,
        }
      }}>
        <Tabs.Screen name="recipes"
          options={{
            href: '/home/recipes',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={colors.textLightGray} />,
          }} />
        <Tabs.Screen name="plan"
          options={{
            href: '/home/plan',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="calendar" color={colors.textLightGray} />,
          }} />
        <Tabs.Screen name="explore"
          options={{
            href: '/home/explore',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={colors.textLightGray} />,
          }} />
        <Tabs.Screen name="grocery"
          options={{
            href: '/home/grocery',
            tabBarIcon: ({ color }) => <FontAwesome size={28}  name="shopping-cart"  color={colors.textLightGray} />,
          }} />
      </Tabs>
    </>
  );
}
const getStyles = (colors: NewColorMode) => StyleSheet.create({
  backdrop: {
    top: 45,
    left: -10,
    width: 85,
    height: 85,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: -100000,
    elevation: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 45, // Adjust this value to position the button vertically
    alignSelf: 'center',
    zIndex: 1,
  }
});
export default withUser(TabLayout);