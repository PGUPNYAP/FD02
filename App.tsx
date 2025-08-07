// App.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import amplifyconfig from './src/amplifyconfiguration.json';
import Navigation from './src/navigation/Navigation';
import './global.css';

const queryClient = new QueryClient();

// Configure Amplify
Amplify.configure(amplifyconfig);

export default function App() {
  const [user, setUser] = useState<string | null>('');
  const [loading, setLoading] = useState(true);
  
  console.log('User authentication status:', user ? 'Authenticated' : 'Not authenticated');

  const checkUser = async () => {
    try {
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();
      console.log("Aut access token : ",accessToken);
      setUser(accessToken || null);
      console.log('checkUser: User session found:', !!accessToken);
    } catch (e) {
      setUser(null);
      console.log('checkUser: No user found or error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();

    // Listen to auth events
    const unsubscribe = Hub.listen('auth', ({ payload: { event } }) => {
      console.log('Hub Auth Event detected:', event);
      if (
        event === 'signedIn' ||
        event === 'signedOut' ||
        event === 'tokenRefresh' 
      ) {
        checkUser();
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading application...</Text>
      </View>
    );
  }

  // Determine initial route based on authentication status
  const initialRoute = user ? 'Home' : 'Login';

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation initialRoute={initialRoute} />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});







// // App.tsx
// import React, { useEffect, useState } from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import Navigation from './src/navigation/Navigation';
// import { useStorage, STORAGE_KEYS } from './src/hooks/useStorage';
// import {Amplify} from 'aws-amplify';
// import amplifyconfig from './src/amplifyconfiguration.json';
// import SplashScreen from './src/screens/SplashScreen';
// import './global.css';
// import { MMKVStorageAdapter } from './src/hooks/MMKVStorageAdapter';

// const queryClient = new QueryClient();

// Amplify.configure({
//   ...amplifyconfig,
//     storage: MMKVStorageAdapter, // Use MMKV for Amplify's internal storage
// });



// export default function App() {
//   const [checking, setChecking] = useState(true);
//   const [initialRoute, setInitialRoute] = useState<'Login' | 'Home'>('Login');
//   const { getItem } = useStorage();

//   useEffect(() => {
//     const checkUser = async () => {
//       try {
//         const user = getItem(STORAGE_KEYS.CURRENT_USER);
//         if (user) {
//           setInitialRoute('Home');
//         }
//       } catch (err) {
//         console.error('Failed to load stored user:', err);
//       } finally {
//         setChecking(false);
//       }
//     };

//     checkUser();
//   }, []);

//   if (checking) {
//     return null; // or a loading spinner component
//   }

//   return (
//     <QueryClientProvider client={queryClient}>
//       <Navigation initialRoute={initialRoute} />
//     </QueryClientProvider>
//   );
// }
