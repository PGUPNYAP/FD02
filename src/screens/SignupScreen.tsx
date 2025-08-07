import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  IdentificationIcon,
} from 'react-native-heroicons/outline';
import { studentApi } from '../services/api';
import {
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
} from 'aws-amplify/auth';
import { useStorage, STORAGE_KEYS } from '../hooks/useStorage';

// Define navigation stack parameter list
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
};

interface studentData {
  cognitoId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  accessToken: string;
  userId: string;
}

const SignupScreen: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [otp, setOtp] = useState<string>('');
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const { setItem } = useStorage();
  const validatePhoneNumber = (phone: string): boolean => {
    // Indian phone number validation - exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async (): Promise<void> => {
    // Validation
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !password ||
      !confirmPassword
    ) {
      return Alert.alert('Error', 'Please fill all fields');
    }

    if (!validateEmail(email)) {
      return Alert.alert('Error', 'Please enter a valid email address');
    }

    // Fix the phone validation logic
    if (!validatePhoneNumber(phoneNumber)) {
      return Alert.alert(
        'Error',
        'Please enter a valid 10-digit Indian phone number',
      );
    }

    if (password.length < 8) {
      return Alert.alert(
        'Error',
        'Password must be at least 8 characters long',
      );
    }

    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }

    setLoading(true);
    try {
      // Format phone number for AWS Cognito (add +91 for Indian numbers)
      const formattedPhone = `+91${phoneNumber}`;

      const { isSignUpComplete } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name: `${firstName} ${lastName}`,
            given_name: firstName,
            family_name: lastName,
            phone_number: formattedPhone, // Use formatted phone with +91
          },
          autoSignIn: false,
        },
      });

      if (!isSignUpComplete) {
        setShowOtpInput(true);
        Alert.alert(
          'Success',
          'Verification code sent to your email. Please check your inbox and spam folder.',
        );
      } else {
        Alert.alert('Success', 'Sign up complete! You can now log in.');
        navigation.navigate('Login');
      }
    } catch (err: any) {
      console.error('Signup error', err);
      let errorMessage: string = 'Signup failed';

      if (err.name === 'UsernameExistsException') {
        errorMessage = 'An account with this email already exists';
      } else if (err.name === 'InvalidPasswordException') {
        errorMessage = 'Password does not meet requirements';
      } else if (err.message) {
        errorMessage = err.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async (): Promise<void> => {
    if (!otp.trim()) {
      return Alert.alert('Error', 'Please enter the verification code.');
    }
    setOtpLoading(true);
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: otp,
      });

      setOtp('');
      setShowOtpInput(false);

      if (isSignUpComplete) {
        Alert.alert('Success', 'Email confirmed!');

        try {
          const { isSignedIn } = await signIn({ username: email, password });

          if (isSignedIn) {
            console.log('User signed in successfully');

            try {
              // Get current user and their attributes
              const currentUser = await getCurrentUser();
              const userAttributes = await fetchUserAttributes();
              const session = await fetchAuthSession();
              const accesstoken = session.tokens?.accessToken?.toString();
              // Extract user data
              const userData: UserData = {
                firstName: userAttributes.given_name || '',
                lastName: userAttributes.family_name || '',
                email: userAttributes.email || email,
                phoneNumber: userAttributes.phone_number || '',
                accessToken: accesstoken || '',
                userId: currentUser.userId || currentUser.username || '',
              };
              console.log('User data:', userData);

              // Store user data in AsyncStorage
              await setItem(STORAGE_KEYS.CURRENT_USER, userData);
              console.log('User data stored in AsyncStorage:', userData);

              // Show success message and navigate
              Alert.alert(
                'Success!',
                `Welcome back ${userData.firstName || 'User'}!`,
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Home'),
                  },
                ],
              );
            } catch (storageError) {
              console.error('Error storing user data:', storageError);
              // Still navigate to home even if storage fails
              Alert.alert('Success!', 'Welcome back!', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Home'),
                },
              ]);
            }
          }
          const currentUser = await getCurrentUser();
          const studentData = {
            cognitoId: currentUser.userId,
            username: email, // username is usually email
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: `+91${phoneNumber}`,
          };

          const response = await studentApi.createStudent(studentData);
          if (response.success) {
            console.log('✅ Student created successfully:', response.data);
            //Alert.alert('Success', 'Student created successfully');
          } else {
            console.error('❌ Student creation failed:', response.message);
            Alert.alert('Error', response.message || 'Student creation failed');
          }
          navigation.navigate('Home');
        } catch (signInError: any) {
          if (signInError.name === 'UserAlreadyAuthenticatedException') {
            console.log(
              'User already signed in from confirmSignUp. Navigating to Home.',
            );
            navigation.navigate('Home');
          } else {
            console.error('Error signing in after confirmation:', signInError);
            Alert.alert(
              'Error',
              signInError.message ||
                'Failed to sign in after confirmation. Please try logging in.',
            );
            navigation.navigate('Login');
          }
        }
      } else {
        Alert.alert(
          'Success',
          'Email confirmed, but further steps are required. Please log in.',
        );
        navigation.navigate('Login');
      }

      // Clear form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('OTP Confirmation Error:', err);
      Alert.alert(
        'Error',
        err.message || 'Failed to confirm sign up. Please check your code.',
      );
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <SafeAreaView className="flex-1 bg-gray-50">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="flex-1 justify-center px-6 py-8">
              {/* Header */}
              <View className="items-center mb-8">
                <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
                  <Text className="text-white font-bold text-2xl">FD</Text>
                </View>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                  Create Account
                </Text>
                <Text className="text-gray-600 text-center">
                  Join Focus Desk today and start learning
                </Text>
              </View>

              {/* Form */}
              <View className="space-y-4">
                {/* First Name Input */}
                <View>
                  <Text className="text-base font-medium text-gray-700 mb-2">
                    First Name *
                  </Text>
                  <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                    <UserIcon size={20} color="#6b7280" />
                    <TextInput
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="Enter your first name"
                      className="flex-1 ml-3 text-gray-800 text-base"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Last Name Input */}
                <View>
                  <Text className="text-base font-medium text-gray-700 mb-2">
                    Last Name *
                  </Text>
                  <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                    <IdentificationIcon size={20} color="#6b7280" />
                    <TextInput
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="Enter your last name"
                      className="flex-1 ml-3 text-gray-800 text-base"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Email Input */}
                <View>
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
                    />
                  </View>
                </View>

                {/* Phone Number Input */}
                <View>
                  <Text className="text-base font-medium text-gray-700 mb-2">
                    Phone Number *
                  </Text>
                  <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                    <PhoneIcon size={20} color="#6b7280" />
                    <Text className="text-gray-600 text-base mr-2">+91</Text>
                    <TextInput
                      value={phoneNumber}
                      onChangeText={text => {
                        // Only allow digits and limit to 10 characters
                        const digitsOnly = text.replace(/\D/g, '');
                        if (digitsOnly.length <= 10) {
                          setPhoneNumber(digitsOnly);
                        }
                      }}
                      placeholder="Enter your phone number"
                      className="flex-1 ml-1 text-gray-800 text-base"
                      placeholderTextColor="#9ca3af"
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">
                    Enter 10-digit mobile number without +91
                  </Text>
                </View>

                {/* Password Input */}
                <View>
                  <Text className="text-base font-medium text-gray-700 mb-2">
                    Password *
                  </Text>
                  <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                    <LockClosedIcon size={20} color="#6b7280" />
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter password (min 8 characters)"
                      className="flex-1 ml-3 text-gray-800 text-base"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry
                    />
                  </View>
                </View>

                {/* Confirm Password Input */}
                <View>
                  <Text className="text-base font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </Text>
                  <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
                    <LockClosedIcon size={20} color="#6b7280" />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm your password"
                      className="flex-1 ml-3 text-gray-800 text-base"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry
                    />
                  </View>
                </View>

                {/* Sign Up Button */}
                <Pressable
                  onPress={handleSignUp}
                  disabled={loading}
                  className={`py-4 rounded-xl mt-6 ${
                    loading ? 'bg-gray-300' : 'bg-blue-600'
                  }`}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-semibold text-lg">
                      Sign Up
                    </Text>
                  )}
                </Pressable>

                {/* Login Link */}
                <Pressable
                  onPress={() => navigation.navigate('Login')}
                  className="mt-4"
                >
                  <Text className="text-center text-blue-600 font-medium">
                    Already have an account? Sign In
                  </Text>
                </Pressable>
              </View>

              {/* OTP Verification Section */}
              {showOtpInput && (
                <View className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                  <Text className="text-lg font-semibold text-blue-900 mb-2 text-center">
                    Email Verification
                  </Text>
                  <Text className="text-blue-700 text-center mb-6">
                    Enter the verification code sent to your email address
                  </Text>

                  <View>
                    <Text className="text-base font-medium text-blue-800 mb-2">
                      Verification Code *
                    </Text>
                    <View className="flex-row items-center border border-blue-300 rounded-xl px-4 py-3 bg-white">
                      <EnvelopeIcon size={20} color="#1d4ed8" />
                      <TextInput
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Enter verification code"
                        className="flex-1 ml-3 text-gray-800 text-base"
                        placeholderTextColor="#9ca3af"
                        keyboardType="numeric"
                        maxLength={6}
                      />
                    </View>
                  </View>

                  <Pressable
                    onPress={handleConfirmOtp}
                    disabled={otpLoading || !otp.trim()}
                    className={`py-4 rounded-xl mt-6 ${
                      otpLoading || !otp.trim() ? 'bg-gray-300' : 'bg-green-600'
                    }`}
                  >
                    {otpLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white text-center font-semibold text-lg">
                        Verify Code
                      </Text>
                    )}
                  </Pressable>
                </View>
              )}

              {/* Footer */}
              <View className="mt-8">
                <Text className="text-center text-gray-500 text-sm">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default SignupScreen;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import { useNavigation, NavigationProp } from '@react-navigation/native';
