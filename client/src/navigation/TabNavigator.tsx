import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/home/HomeScreen';
import BorrowListScreen from '../screens/borrow/BorrowListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            首页: 'home-outline',
            借阅: 'book-outline',
            我的: 'person-outline',
          };
          return <Ionicons name={icons[route.name] || 'help-outline'} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
      })}
    >
      <Tab.Screen name="首页" component={HomeScreen} />
      <Tab.Screen name="借阅" component={BorrowListScreen} />
      <Tab.Screen name="我的" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
