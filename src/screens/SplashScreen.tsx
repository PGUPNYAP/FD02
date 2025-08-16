import React, { useEffect, useRef } from 'react';
import { Text, View, Dimensions, StatusBar, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useStorage, STORAGE_KEYS } from '../hooks/useStorage';
import { replace } from '../utils/NavigationUtil';
import { SplashScreenProps } from '../types/navigation';

const { height } = Dimensions.get('window');

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const ringSize1 = useSharedValue(height * 0.2);
  const ringSize2 = useSharedValue(height * 0.2);
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const hasNavigated = useRef(false);
  const { getItem } = useStorage();

  const checkAuthAndNavigate = async () => {
    try {
      // Check if user is authenticated via AWS Cognito
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();
      
      // Also check if user data exists in AsyncStorage
      const userData = await getItem(STORAGE_KEYS.CURRENT_USER);
      
      console.log('🔍 Auth check:', {
        hasAccessToken: !!accessToken,
        hasUserData: !!userData,
      });

      if (accessToken && userData) {
        // User is authenticated and has local data
        console.log('✅ User authenticated, navigating to Home');
        replace('Main');
      } else {
        // User is not authenticated or missing data
        console.log('❌ User not authenticated, navigating to Login');
        replace('Login');
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      // On error, navigate to login
      replace('Login');
    }
  };

  useEffect(() => {
    // Start animations
    ringSize1.value = withSpring(height * 0.3, { damping: 10, stiffness: 90 });

    setTimeout(() => {
      ringSize2.value = withRepeat(
        withSpring(height * 0.4, { damping: 12, stiffness: 70 }),
        -1,
        true
      );
    }, 200);

    setTimeout(() => {
      logoScale.value = withSpring(1, { damping: 8, stiffness: 100 });
      logoOpacity.value = withSpring(1);
    }, 400);

    setTimeout(() => {
      textScale.value = withSpring(1, { damping: 10, stiffness: 80 });
      textOpacity.value = withTiming(1, { duration: 400 });
    }, 700);

    // Check authentication after animations start
    const timer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        checkAuthAndNavigate();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    width: ringSize1.value,
    height: ringSize1.value,
    borderRadius: ringSize1.value / 2,
  }));

  const ring2Style = useAnimatedStyle(() => ({
    width: ringSize2.value,
    height: ringSize2.value,
    borderRadius: ringSize2.value / 2,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: textScale.value }],
    opacity: textOpacity.value,
  }));

  const logoSize = height * 0.15;

  return (
    <View className="flex-1 justify-center items-center bg-slate-900">
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Animated rings */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            backgroundColor: 'rgba(59, 130, 246, 0.1)', // blue glow
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 0,
          },
          ring2Style,
        ]}
      >
        <Animated.View
          style={[
            {
              backgroundColor: 'rgba(59, 130, 246, 0.2)', // stronger ring
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            },
            ring1Style,
          ]}
        >
          <Animated.View
            style={[
              {
                width: logoSize,
                height: logoSize,
                borderRadius: logoSize / 2,
                backgroundColor: '#3b82f6',
                justifyContent: 'center',
                alignItems: 'center',
              },
              logoStyle,
            ]}
          >
            <Text className="text-white font-bold text-4xl">FD</Text>
          </Animated.View>
        </Animated.View>
      </Animated.View>

      {/* App Name + Tagline */}
      <Animated.View
        style={[
          {
            alignItems: 'center',
            marginTop: Math.min(height * 0.35, 250),
          },
          textAnimatedStyle,
        ]}
      >
        <Text className="text-5xl font-bold text-blue-400 tracking-wider">
          Focus Desk
        </Text>
        <Text className="text-lg font-medium text-slate-300 mt-2 tracking-wide">
          Your Study Companion
        </Text>
      </Animated.View>
    </View>
  );
}