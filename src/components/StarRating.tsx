import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { StarIcon } from 'react-native-heroicons/solid';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  disabled?: boolean;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  size = 32, 
  disabled = false 
}: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleStarPress = (starIndex: number) => {
    if (disabled) return;
    onRatingChange(starIndex);
  };

  const renderStar = (index: number) => {
    const scale = useSharedValue(1);
    const isActive = index <= (hoveredStar || rating);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
      scale.value = withSequence(
        withSpring(1.2, { duration: 100 }),
        withSpring(1, { duration: 100 })
      );
      handleStarPress(index);
    };

    return (
      <Pressable
        key={index}
        onPress={handlePress}
        onPressIn={() => !disabled && setHoveredStar(index)}
        onPressOut={() => !disabled && setHoveredStar(0)}
        className="mx-1"
        disabled={disabled}
      >
        <Animated.View style={animatedStyle}>
          <StarIcon
            size={size}
            color={isActive ? '#fbbf24' : '#e5e7eb'}
          />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View className="flex-row items-center justify-center">
      {[1, 2, 3, 4, 5].map(renderStar)}
    </View>
  );
}