import React, { useEffect } from 'react';
import { Text, View, Dimensions, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { replace } from '../utils/NavigationUtil';
import logoImage from '../assets/images/logo.png';

const { height } = Dimensions.get('window');

export default function SplashScreen() {
  const ringSize1 = useSharedValue(height * 0.2);
  const ringSize2 = useSharedValue(height * 0.2);
  const logoScale = useSharedValue(0.5);

  useEffect(() => {
    ringSize1.value = withSpring(height * 0.3, {
      damping: 10,
      stiffness: 90,
    });

    setTimeout(() => {
      ringSize2.value = withSpring(height * 0.4, {
        damping: 10,
        stiffness: 90,
      });
    }, 200);

    setTimeout(() => {
      logoScale.value = withSpring(1, {
        damping: 8,
        stiffness: 100,
      });
    }, 400);

    const timer = setTimeout(() => {
      replace('Login');
    }, 3000);

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
  }));

  const logoSize = height * 0.2;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#bfdbfe', // light blue
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#bfdbfe" />

      {/* Animated rings */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          },
          ring2Style,
        ]}
      >
        <Animated.View
          style={[
            {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            },
            ring1Style,
          ]}
        >
          <Animated.Image
            source={logoImage}
            style={[
              {
                width: logoSize,
                height: logoSize,
                borderRadius: logoSize / 2,
              },
              logoStyle,
            ]}
            resizeMode="cover"
          />
        </Animated.View>
      </Animated.View>

      {/* Texts */}
      <View style={{ alignItems: 'center', marginTop: height * 0.45 }}>
        <Text
          style={{
            fontSize: height * 0.07,
            fontWeight: 'bold',
            color: '#1e3a8a', // dark blue
            letterSpacing: 1.5,
          }}
        >
          Focus Desk
        </Text>
        <Text
          style={{
            fontSize: height * 0.02,
            fontWeight: '500',
            color: '#1e3a8a',
            marginTop: 8,
            letterSpacing: 1,
          }}
        >
          Welcome to the Focus Desk
        </Text>
      </View>
    </View>
  );
}
