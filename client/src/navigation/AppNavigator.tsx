import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import TabNavigator from "./TabNavigator";
import BookDetailScreen from "../screens/home/BookDetailScreen";
import BorrowHistoryScreen from "../screens/borrow/BorrowHistoryScreen";
import CardStatusScreen from "../screens/profile/CardStatusScreen";
import SearchScreen from "../screens/search/SearchScreen";
import CategoryScreen from "../screens/category/CategoryScreen";
import ReserveScreen from "../screens/borrow/ReserveScreen";
import MessageScreen from "../screens/message/MessageScreen";
import ChangePasswordScreen from "../screens/profile/ChangePasswordScreen";
import AboutScreen from "../screens/about/AboutScreen";
import { useAuthStore } from "../store/authStore";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  BookDetail: { bookId: number };
  BorrowHistory: undefined;
  CardStatus: undefined;
  Search: undefined;
  Category: undefined;
  Reserve: undefined;
  Message: undefined;
  ChangePassword: undefined;
  About: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} />
            <Stack.Screen
              name="BorrowHistory"
              component={BorrowHistoryScreen}
            />
            <Stack.Screen name="CardStatus" component={CardStatusScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="Reserve" component={ReserveScreen} />
            <Stack.Screen name="Message" component={MessageScreen} />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
            />
            <Stack.Screen name="About" component={AboutScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
