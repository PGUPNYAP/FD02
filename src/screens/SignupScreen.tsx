// src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signUpUser } from '../api/authService';
import { resetAndNavigate } from '../utils/NavigationUtil';
import auth from '@react-native-firebase/auth';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const userCred = await signUpUser(email, password);
      const token = await userCred.user.getIdToken();
      const uid = userCred.user.uid;

      const res = await fetch('http://10.0.2.2:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, name, phone, email }),
      });

      if (res.ok) {
        Alert.alert('Success', 'Account created!');
        resetAndNavigate('Home');
      } else {
        const errorRes = await res.json();
        Alert.alert('Error', errorRes.message || 'Failed to save user');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Signup Failed', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Full Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Phone Number" keyboardType="phone-pad" style={styles.input} value={phone} onChangeText={setPhone} />
      <TextInput placeholder="Email" keyboardType="email-address" autoCapitalize="none" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
