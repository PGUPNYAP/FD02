import React, { useState, useRef } from 'react';
import { View, ScrollView, Image, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface ImageSliderProps {
  images: string[];
  height?: number;
  libraryName?: string;
}

export default function ImageSlider({ 
  images, 
  height = 256, 
  libraryName = '' 
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = contentOffsetX;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return (
      <View 
        className="bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center"
        style={{ height }}
      >
        <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-3">
          <Text className="text-white font-bold text-2xl">
            {libraryName.charAt(0)}
          </Text>
        </View>
        <Text className="text-blue-600 font-medium text-lg">
          {libraryName}
        </Text>
      </View>
    );
  }

  return (
    <View className="relative">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="center"
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={{ width, height }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      {images.length > 1 && (
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
          {images.map((_, index) => {
            const animatedStyle = useAnimatedStyle(() => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];
              
              const opacity = interpolate(
                scrollX.value,
                inputRange,
                [0.3, 1, 0.3],
                Extrapolation.CLAMP
              );
              
              const scale = interpolate(
                scrollX.value,
                inputRange,
                [0.8, 1.2, 0.8],
                Extrapolation.CLAMP
              );

              return {
                opacity,
                transform: [{ scale }],
              };
            });

            return (
              <Animated.View
                key={index}
                className="w-2 h-2 bg-white rounded-full mx-1"
                style={animatedStyle}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}