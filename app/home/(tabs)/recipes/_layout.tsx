import BackButton from "@/components/BackButton";
import { withUser } from "@/components/WithUser";
import { theme } from "@/constants/Colors";
import { useColors } from "@/hooks/useColors";
import { Stack } from "expo-router";
function TabLayout() {
  const colors = useColors();
  return (
    <Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.white,
      },
      headerTintColor: colors.textDarkerGray,
      headerTitleStyle: {
        fontWeight: '700',
        fontSize: 26,
        color: colors.textDarkerGray,
      },
      headerShadowVisible: false, // Removes the bottom border
      headerBackTitle: undefined, // Removes the back button text on iOS
      contentStyle: {
        backgroundColor: colors.white,
      }
    }}
  >
    <Stack.Screen 
      name="index"
      options={{
        headerTitle: "My Recipes",
        headerLargeTitle: true, // iOS large title
        headerLargeTitleStyle: {
          color: colors.textDarkerGray,
        },
        // headerSearchBarOptions: {
        //   placeholder: "Search recipes...",
        //   headerIconColor: colors.secondary,
        //   textColor: colors.textPrimary,
        //   hintTextColor: colors.secondary,
        // },
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

    <Stack.Screen 
      name="add_url"
      options={{
        headerTitle: "Add Recipe",
        presentation: 'modal',
        headerLeft: () => <BackButton />,
      }}
    />
  </Stack>
  );
}

export default withUser(TabLayout);