// import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
// import { UserIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon, IdentificationIcon } from 'react-native-heroicons/outline';

// // Define navigation stack parameter list
// type RootStackParamList = {
//   Home: undefined;
//   Login: undefined;
//   Signup: undefined;
// };

// const SignupScreen: React.FC = () => {
//   const [firstName, setFirstName] = useState<string>('');
//   const [lastName, setLastName] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [phoneNumber, setPhoneNumber] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [confirmPassword, setConfirmPassword] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
//   const [otp, setOtp] = useState<string>('');
//   const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
//   const [otpLoading, setOtpLoading] = useState<boolean>(false);

//   const validatePhoneNumber = (phone: string): boolean => {
//     // Basic phone number validation (10 digits)
//     const phoneRegex = /^\d{10}$/;
//     return phoneRegex.test(phone.replace(/\D/g, ''));
//   };

//   const validateEmail = (email: string): boolean => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleSignUp = async (): Promise<void> => {
//     // Validation
//     if (!firstName.trim() || !lastName.trim() || !email.trim() || !phoneNumber.trim() || !password || !confirmPassword) {
//       return Alert.alert('Error', 'Please fill all fields');
//     }

//     if (!validateEmail(email)) {
//       return Alert.alert('Error', 'Please enter a valid email address');
//     }

