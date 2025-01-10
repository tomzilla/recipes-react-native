import BackButton from "@/components/BackButton";
import { withUser } from "@/components/WithUser";
import { theme } from "@/constants/Colors";
import { Stack } from "expo-router";
function TabLayout() {
  return (
    <Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.light.backgroundAlt,
      },
      headerTintColor: theme.light.textPrimary,
      headerTitleStyle: {
        fontWeight: '600',
        fontSize: 18,
        color: theme.light.textPrimary,
      },
      headerShadowVisible: false, // Removes the bottom border
      headerBackTitle: undefined, // Removes the back button text on iOS
      contentStyle: {
        backgroundColor: theme.light.background,
      }
    }}
  >
    <Stack.Screen 
      name="index"
      options={{
        headerTitle: "Meal Plan",
        headerLargeTitle: true, // iOS large title
        headerLargeTitleStyle: {
          color: theme.light.textPrimary,
        },
      }}
    />

    <Stack.Screen 
      name="[recipe]"
      options={{
        headerLeft: () => <BackButton />,
        headerTitle: "",
        // headerTransparent: true,
        headerBlurEffect: "light",
      }}
    />
  </Stack>
  );
}

export default withUser(TabLayout);