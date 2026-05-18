import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/home/HomeScreen";
import BorrowListScreen from "../screens/borrow/BorrowListScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { COLORS } from "../utils/constants";

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  首页: "home",
  借阅: "book",
  我的: "person",
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={TAB_ICONS[route.name] || "help"}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textHint,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 8,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "500" as const },
        headerShown: false,
      })}
    >
      <Tab.Screen name="首页" component={HomeScreen} />
      <Tab.Screen name="借阅" component={BorrowListScreen} />
      <Tab.Screen name="我的" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
