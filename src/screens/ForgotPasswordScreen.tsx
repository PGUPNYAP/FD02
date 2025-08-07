import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import {
  EnvelopeIcon,
  LockClosedIcon,
  KeyIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from 'react-native-heroicons/outline';

// Define navigation stack parameter list
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

interface ForgotPasswordStep {
  step: 1 | 2;
}

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Step 1: Request reset code
  const handleResetPassword = async (): Promise<void> => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const { nextStep } = await resetPassword({ username: email.trim() });

      if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        Alert.alert(
          'Code Sent',
          'A verification code has been sent to your email address. Please check your inbox.',
          [{ text: 'OK', onPress: () => setStep(2) }]
        );
      } else if (nextStep.resetPasswordStep === 'DONE') {
        Alert.alert('Success', 'Password reset is complete.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error: any) {
      console.error('Reset Error:', error);
      let errorMessage = 'Failed to send reset code';
      
      if (error.name === 'UserNotFoundException') {
        errorMessage = 'No account found with this email address';
      } else if (error.name === 'LimitExceededException') {
        errorMessage = 'Too many attempts. Please try again later';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Confirm reset with code
  const handleConfirmResetPassword = async (): Promise<void> => {
    if (!code.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await confirmResetPassword({
        username: email.trim(),
        confirmationCode: code.trim(),
        newPassword: newPassword.trim(),
      });

      Alert.alert(
        'Success',
        'Your password has been changed successfully. Please log in with your new password.',
        [
          {
            text: 'Login Now',
            onPress: () => {
              // Reset form
              setStep(1);
              setCode('');
              setNewPassword('');
              setConfirmPassword('');
              navigation.navigate('Login');
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Confirm Reset Error:', error);
      let errorMessage = 'Failed to reset password';
      
      if (error.name === 'CodeMismatchException') {
        errorMessage = 'Invalid verification code. Please try again';
      } else if (error.name === 'ExpiredCodeException') {
        errorMessage = 'Verification code has expired. Please request a new one';
      } else if (error.name === 'InvalidPasswordException') {
        errorMessage = 'Password does not meet requirements';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const renderStep1 = () => (
    <>
      {/* Header */}
      <View className="items-center mb-8">
        <View className="w-20 h-20 bg-orange-500 rounded-full items-center justify-center mb-4">
          <KeyIcon size={32} color="white" />
        </View>
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Forgot Password?
        </Text>
        <Text className="text-gray-600 text-center px-4">
          Enter your email address and we'll send you a verification code to reset your password
        </Text>
      </View>

      {/* Email Input */}
      <View className="mb-6">
        <Text className="text-base font-medium text-gray-700 mb-2">
          Email Address *
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
          <EnvelopeIcon size={20} color="#6b7280" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email address"
            className="flex-1 ml-3 text-gray-800 text-base"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!isLoading}
          />
        </View>
      </View>

      {/* Send Code Button */}
      <Pressable
        onPress={handleResetPassword}
        disabled={isLoading || !email.trim()}
        className={`py-4 rounded-xl mb-4 ${
          isLoading || !email.trim() ? 'bg-gray-300' : 'bg-orange-500'
        }`}
      >
        {isLoading ? (
          <View className="flex-row items-center justify-center">
            <ActivityIndicator color="white" size="small" />
            <Text className="text-white font-semibold text-lg ml-2">
              Sending Code...
            </Text>
          </View>
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Send Verification Code
          </Text>
        )}
      </Pressable>
    </>
  );

  const renderStep2 = () => (
    <>
      {/* Header */}
      <View className="items-center mb-8">
        <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-4">
          <CheckCircleIcon size={32} color="white" />
        </View>
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Enter Verification Code
        </Text>
        <Text className="text-gray-600 text-center px-4">
          We've sent a verification code to{'\n'}
          <Text className="font-medium text-gray-800">{email}</Text>
        </Text>
      </View>

      {/* Verification Code Input */}
      <View className="mb-4">
        <Text className="text-base font-medium text-gray-700 mb-2">
          Verification Code *
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
          <KeyIcon size={20} color="#6b7280" />
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Enter 6-digit code"
            className="flex-1 ml-3 text-gray-800 text-base"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            maxLength={6}
            editable={!isLoading}
          />
        </View>
      </View>

      {/* New Password Input */}
      <View className="mb-4">
        <Text className="text-base font-medium text-gray-700 mb-2">
          New Password *
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
          <LockClosedIcon size={20} color="#6b7280" />
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            className="flex-1 ml-3 text-gray-800 text-base"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            autoComplete="new-password"
            editable={!isLoading}
          />
        </View>
        <Text className="text-xs text-gray-500 mt-1">
          Password must be at least 8 characters long
        </Text>
      </View>

      {/* Confirm Password Input */}
      <View className="mb-6">
        <Text className="text-base font-medium text-gray-700 mb-2">
          Confirm New Password *
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
          <LockClosedIcon size={20} color="#6b7280" />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            className="flex-1 ml-3 text-gray-800 text-base"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            autoComplete="new-password"
            editable={!isLoading}
          />
        </View>
      </View>

      {/* Reset Password Button */}
      <Pressable
        onPress={handleConfirmResetPassword}
        disabled={isLoading || !code.trim() || !newPassword.trim() || !confirmPassword.trim()}
        className={`py-4 rounded-xl mb-4 ${
          isLoading || !code.trim() || !newPassword.trim() || !confirmPassword.trim()
            ? 'bg-gray-300'
            : 'bg-green-500'
        }`}
      >
        {isLoading ? (
          <View className="flex-row items-center justify-center">
            <ActivityIndicator color="white" size="small" />
            <Text className="text-white font-semibold text-lg ml-2">
              Resetting Password...
            </Text>
          </View>
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Reset Password
          </Text>
        )}
      </Pressable>

      {/* Back to Step 1 */}
      <Pressable
        onPress={handleBackToStep1}
        disabled={isLoading}
        className="py-3"
      >
        <Text className="text-center text-orange-600 font-medium text-base">
          Didn't receive code? Try again
        </Text>
      </Pressable>
    </>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <SafeAreaView className="flex-1 bg-gray-50">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Back Button */}
            <View className="px-6 pt-4">
              <Pressable
                onPress={() => navigation.navigate('Login')}
                className="flex-row items-center w-12 h-12 justify-center"
                disabled={isLoading}
              >
                <ArrowLeftIcon size={24} color="#374151" />
              </Pressable>
            </View>

            <View className="flex-1 justify-center px-6 py-8">
              {step === 1 ? renderStep1() : renderStep2()}

              {/* Footer */}
              <View className="mt-8">
                <Text className="text-center text-gray-500 text-sm">
                  Remember your password?{' '}
                  <Text 
                    className="text-blue-600 font-medium"
                    onPress={() => navigation.navigate('Login')}
                  >
                    Sign In
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default ForgotPasswordScreen;