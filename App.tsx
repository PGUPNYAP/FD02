import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import awsconfig from './src/aws-exports';
import { Authenticator } from '@aws-amplify/ui-react-native';
import Navigation from './src/navigation/Navigation';
import { useStorage, STORAGE_KEYS } from './src/hooks/useStorage';
import axios from 'axios';

// ✅ Configure Amplify
Amplify.configure(awsconfig);

export default function App() {
  const { setItem } = useStorage();

  useEffect(() => {
    const listener = async (data: any) => {
      console.log('🔁 Hub Event:', data.payload.event); // For debugging

      if (data.payload.event === 'signedIn') {
        const user = data.payload.data;
        const { email, name, phone_number, sub: cognitoId } = user.attributes;

        const payload = {
          email,
          name,
          phoneNumber: phone_number,
          cognitoId,
        };

        try {
          const res = await axios.post('http://10.0.2.2:3001/api/students', payload);
          const backendUser = res.data?.student || res.data;

          const userData = {
            id: backendUser.id,
            email,
            name,
            phoneNumber: phone_number,
            cognitoId,
            createdAt: new Date().toISOString(),
          };

          setItem(STORAGE_KEYS.CURRENT_USER, userData);
        } catch (err) {
          console.error('❌ Backend sync failed:', err);
        }
      }
    };

    const unsubscribe = Hub.listen('auth', listener);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Authenticator.Provider>
        {/* ✅ Simplify to avoid issues (you can add name & phone later once configured properly in Cognito) */}
        <Authenticator signUpAttributes={['email']}>
          <Navigation initialRoute="Home" />
        </Authenticator>
      </Authenticator.Provider>
    </SafeAreaView>
  );
}
