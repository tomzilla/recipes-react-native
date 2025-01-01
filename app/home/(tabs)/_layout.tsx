import { withUser } from "@/components/WithUser";
import { Tabs } from "expo-router";
function TabLayout() {
  return (
      <Tabs screenOptions={{headerShown: false}}>
        <Tabs.Screen name="recipes" />
        <Tabs.Screen name="plan" />
        <Tabs.Screen name="explore" />
        <Tabs.Screen name="premium" />
      </Tabs>
  );
}

export default withUser(TabLayout);