//     if (phoneNumber.length <10) {
//       return Alert.alert('Error', 'Please enter a valid 10-digit phone number');
//     }

//     if (password.length < 8) {
//       return Alert.alert('Error', 'Password must be at least 8 characters long');
//     }

//     if (password !== confirmPassword) {
//       return Alert.alert('Error', 'Passwords do not match');
//     }

//     setLoading(true);
//     try {
//       // Format phone number for AWS Cognito (add +1 for US numbers)
//       //const formattedPhone = `+1${phoneNumber.replace(/\D/g, '')}`;

//       const { isSignUpComplete } = await signUp({
//         username: email,
//         password,
//         options: {
//           userAttributes: {
//             email,
//             name: `${firstName} ${lastName}`,
//             given_name: firstName,
//             family_name: lastName,
//             phone_number: phoneNumber,
//           },
//           autoSignIn: false,
//         },
//       });

//       if (!isSignUpComplete) {
//         setShowOtpInput(true);
//         Alert.alert(
//           'Success',
//           'Verification code sent to your email. Please check your inbox and spam folder.',
//         );
//       } else {
//         Alert.alert('Success', 'Sign up complete! You can now log in.');
//         navigation.navigate('Login');
//       }
//     } catch (err: any) {
//       console.error('Signup error', err);
//       let errorMessage: string = 'Signup failed';

//       if (err.name === 'UsernameExistsException') {
//         errorMessage = 'An account with this email already exists';
//       } else if (err.name === 'InvalidPasswordException') {
//         errorMessage = 'Password does not meet requirements';
//       } else if (err.message) {
//         errorMessage = err.message;
//       }

//       Alert.alert('Error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmOtp = async (): Promise<void> => {
//     if (!otp.trim()) {
//       return Alert.alert('Error', 'Please enter the verification code.');
//     }
//     setOtpLoading(true);
//     try {
//       const { isSignUpComplete } = await confirmSignUp({
//         username: email,
//         confirmationCode: otp,
//       });

