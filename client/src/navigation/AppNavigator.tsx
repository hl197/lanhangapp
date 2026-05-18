import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import TabNavigator from './TabNavigator';
import BookDetailScreen from '../screens/home/BookDetailScreen';
import BorrowHistoryScreen from '../screens/borrow/BorrowHistoryScreen';
import CardStatusScreen from '../screens/profile/CardStatusScreen';
import { useAuthStore } from '../store/authStore';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  BookDetail: { bookId: number };
  BorrowHistory: undefined;
  CardStatus: undefined;
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
            <Stack.Screen name="BorrowHistory" component={BorrowHistoryScreen} />
            <Stack.Screen name="CardStatus" component={CardStatusScreen} />
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
