import BackButton from "@/components/BackButton";
import { withUser } from "@/components/WithUser";
import { Stack } from "expo-router";
function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="[recipe]"
        options={{
          headerLeft: () => <BackButton />,
        }} />
    </Stack>
  );
}

export default withUser(TabLayout);