import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { CheckIcon } from 'react-native-heroicons/solid';
import { useQuery } from '@tanstack/react-query';
import { seatApi } from '../services/api';

const { width } = Dimensions.get('window');
const SEATS_PER_ROW = 5;
const SEAT_SIZE = (width - 80) / SEATS_PER_ROW; // Account for padding and margins

interface Seat {
  id: string;
  seatNumber: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
}

interface SeatSelectionGridProps {
  libraryId: string;
  onSeatSelect: (seatId: string, seatNumber: number) => void;
  selectedSeatId?: string;
}

export default function SeatSelectionGrid({ 
  libraryId, 
  onSeatSelect, 
  selectedSeatId 
}: SeatSelectionGridProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(selectedSeatId || null);

  const { 
    data: seats, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['seats', libraryId],
    queryFn: () => seatApi.getAvailableSeats(libraryId),
    enabled: !!libraryId,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute to get updated seat status
  });

  const handleSeatPress = (seat: Seat) => {
    if (seat.status !== 'AVAILABLE') {
      Alert.alert(
        'Seat Unavailable', 
        `This seat is currently ${seat.status.toLowerCase()}. Please select another seat.`
      );
      return;
    }

    const newSelectedSeat = selectedSeat === seat.id ? null : seat.id;
    setSelectedSeat(newSelectedSeat);
    
    if (newSelectedSeat) {
      onSeatSelect(seat.id, seat.seatNumber);
    }
  };

  const getSeatStyle = (seat: Seat) => {
    const baseStyle = "items-center justify-center rounded-lg border-2 m-1";
    
    if (seat.status === 'AVAILABLE') {
      return selectedSeat === seat.id 
        ? `${baseStyle} bg-blue-600 border-blue-700`
        : `${baseStyle} bg-green-100 border-green-300`;
    } else {
      return `${baseStyle} bg-gray-200 border-gray-300`;
    }
  };

  const getSeatTextStyle = (seat: Seat) => {
    if (seat.status === 'AVAILABLE') {
      return selectedSeat === seat.id 
        ? "text-white font-bold"
        : "text-green-800 font-semibold";
    } else {
      return "text-gray-500";
    }
  };

  const renderSeat = (seat: Seat) => (
    <Pressable
      key={seat.id}
      onPress={() => handleSeatPress(seat)}
      disabled={seat.status !== 'AVAILABLE'}
      className={getSeatStyle(seat)}
      style={{ 
        width: SEAT_SIZE - 8, 
        height: SEAT_SIZE - 8,
        opacity: seat.status === 'AVAILABLE' ? 1 : 0.6 
      }}
      android_ripple={{ 
        color: seat.status === 'AVAILABLE' ? '#3b82f6' : '#9ca3af' 
      }}
    >
      <Text className={getSeatTextStyle(seat)} style={{ fontSize: 12 }}>
        {seat.seatNumber}
      </Text>
      {selectedSeat === seat.id && (
        <CheckIcon size={16} color="white" style={{ position: 'absolute', top: 2, right: 2 }} />
      )}
    </Pressable>
  );

  const renderSeatGrid = () => {
    if (!seats || seats.length === 0) {
      return (
        <View className="items-center py-8">
          <Text className="text-gray-600">No seats available</Text>
        </View>
      );
    }

    const rows = [];
    for (let i = 0; i < seats.length; i += SEATS_PER_ROW) {
      const rowSeats = seats.slice(i, i + SEATS_PER_ROW);
      rows.push(
        <View key={i} className="flex-row justify-center">
          {rowSeats.map(renderSeat)}
        </View>
      );
    }

    return <View>{rows}</View>;
  };

  if (isLoading) {
    return (
      <View className="items-center py-8">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2 text-gray-600">Loading seats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center py-8">
        <Text className="text-red-500 mb-4">Failed to load seats</Text>
        <Pressable
          onPress={() => refetch()}
          className="bg-blue-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="bg-white p-4 rounded-xl">
      <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Select Your Seat
      </Text>
      
      {/* Legend */}
      <View className="flex-row justify-center mb-4 space-x-4">
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2" />
          <Text className="text-xs text-gray-600">Available</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-blue-600 border border-blue-700 rounded mr-2" />
          <Text className="text-xs text-gray-600">Selected</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-gray-200 border border-gray-300 rounded mr-2" />
          <Text className="text-xs text-gray-600">Occupied</Text>
        </View>
      </View>

      {/* Seat Grid */}
      {renderSeatGrid()}

      {/* Selected Seat Info */}
      {selectedSeat && (
        <View className="mt-4 p-3 bg-blue-50 rounded-lg">
          <Text className="text-center text-blue-800 font-medium">
            Selected: Seat {seats?.find(s => s.id === selectedSeat)?.seatNumber}
          </Text>
        </View>
      )}
    </View>
  );
}