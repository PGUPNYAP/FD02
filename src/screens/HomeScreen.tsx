// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { logoutUser } from '../api/authService';
import { resetAndNavigate } from '../utils/NavigationUtil';
import LibraryCard from '../components/LibraryCard';
import { API_ROUTES } from '../config/api';


type Location = {
  city: string;
  state: string;
  country: string;
};

type Library = {
  id: string;
  libraryName: string;
  totalSeats: number;
};

export default function HomeScreen() {
  const [selectedCity, setSelectedCity] = useState<string>('');

  // Fetch all locations
  const {
    data: locations,
    isLoading: loadingLocations,
    error: locationError,
  } = useQuery<Location[], Error>({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await axios.get(API_ROUTES.getLocations);
      return res.data;
    },
  });

  // Extract unique cities
  const uniqueCities = locations
    ? Array.from(new Set(locations.map((loc) => loc.city)))
    : [];

  // Fetch libraries based on selected city
  const {
    data: libraries = [],
    isLoading: loadingLibraries,
    error: libraryError,
  } = useQuery<Library[], Error>({
    queryKey: ['libraries', selectedCity],
    queryFn: async () => {
      const res = await axios.get(API_ROUTES.getLibraries(selectedCity));
      return res.data.data;
    },
    enabled: !!selectedCity,
  });

  const handleLogout = async () => {
    await logoutUser();
    resetAndNavigate('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Location Dropdown */}
      <View className="flex-row items-center px-5 mt-4">
        <Text className="text-lg mr-3 font-semibold">Location:</Text>
        {loadingLocations ? (
          <ActivityIndicator size="small" color="#000" />
        ) : locationError ? (
          <Text className="text-red-500">Failed to load locations</Text>
        ) : (
          <Picker
            selectedValue={selectedCity}
            onValueChange={(value) => setSelectedCity(value)}
            style={{ flex: 1, height: 48 }}
          >
            <Picker.Item label="Select a city" value="" />
            {uniqueCities.map((city) => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>
        )}
      </View>

      {/* Libraries List */}
      <View className="flex-1 px-5 mt-4">
        {loadingLibraries ? (
          <ActivityIndicator size="large" color="#000" />
        ) : libraryError ? (
          <Text className="text-red-500">Failed to load libraries</Text>
        ) : libraries.length > 0 ? (
          <FlatList
            data={libraries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <LibraryCard name={item.libraryName} seats={item.totalSeats} />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <Text className="text-center text-gray-500 mt-8">
            No libraries found for this location
          </Text>
        )}
      </View>

      {/* Logout */}
      <View className="border-t border-gray-200 p-4">
        <Pressable
          onPress={handleLogout}
          className="bg-red-600 rounded-md py-3"
          android_ripple={{ color: '#991b1b' }}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Logout
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
