import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, FlatList, ActivityIndicator } from 'react-native';
import { ChevronDownIcon, MapPinIcon } from 'react-native-heroicons/outline';
import { useLocations } from '../hooks/useLibraries';
import { useStorage, STORAGE_KEYS } from '../hooks/useStorage';
import { Location } from '../types/api';

interface LocationPickerProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

export default function LocationPicker({ 
  selectedLocation, 
  onLocationChange, 
  isVisible, 
  onClose 
}: LocationPickerProps) {
  const { data: locations, isLoading, error } = useLocations();
  const { setItem } = useStorage();

  const uniqueCities = locations ? Array.from(new Set(locations.map(loc => loc.city))) : [];

  const handleLocationSelect = (city: string) => {
    onLocationChange(city);
    setItem(STORAGE_KEYS.SELECTED_LOCATION, city);
  };

  const renderLocationItem = ({ item }: { item: string }) => (
    <Pressable
      onPress={() => handleLocationSelect(item)}
      className="flex-row items-center p-4 border-b border-gray-100"
      android_ripple={{ color: '#f3f4f6' }}
    >
      <MapPinIcon size={20} color="#6b7280" />
      <Text className="ml-3 text-base text-gray-800">{item}</Text>
    </Pressable>
  );

  return (
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-96 shadow-2xl">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-center text-gray-800">
                Select Location
              </Text>
            </View>

            {isLoading ? (
              <View className="p-8 items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-2 text-gray-600">Loading locations...</Text>
              </View>
            ) : error ? (
              <View className="p-8 items-center">
                <Text className="text-red-500">Failed to load locations</Text>
              </View>
            ) : (
              <FlatList
                data={uniqueCities}
                renderItem={renderLocationItem}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
              />
            )}

            <Pressable
              onPress={onClose}
              className="p-4 border-t border-gray-200"
              android_ripple={{ color: '#f3f4f6' }}
            >
              <Text className="text-center text-gray-600 font-medium">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
  );
}