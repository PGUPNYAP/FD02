import React from 'react';
import { View, Text, Pressable, Image, Dimensions } from 'react-native';
import { StarIcon, MapPinIcon, ClockIcon } from 'react-native-heroicons/solid';
import { WifiIcon, BoltIcon, CameraIcon } from 'react-native-heroicons/outline';
import { Library } from '../types/api';

const { width } = Dimensions.get('window');
const cardWidth = width - 32; // Account for horizontal padding

interface LibraryCardProps {
  library: Library;
  onPress: () => void;
  onBookNow: () => void;
}

export default function LibraryCard({ library, onPress, onBookNow }: LibraryCardProps) {
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
    'Parking': CameraIcon,
    'Cafeteria': CameraIcon,
  };

  const handleBookNow = (e: any) => {
    e.stopPropagation();
    onBookNow();
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl shadow-lg border border-gray-50 mb-6 overflow-hidden"
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}
      android_ripple={{ color: '#f3f4f6' }}
    >
      {/* Image Section */}
      <View className="h-52 bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {library.photos.length > 0 ? (
          <Image
            source={{ uri: library.photos[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center">
            <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center">
              <Text className="text-white font-bold text-xl">
                {library.libraryName.charAt(0)}
              </Text>
            </View>
            <Text className="text-blue-600 font-medium text-sm mt-2">
              {library.libraryName.charAt(0)}
            </Text>
          </View>
        )}
        
        {/* Rating Badge */}
        {averageRating > 0 && (
          <View className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex-row items-center">
            <StarIcon size={12} color="#fbbf24" />
            <Text className="ml-1 text-xs font-semibold text-gray-800">
              {averageRating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View className="p-5">
        {/* Header */}
        <View className="mb-3">
          <Text className="text-xl font-bold text-gray-900 mb-1" numberOfLines={1}>
            {library.libraryName}
          </Text>
          
          {/* Location */}
          <View className="flex-row items-center mb-2">
            <MapPinIcon size={14} color="#6b7280" />
            <Text className="ml-1 text-sm text-gray-600 flex-1" numberOfLines={1}>
              {library.area ? `${library.area}, ${library.city}` : library.city}
            </Text>
          </View>

          {/* Timing */}
          <View className="flex-row items-center">
            <ClockIcon size={14} color="#6b7280" />
            <Text className="ml-1 text-sm text-gray-600">
              {library.openingTime} - {library.closingTime}
            </Text>
          </View>
        </View>

        {/* Facilities */}
        <View className="flex-row flex-wrap mb-4">
          {library.facilities.slice(0, 4).map((facility, index) => {
            const IconComponent = facilitiesIcons[facility] || BoltIcon;
            return (
              <View key={index} className="bg-blue-50 px-2 py-1 rounded-full mr-2 mb-2 flex-row items-center">
                <IconComponent size={10} color="#3b82f6" />
                <Text className="ml-1 text-xs text-blue-700 font-medium">{facility}</Text>
              </View>
            );
          })}
        </View>

        {/* Price and Book Now Button */}
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xs text-gray-500 mb-1">Starting from</Text>
            <Text className="text-xl font-bold text-blue-600">
              ₹{lowestPrice.toLocaleString()}/month
            </Text>
          </View>
          
          <Pressable
            onPress={handleBookNow}
            className="bg-blue-600 px-6 py-3 rounded-xl shadow-sm"
            style={{
              shadowColor: '#3b82f6',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
            android_ripple={{ color: '#2563eb' }}
          >
            <Text className="text-white font-semibold text-sm">Book Now</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}