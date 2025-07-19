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
import { XMarkIcon } from 'react-native-heroicons/outline';
import StarRating from './StarRating';

const { height } = Dimensions.get('window');

interface ReviewFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (review: { stars: number; comment: string }) => Promise<void>;
  libraryName: string;
}

export default function ReviewForm({ 
  isVisible, 
  onClose, 
  onSubmit, 
  libraryName 
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
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
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ stars: rating, comment: comment.trim() });
      setRating(0);
      setComment('');
      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
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
          className="bg-white rounded-t-3xl p-6 max-h-96"
          style={modalStyle}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Rate {libraryName}
            </Text>
            <Pressable
              onPress={handleClose}
              className="p-2 rounded-full bg-gray-100"
            >
              <XMarkIcon size={20} color="#6b7280" />
            </Pressable>
          </View>

          {/* Star Rating */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-700 mb-3 text-center">
              How was your experience?
            </Text>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size={40}
            />
          </View>

          {/* Comment Input */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-700 mb-2">
              Share your thoughts (optional)
            </Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Tell others about your experience..."
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-lg p-3 text-gray-800 text-base"
              style={{ textAlignVertical: 'top' }}
              maxLength={500}
            />
            <Text className="text-xs text-gray-500 mt-1 text-right">
              {comment.length}/500
            </Text>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className={`py-4 rounded-xl ${
              rating > 0 && !isSubmitting
                ? 'bg-blue-600'
                : 'bg-gray-300'
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Submit Review
              </Text>
            )}
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}