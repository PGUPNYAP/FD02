import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { XMarkIcon, UserIcon } from 'react-native-heroicons/outline';

const { height } = Dimensions.get('window');

interface BookingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  bookingDetails: {
    libraryName: string;
    planName: string;
    seatNumber: string;
    timeSlot: string;
    amount: number;
  };
}

export default function BookingModal({ 
  isVisible, 
  onClose, 
  onSubmit, 
  bookingDetails 
}: BookingModalProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(height, { duration: 200 });
    }
  }, [isVisible]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name to proceed with booking.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(name.trim());
      setName('');
      handleClose();
    } catch (error) {
      Alert.alert('Booking Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(height, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      visible={isVisible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <Animated.View 
        className="flex-1 bg-black/50 justify-end"
        style={backdropStyle}
      >
        <Pressable 
          className="flex-1" 
          onPress={handleClose}
        />
        <Animated.View 
          className="bg-white rounded-t-3xl p-6"
          style={modalStyle}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Confirm Booking
            </Text>
            <Pressable
              onPress={handleClose}
              className="p-2 rounded-full bg-gray-100"
            >
              <XMarkIcon size={20} color="#6b7280" />
            </Pressable>
          </View>

          {/* Booking Summary */}
          <View className="bg-gray-50 p-4 rounded-xl mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Booking Summary
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Library:</Text>
                <Text className="font-medium text-gray-800">{bookingDetails.libraryName}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Plan:</Text>
                <Text className="font-medium text-gray-800">{bookingDetails.planName}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Seat:</Text>
                <Text className="font-medium text-gray-800">{bookingDetails.seatNumber}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Time:</Text>
                <Text className="font-medium text-gray-800">{bookingDetails.timeSlot}</Text>
              </View>
              <View className="border-t border-gray-200 pt-2 mt-2">
                <View className="flex-row justify-between">
                  <Text className="text-lg font-semibold text-gray-800">Total:</Text>
                  <Text className="text-lg font-bold text-blue-600">
                    ₹{bookingDetails.amount.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Name Input */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-700 mb-2">
              Your Name *
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
              <UserIcon size={20} color="#6b7280" />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                className="flex-1 ml-3 text-gray-800 text-base"
                placeholderTextColor="#9ca3af"
                maxLength={50}
              />
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={!name.trim() || isSubmitting}
            className={`py-4 rounded-xl ${
              name.trim() && !isSubmitting
                ? 'bg-blue-600'
                : 'bg-gray-300'
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Confirm Booking
              </Text>
            )}
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}