//       setOtp('');
//       setShowOtpInput(false);

//       if (isSignUpComplete) {
//         Alert.alert('Success', 'Email confirmed!');

//         try {
//           await signIn({ username: email, password });
//           navigation.navigate('Home');
//         } catch (signInError: any) {
//           if (signInError.name === 'UserAlreadyAuthenticatedException') {
//             console.log('User already signed in from confirmSignUp. Navigating to Home.');
//             navigation.navigate('Home');
//           } else {
//             console.error('Error signing in after confirmation:', signInError);
//             Alert.alert('Error', signInError.message || 'Failed to sign in after confirmation. Please try logging in.');
//             navigation.navigate('Login');
//           }
//         }
//       } else {
//         Alert.alert('Success', 'Email confirmed, but further steps are required. Please log in.');
//         navigation.navigate('Login');
//       }

//       // Clear form
//       setFirstName('');
//       setLastName('');
//       setEmail('');
//       setPhoneNumber('');
//       setPassword('');
//       setConfirmPassword('');
//     } catch (err: any) {
//       console.error('OTP Confirmation Error:', err);
//       Alert.alert('Error', err.message || 'Failed to confirm sign up. Please check your code.');
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   // const formatPhoneNumber = (text: string): string => {
//   //   // Remove all non-digits
//   //   const digits: string = text.replace(/\D/g, '');

//   //   // Format as (XXX) XXX-XXXX
//   //   if (digits.length <= 3) {
//   //     return digits;
//   //   } else if (digits.length <= 6) {
//   //     return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
//   //   } else {
//   //     return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
//   //   }
//   // };

//   // const handlePhoneChange = (text: string): void => {
//   //   const formatted: string = formatPhoneNumber(text);
//   //   setPhoneNumber(formatted);
//   // };

//   return (
//     <>
//       <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
//       <SafeAreaView className="flex-1 bg-gray-50">
//         <KeyboardAvoidingView
//           className="flex-1"
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
//             <View className="flex-1 justify-center px-6 py-8">
//               {/* Header */}
//               <View className="items-center mb-8">
//                 <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
//                   <Text className="text-white font-bold text-2xl">FD</Text>
//                 </View>
//                 <Text className="text-3xl font-bold text-gray-900 mb-2">
//                   Create Account
//                 </Text>
//                 <Text className="text-gray-600 text-center">
//                   Join Focus Desk today and start learning
//                 </Text>
//               </View>

//               {/* Form */}
//               <View className="space-y-4">
//                 {/* First Name Input */}
//                 <View>
//                   <Text className="text-base font-medium text-gray-700 mb-2">
//                     First Name *
//                   </Text>
//                   <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
//                     <UserIcon size={20} color="#6b7280" />
//                     <TextInput
//                       value={firstName}
//                       onChangeText={setFirstName}
//                       placeholder="Enter your first name"
//                       className="flex-1 ml-3 text-gray-800 text-base"
//                       placeholderTextColor="#9ca3af"
//                       autoCapitalize="words"
//                     />
//                   </View>
//                 </View>

//                 {/* Last Name Input */}
//                 <View>
//                   <Text className="text-base font-medium text-gray-700 mb-2">
//                     Last Name *
//                   </Text>
//                   <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
//                     <IdentificationIcon size={20} color="#6b7280" />
//                     <TextInput
//                       value={lastName}
//                       onChangeText={setLastName}
//                       placeholder="Enter your last name"
//                       className="flex-1 ml-3 text-gray-800 text-base"
//                       placeholderTextColor="#9ca3af"
//                       autoCapitalize="words"
//                     />
//                   </View>
//                 </View>

//                 {/* Email Input */}
//                 <View>
//                   <Text className="text-base font-medium text-gray-700 mb-2">
//                     Email Address *
//                   </Text>
//                   <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
//                     <EnvelopeIcon size={20} color="#6b7280" />
//                     <TextInput
//                       value={email}
//                       onChangeText={setEmail}
//                       placeholder="Enter your email address"
//                       className="flex-1 ml-3 text-gray-800 text-base"
//                       placeholderTextColor="#9ca3af"
//                       keyboardType="email-address"
//                       autoCapitalize="none"
//                     />
//                   </View>
//                 </View>

