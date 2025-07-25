import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import awsconfig from './src/aws-exports.js';
import { Authenticator } from '@aws-amplify/ui-react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './src/navigation/Navigation';
import { useStorage, STORAGE_KEYS } from './src/hooks/useStorage';
import { studentApi } from './src/services/api';

// ✅ Configure Amplify
Amplify.configure(awsconfig);

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  const { setItem } = useStorage();

  useEffect(() => {
    const listener = async (data: any) => {
      console.log('🔁 Hub Event:', data.payload.event);

      if (data.payload.event === 'signedIn') {
        const user = data.payload.data;
        const { email, name, phone_number, sub: cognitoId, given_name, family_name } = user.attributes;

        const payload = {
          email,
          name: name || `${given_name || ''} ${family_name || ''}`.trim(),
          phoneNumber: phone_number,
          cognitoId,
          username: email.split('@')[0], // Generate username from email
        };

        try {
          console.log('📤 Syncing user to backend:', payload);
          const response = await studentApi.createStudent(payload);
          const backendUser = response.data?.student || response.data;

          const userData = {
            id: backendUser?.id || `temp-${Date.now()}`,
            email,
            name: payload.name,
            phoneNumber: phone_number,
            cognitoId,
            backendStudentId: backendUser?.id,
            createdAt: new Date().toISOString(),
          };

          console.log('💾 Storing user data:', userData);
          setItem(STORAGE_KEYS.CURRENT_USER, userData);
        } catch (err) {
          console.error('❌ Backend sync failed:', err);
          // Still store user data locally even if backend sync fails
          const fallbackUserData = {
            id: `temp-${Date.now()}`,
            email,
            name: payload.name,
            phoneNumber: phone_number,
            cognitoId,
            createdAt: new Date().toISOString(),
          };
          setItem(STORAGE_KEYS.CURRENT_USER, fallbackUserData);
        }
      }

      if (data.payload.event === 'signedOut') {
        console.log('👋 User signed out');
        // Clear user data on sign out
        setItem(STORAGE_KEYS.CURRENT_USER, null);
      }
    };

    const unsubscribe = Hub.listen('auth', listener);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1 }}>
        <Authenticator.Provider>
          <Authenticator 
            signUpAttributes={['email', 'given_name', 'family_name', 'phone_number']}
            socialProviders={[]}
          >
            <Navigation initialRoute="Home" />
          </Authenticator>
        </Authenticator.Provider>
      </SafeAreaView>
    </QueryClientProvider>
  );
}
