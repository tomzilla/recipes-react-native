import BackButton from "@/components/BackButton";
import { withUser } from "@/components/WithUser";
import { theme } from "@/constants/Colors";
import { Stack } from "expo-router";
function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.light.surfaceAlt,
        },
        headerTintColor: theme.light.secondary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: theme.light.secondary,
        },
        headerShadowVisible: false, // Removes the bottom border
        headerBackTitle: undefined, // Removes the back button text on iOS
        contentStyle: {
          backgroundColor: theme.light.surfaceAlt,
        }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Grocery List",
          headerLargeTitle: true, // iOS large title
          headerLargeTitleStyle: {
            color: theme.light.secondary,
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