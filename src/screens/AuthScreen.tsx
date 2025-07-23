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
  ScrollView,
} from 'react-native';
import { UserIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon } from 'react-native-heroicons/outline';
import { useStorage, STORAGE_KEYS } from '../hooks/useStorage';
import { studentApi } from '../services/api';
import { RootStackScreenProps } from '../types/navigation';

interface AuthFormData {
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
}

export default function AuthScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { setItem } = useStorage();

  const validateForm = (): boolean => {
    const { email, username, password, phoneNumber } = formData;
    
    if (!email.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    if (username.length < 3) {
      Alert.alert('Invalid Username', 'Username must be at least 3 characters long.');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
      return false;
    }

    if (!isLogin && (!phoneNumber.trim() || phoneNumber.length < 10)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
      return false;
    }

    return true;
  };

  const generateStudentIds = (username: string) => {
    const studentId = `stu-${username.substring(0, 3)}-${Date.now()}`;
    const cognitoId = `cognito-${username}-${Math.floor(Math.random() * 10000)}`;
    return { studentId, cognitoId };
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { studentId, cognitoId } = generateStudentIds(formData.username);
      
      const studentData = {
        cognitoId,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        firstName: '', // Optional field
        lastName: '', // Optional field
      };

      console.log('Creating student with data:', studentData);

      // Post to backend
      const response = await studentApi.createStudent(studentData);
      
      if (response.success || response.message === 'Student created successfully') {
        // Store in MMKV
        const userDataForStorage = {
          id: studentId,
          cognitoId,
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          createdAt: new Date().toISOString(),
        };

        setItem(STORAGE_KEYS.CURRENT_USER, userDataForStorage);

        Alert.alert(
          'Success!', 
          isLogin ? `Welcome back ${formData.username}!` : `Account created successfully!`,
          [{ text: 'OK', onPress: () => navigation.replace('Home') }]
        );
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        Alert.alert('User Exists', 'This user already exists. Try logging in instead.');
      } else if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-6 py-8">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
                <Text className="text-white font-bold text-2xl">FD</Text>
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Text>
              <Text className="text-gray-600 text-center">
                {isLogin ? 'Sign in to your account' : 'Join Focus Desk today'}
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Email Input */}
              <View>
                <Text className="text-base font-medium text-gray-700 mb-2">
                  Email Address *
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                  <EnvelopeIcon size={20} color="#6b7280" />
                  <TextInput
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                    placeholder="Enter your email"
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Username Input */}
              <View>
                <Text className="text-base font-medium text-gray-700 mb-2">
                  Username *
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                  <UserIcon size={20} color="#6b7280" />
                  <TextInput
                    value={formData.username}
                    onChangeText={(value) => updateFormData('username', value)}
                    placeholder="Enter username (min 3 chars)"
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-base font-medium text-gray-700 mb-2">
                  Password *
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                  <LockClosedIcon size={20} color="#6b7280" />
                  <TextInput
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
                    placeholder="Enter password (min 6 chars)"
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry
                  />
                </View>
              </View>

              {/* Phone Number Input */}
              <View>
                <Text className="text-base font-medium text-gray-700 mb-2">
                  Phone Number {!isLogin && '*'}
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                  <PhoneIcon size={20} color="#6b7280" />
                  <TextInput
                    value={formData.phoneNumber}
                    onChangeText={(value) => updateFormData('phoneNumber', value)}
                    placeholder="Enter phone number"
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleAuth}
                disabled={isLoading}
                className={`py-4 rounded-xl mt-6 ${
                  isLoading ? 'bg-gray-300' : 'bg-blue-600'
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Text>
                )}
              </Pressable>

              {/* Toggle Auth Mode */}
              <Pressable
                onPress={() => setIsLogin(!isLogin)}
                className="mt-4"
              >
                <Text className="text-center text-blue-600 font-medium">
                  {isLogin 
                    ? "Don't have an account? Sign Up" 
                    : "Already have an account? Sign In"
                  }
                </Text>
              </Pressable>
            </View>

            {/* Footer */}
            <View className="mt-8">
              <Text className="text-center text-gray-500 text-sm">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}