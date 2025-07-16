import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { StarIcon, MapPinIcon, ClockIcon } from 'react-native-heroicons/solid';
import { WifiIcon, BoltIcon } from 'react-native-heroicons/outline';
import { Library } from '../types/api';

interface LibraryCardProps {
  library: Library;
  onPress: () => void;
}

export default function LibraryCard({ library, onPress }: LibraryCardProps) {
  const averageRating = library.reviews.length > 0 
    ? library.reviews.reduce((sum, review) => sum + review.stars, 0) / library.reviews.length 
    : 0;

  const lowestPrice = library.plans.length > 0 
    ? Math.min(...library.plans.map(plan => plan.price)) 
    : 0;

  const facilitiesIcons: { [key: string]: any } = {
    'WiFi': WifiIcon,
    'AC': BoltIcon,
    'Power Backup': BoltIcon,
    'CCTV': BoltIcon,
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
      android_ripple={{ color: '#f3f4f6' }}
    >
      {/* Image Section */}
      <View className="h-48 bg-gray-200">
        {library.photos.length > 0 ? (
          <Image
            source={{ uri: library.photos[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 items-center justify-center">
            <Text className="text-blue-600 font-semibold text-lg">
              {library.libraryName.charAt(0)}
            </Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View className="p-4">
        {/* Header */}
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg font-bold text-gray-800 flex-1" numberOfLines={1}>
            {library.libraryName}
          </Text>
          {averageRating > 0 && (
            <View className="flex-row items-center ml-2">
              <StarIcon size={16} color="#fbbf24" />
              <Text className="ml-1 text-sm font-medium text-gray-600">
                {averageRating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Location */}
        <View className="flex-row items-center mb-2">
          <MapPinIcon size={14} color="#6b7280" />
          <Text className="ml-1 text-sm text-gray-600" numberOfLines={1}>
            {library.area ? `${library.area}, ${library.city}` : library.city}
          </Text>
        </View>

        {/* Timing */}
        <View className="flex-row items-center mb-3">
          <ClockIcon size={14} color="#6b7280" />
          <Text className="ml-1 text-sm text-gray-600">
            {library.openingTime} - {library.closingTime}
          </Text>
        </View>

        {/* Facilities */}
        <View className="flex-row flex-wrap mb-3">
          {library.facilities.slice(0, 4).map((facility, index) => {
            const IconComponent = facilitiesIcons[facility] || BoltIcon;
            return (
              <View key={index} className="flex-row items-center mr-4 mb-1">
                <IconComponent size={12} color="#3b82f6" />
                <Text className="ml-1 text-xs text-gray-600">{facility}</Text>
              </View>
            );
          })}
        </View>

        {/* Price and Seats */}
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xs text-gray-500">Starting from</Text>
            <Text className="text-lg font-bold text-blue-600">
              ₹{lowestPrice.toLocaleString()}/month
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-gray-500">Total Seats</Text>
            <Text className="text-sm font-semibold text-gray-800">
              {library.totalSeats}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}