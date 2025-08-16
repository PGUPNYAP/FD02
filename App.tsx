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

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
}








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
