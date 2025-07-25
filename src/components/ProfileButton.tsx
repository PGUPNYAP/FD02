import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { UserIcon } from 'react-native-heroicons/solid';

interface ProfileButtonProps {
  onPress: () => void;
  user?: {
    name: string;
    profileImage?: string | null;
  };
}

export default function ProfileButton({ onPress, user }: ProfileButtonProps) {
  const getDisplayName = () => {
    if (!user?.name) return 'Profile';
    
    // Extract first name from full name
    const firstName = user.name.split(' ')[0];
    return firstName || 'Profile';
  };

  const getInitials = () => {
    if (!user?.name) return 'P';
    
    const names = user.name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border border-gray-100"
      android_ripple={{ color: '#f3f4f6', borderless: true }}
    >
      <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center mr-2">
        {user?.profileImage ? (
          <Image
            source={{ uri: user.profileImage }}
            className="w-8 h-8 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-white font-bold text-xs">
            {getInitials()}
          </Text>
        )}
      </View>
      <Text className="text-sm font-medium text-gray-800" numberOfLines={1}>
        {getDisplayName()}
      </Text>
    </Pressable>
  );
}