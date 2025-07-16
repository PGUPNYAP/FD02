// App.tsx
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './src/navigation/Navigation';
import { getStoredUser } from './src/utils/storage';
import { configureGoogleSignin } from './src/config/googleSignIn';
import SplashScreen from './src/screens/SplashScreen';
import './global.css';


const queryClient = new QueryClient();

export default function App() {
  const [checking, setChecking] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Home'>('Login');

  useEffect(() => {
    configureGoogleSignin();

    const checkUser = async () => {
      try {
        const user = await getStoredUser();
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
      {/* Pass initialRoute to your Navigation so it can decide start screen */}
      <Navigation />
    </QueryClientProvider>
  );
}
