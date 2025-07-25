import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getCurrentUser } from 'aws-amplify/auth';
import SplashScreen from '../screens/SplashScreen';
import TabNavigator from './TabNavigator';
import LibraryDetailsScreen from '../screens/LibraryDetailsScreen';
import EnhancedBookingScreen from '../screens/EnhancedBookingScreen';
import { navigationRef } from '../utils/NavigationUtil';
import { RootStackParamList } from '../types/navigation';
import ProfileScreen from '../screens/ProfileScreen';
import { useStorage, STORAGE_KEYS } from '../hooks/useStorage';

interface NavigationProps {
  initialRoute: 'Login' | 'Home';
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation({ initialRoute }: NavigationProps) {
  const [isReady, setIsReady] = React.useState(false);
  const [initialRouteName, setInitialRouteName] = React.useState<keyof RootStackParamList>('Splash');
  const { getItem } = useStorage();

  React.useEffect(() => {
    const checkAuthState = async () => {
      try {
        const currentUser = await getCurrentUser();
        const storedUser = getItem(STORAGE_KEYS.CURRENT_USER);
        
        if (currentUser && storedUser) {
          setInitialRouteName('Home');
        } else {
          setInitialRouteName('Splash');
        }
      } catch (error) {
        setInitialRouteName('Splash');
      } finally {
        setIsReady(true);
      }
    };

    checkAuthState();
  }, []);

  if (!isReady) {
    return null; // Or a loading spinner
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="LibraryDetails" component={LibraryDetailsScreen} />
        <Stack.Screen name="Booking" component={EnhancedBookingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
