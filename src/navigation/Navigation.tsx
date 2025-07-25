// src/navigation/Navigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import TabNavigator from './TabNavigator';
import LibraryDetailsScreen from '../screens/LibraryDetailsScreen';
import EnhancedBookingScreen from '../screens/EnhancedBookingScreen';



import { navigationRef } from '../utils/NavigationUtil';
import { RootStackParamList } from '../types/navigation';
import ProfileScreen from '../screens/ProfileScreen';

interface NavigationProps {
  initialRoute: 'Login' | 'Home';
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation({ initialRoute }: NavigationProps) {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Splash" component={SplashScreen} />
  {/* REMOVE AuthScreen/Login/Signup */}
  <Stack.Screen name="Home" component={TabNavigator} />
  <Stack.Screen name="Profile" component={ProfileScreen} />
  <Stack.Screen name="LibraryDetails" component={LibraryDetailsScreen} />
  <Stack.Screen name="Booking" component={EnhancedBookingScreen} />
</Stack.Navigator>

    </NavigationContainer>
  );
}
