// App.tsx
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './src/navigation/Navigation';
import { useStorage, STORAGE_KEYS } from './src/hooks/useStorage';

import SplashScreen from './src/screens/SplashScreen';
import './global.css';


const queryClient = new QueryClient();

export default function App() {
  const [checking, setChecking] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Home'>('Login');
  const { getItem } = useStorage();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = getItem(STORAGE_KEYS.CURRENT_USER);
        if (user) {
          setInitialRoute('Home');
        }
      } catch (err) {
        console.error('Failed to load stored user:', err);
      } finally {
        setChecking(false);
      }
    };

    checkUser();
  }, []);

  if (checking) {
    return null; // or a loading spinner component
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation initialRoute={initialRoute} />
    </QueryClientProvider>
  );
}
