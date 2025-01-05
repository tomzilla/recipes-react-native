import { withUser } from "@/components/WithUser";
import { theme } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
function TabLayout() {
  return (
      <Tabs screenOptions={{headerShown: false,tabBarActiveTintColor: 'blue', title: "",
        tabBarStyle: {
          backgroundColor: theme.light.backgroundAlt,
          borderTopColor: theme.light.backgroundAlt,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          elevation: 0,
        }
      }}>
        <Tabs.Screen name="recipes"
          options={{
            tabBarIcon: ({color}) => <FontAwesome size={28} name="book" color={theme.light.secondary} />,
          }} />
        <Tabs.Screen name="plan" 
          options={{
            tabBarIcon: ({color}) => <FontAwesome size={28} name="calendar" color={theme.light.secondary} />,
          }} />
        <Tabs.Screen name="explore"
          options={{
            tabBarIcon: ({color}) => <FontAwesome size={28} name="search" color={theme.light.secondary} />,
          }} />
        <Tabs.Screen name="premium"
          options={{
            tabBarIcon: ({color}) => <FontAwesome size={28} name="star" color={theme.light.secondary} />,
          }} />
      </Tabs>
  );
}

export default withUser(TabLayout);