//                 {/* Phone Number Input */}
//                 <View>
//                   <Text className="text-base font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </Text>
//                   <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
//                     <PhoneIcon size={20} color="#6b7280" />
//                     <TextInput
//                       value={phoneNumber}
//                       onChangeText={setPhoneNumber}
//                       placeholder="Enter your phone number"
//                       className="flex-1 ml-3 text-gray-800 text-base"
//                       placeholderTextColor="#9ca3af"
//                       keyboardType="phone-pad"
//                       maxLength={14}
//                     />
//                   </View>
//                 </View>

//                 {/* Password Input */}
//                 <View>
//                   <Text className="text-base font-medium text-gray-700 mb-2">
//                     Password *
//                   </Text>
//                   <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
//                     <LockClosedIcon size={20} color="#6b7280" />
//                     <TextInput
//                       value={password}
//                       onChangeText={setPassword}
//                       placeholder="Enter password (min 8 characters)"
//                       className="flex-1 ml-3 text-gray-800 text-base"
//                       placeholderTextColor="#9ca3af"
//                       secureTextEntry
//                     />
//                   </View>
//                 </View>

//                 {/* Confirm Password Input */}
//                 <View>
//                   <Text className="text-base font-medium text-gray-700 mb-2">
//                     Confirm Password *
//                   </Text>
//                   <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
//                     <LockClosedIcon size={20} color="#6b7280" />
//                     <TextInput
//                       value={confirmPassword}
//                       onChangeText={setConfirmPassword}
//                       placeholder="Confirm your password"
//                       className="flex-1 ml-3 text-gray-800 text-base"
//                       placeholderTextColor="#9ca3af"
//                       secureTextEntry
//                     />
//                   </View>
//                 </View>

//                 {/* Sign Up Button */}
//                 <Pressable
//                   onPress={handleSignUp}
//                   disabled={loading}
//                   className={`py-4 rounded-xl mt-6 ${
//                     loading ? 'bg-gray-300' : 'bg-blue-600'
//                   }`}
//                 >
//                   {loading ? (
//                     <ActivityIndicator color="white" />
//                   ) : (
//                     <Text className="text-white text-center font-semibold text-lg">
//                       Sign Up
//                     </Text>
//                   )}
//                 </Pressable>

//                 {/* Login Link */}
//                 <Pressable
//                   onPress={() => navigation.navigate('Login')}
//                   className="mt-4"
//                 >
//                   <Text className="text-center text-blue-600 font-medium">
//                     Already have an account? Sign In
//                   </Text>
//                 </Pressable>
//               </View>

//               {/* OTP Verification Section */}
//               {showOtpInput && (
//                 <View className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
//                   <Text className="text-lg font-semibold text-blue-900 mb-2 text-center">
//                     Email Verification
//                   </Text>
//                   <Text className="text-blue-700 text-center mb-6">
//                     Enter the verification code sent to your email address
//                   </Text>

//                   <View>
//                     <Text className="text-base font-medium text-blue-800 mb-2">
//                       Verification Code *
//                     </Text>
//                     <View className="flex-row items-center border border-blue-300 rounded-xl px-4 py-3 bg-white">
//                       <EnvelopeIcon size={20} color="#1d4ed8" />
//                       <TextInput
//                         value={otp}
//                         onChangeText={setOtp}
//                         placeholder="Enter verification code"
//                         className="flex-1 ml-3 text-gray-800 text-base"
//                         placeholderTextColor="#9ca3af"
//                         keyboardType="numeric"
//                         maxLength={6}
//                       />
//                     </View>
//                   </View>

//                   <Pressable
//                     onPress={handleConfirmOtp}
//                     disabled={otpLoading || !otp.trim()}
//                     className={`py-4 rounded-xl mt-6 ${
//                       otpLoading || !otp.trim() ? 'bg-gray-300' : 'bg-green-600'
//                     }`}
//                   >
//                     {otpLoading ? (
//                       <ActivityIndicator color="white" />
//                     ) : (
//                       <Text className="text-white text-center font-semibold text-lg">
//                         Verify Code
//                       </Text>
//                     )}
//                   </Pressable>
//                 </View>
//               )}

//               {/* Footer */}
//               <View className="mt-8">
//                 <Text className="text-center text-gray-500 text-sm">
//                   By continuing, you agree to our Terms of Service and Privacy Policy
//                 </Text>
//               </View>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </>
//   );
// };

// export default SignupScreen;
