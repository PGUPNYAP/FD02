// src/components/GoogleLoginButton.tsx
import React from 'react';
import { Button, Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { resetAndNavigate } from '../utils/NavigationUtil';

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    try {
      // 1. Ensure Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // 2. Sign in with Google and get user info
      const userInfo = await GoogleSignin.signIn();

      // 3. Get the ID token
      const { idToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error('Google Sign-In failed: ID token is null');
      }

      // 4. Send token to backend to save or verify user
      const res = await fetch('http://10.0.2.2:3000/api/user/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) {
        const errRes = await res.text();
        throw new Error(`Backend error: ${res.status} - ${errRes}`);
      }

      const data = await res.json();
      console.log('✅ Logged in as:', data.name);

      // 5. Navigate to home screen
      resetAndNavigate('Home');

    } catch (err: any) {
      console.error('❌ Google Sign-In error:', err.message || err);
      Alert.alert('Error', err.message || 'Failed to sign in with Google');
    }
  };

  return <Button title="Sign in with Google" onPress={handleGoogleLogin} />;
}
