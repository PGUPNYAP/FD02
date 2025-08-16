import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MapPinIcon, ChevronDownIcon } from 'react-native-heroicons/solid';

interface LocationButtonProps {
  selectedLocation: string;
  onPress: () => void;
}

export default function LocationButton({ selectedLocation, onPress }: LocationButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-blue-50 px-3 py-2.5 rounded-xl border border-blue-200 max-w-44"
      android_ripple={{ color: '#f3f4f6', borderless: true }}
    >
      <MapPinIcon size={16} color="#3b82f6" />
      <Text className="ml-2 text-sm font-medium text-gray-800 flex-1" numberOfLines={1}>
        {selectedLocation || 'Select Location'}
      </Text>
      <ChevronDownIcon size={14} color="#6b7280" />
    </Pressable>
  );
}