import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { UserIcon, EnvelopeIcon } from 'react-native-heroicons/outline';
import { useStorage, STORAGE_KEYS } from '../hooks/useStorage';
import { RootStackScreenProps } from '../types/navigation';

export default function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setItem, getItem } = useStorage();

  const handleLogin = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Missing Information', 'Please enter both name and email.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      // Check if user already exists
      const existingUsers = getItem<any[]>(STORAGE_KEYS.ALL_USERS) || [];
      const existingUser = existingUsers.find(user => user.email === email.trim());

      if (existingUser) {
        // User exists, log them in
        setItem(STORAGE_KEYS.CURRENT_USER, existingUser);
        Alert.alert('Welcome Back!', `Hello ${existingUser.name}`, [
          { text: 'OK', onPress: () => navigation.replace('Home') }
        ]);
      } else {
        // Create new user
        const newUser = {
          id: `user_${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          studentId: 'stu-1', // Map to backend student ID for API calls
          createdAt: new Date().toISOString(),
        };

        const updatedUsers = [...existingUsers, newUser];
        setItem(STORAGE_KEYS.ALL_USERS, updatedUsers);
        setItem(STORAGE_KEYS.CURRENT_USER, newUser);

        Alert.alert('Account Created!', `Welcome ${newUser.name}`, [
          { text: 'OK', onPress: () => navigation.replace('Home') }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
              <Text className="text-white font-bold text-2xl">FD</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome</Text>
            <Text className="text-gray-600 text-center">
              Enter your details to continue
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Name Input */}
            <View>
              <Text className="text-base font-medium text-gray-700 mb-2">
                Full Name
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                <UserIcon size={20} color="#6b7280" />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  className="flex-1 ml-3 text-gray-800 text-base"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View>
              <Text className="text-base font-medium text-gray-700 mb-2">
                Email Address
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                <EnvelopeIcon size={20} color="#6b7280" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  className="flex-1 ml-3 text-gray-800 text-base"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Login Button */}
            <Pressable
              onPress={handleLogin}
              disabled={!name.trim() || !email.trim() || isLoading}
              className={`py-4 rounded-xl mt-6 ${
                name.trim() && email.trim() && !isLoading
                  ? 'bg-blue-600'
                  : 'bg-gray-300'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Continue
                </Text>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <View className="mt-8">
            <Text className="text-center text-gray-500 text-sm">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}