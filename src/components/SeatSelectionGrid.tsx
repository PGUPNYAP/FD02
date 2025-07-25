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
import { seatApi, timeSlotApi } from '../services/api';
import { TimeSlot } from '../types/api';

const { width } = Dimensions.get('window');
const SEATS_PER_ROW = 6;
const SEAT_SIZE = (width - 80) / SEATS_PER_ROW; // Account for padding and margins

interface Seat {
  id: string;
  seatNumber: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
}

interface SeatSelectionGridProps {
  libraryId: string;
  selectedTimeSlot?: TimeSlot | null;
  onSeatSelect: (seatId: string, seatNumber: number) => void;
  selectedSeatId?: string;
}

export default function SeatSelectionGrid({ 
  libraryId, 
  selectedTimeSlot,
  onSeatSelect, 
  selectedSeatId 
}: SeatSelectionGridProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(selectedSeatId || null);

  // Prepare query parameters for seat availability
  const queryParams = {
    libraryId,
    ...(selectedTimeSlot && {
      date: selectedTimeSlot.date,
      startTime: selectedTimeSlot.startTime,
      endTime: selectedTimeSlot.endTime,
    }),
  };

  const { 
    data: seats, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['seats', libraryId, selectedTimeSlot?.id],
    queryFn: () => seatApi.getAvailableSeats(
      queryParams.libraryId,
      queryParams.date,
      queryParams.startTime,
      queryParams.endTime
    ),
    enabled: !!libraryId && !!selectedTimeSlot,
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
    const baseStyle = "items-center justify-center rounded-xl border-2 m-1 shadow-sm";
    
    if (seat.status === 'AVAILABLE') {
      return selectedSeat === seat.id 
        ? `${baseStyle} bg-blue-600 border-blue-700 shadow-lg`
        : `${baseStyle} bg-green-50 border-green-300`;
    } else if (seat.status === 'OCCUPIED') {
      return `${baseStyle} bg-red-100 border-red-300`;
    } else if (seat.status === 'MAINTENANCE') {
      return `${baseStyle} bg-yellow-100 border-yellow-300`;
    } else {
      return `${baseStyle} bg-gray-100 border-gray-300`;
    }
  };

  const getSeatTextStyle = (seat: Seat) => {
    if (seat.status === 'AVAILABLE') {
      return selectedSeat === seat.id 
        ? "text-white font-bold"
        : "text-green-700 font-semibold";
    } else if (seat.status === 'OCCUPIED') {
      return "text-red-600 font-medium";
    } else if (seat.status === 'MAINTENANCE') {
      return "text-yellow-600 font-medium";
    } else {
      return "text-gray-500 font-medium";
    }
  };

  const getSeatIcon = (seat: Seat) => {
    if (selectedSeat === seat.id) {
      return <CheckIcon size={12} color="white" style={{ position: 'absolute', top: 2, right: 2 }} />;
    }
    if (seat.status === 'OCCUPIED') {
      return <Text style={{ fontSize: 8, color: '#dc2626' }}>●</Text>;
    }
    if (seat.status === 'MAINTENANCE') {
      return <Text style={{ fontSize: 8, color: '#d97706' }}>⚠</Text>;
    }
    return null;
  };

  const renderSeat = (seat: Seat) => (
    <Pressable
      key={seat.id}
      onPress={() => handleSeatPress(seat)}
      disabled={seat.status !== 'AVAILABLE'}
      className={getSeatStyle(seat)}
      style={{ 
        width: SEAT_SIZE - 12, 
        height: SEAT_SIZE - 12,
        opacity: seat.status === 'AVAILABLE' ? 1 : 0.7,
        elevation: selectedSeat === seat.id ? 4 : 1,
      }}
      android_ripple={{ 
        color: seat.status === 'AVAILABLE' ? '#3b82f6' : '#9ca3af' 
      }}
    >
      <Text className={getSeatTextStyle(seat)} style={{ fontSize: 11, fontWeight: '600' }}>
        {seat.seatNumber}
      </Text>
      {getSeatIcon(seat)}
    </Pressable>
  );

  const renderSeatGrid = () => {
    if (!seats || seats.length === 0) {
      return (
        <View className="items-center py-8">
          <Text className="text-gray-600 text-center">No seats available for this time slot</Text>
        </View>
      );
    }

    const rows = [];
    for (let i = 0; i < seats.length; i += SEATS_PER_ROW) {
      const rowSeats = seats.slice(i, i + SEATS_PER_ROW);
      rows.push(
        <View key={i} className="flex-row justify-center mb-2">
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
    <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Select Your Seat
      </Text>
      
      {!selectedTimeSlot && (
        <View className="bg-yellow-50 p-4 rounded-xl mb-4 border border-yellow-200">
          <Text className="text-yellow-800 text-center text-sm">
            Please select a time slot first to view available seats
          </Text>
        </View>
      )}
      
      {/* Legend */}
      <View className="flex-row justify-center mb-6 flex-wrap">
        <View className="flex-row items-center mx-2 mb-2">
          <View className="w-4 h-4 bg-green-50 border border-green-300 rounded mr-2" />
          <Text className="text-xs text-gray-600">Available</Text>
        </View>
        <View className="flex-row items-center mx-2 mb-2">
          <View className="w-4 h-4 bg-blue-600 border border-blue-700 rounded mr-2" />
          <Text className="text-xs text-gray-600">Selected</Text>
        </View>
        <View className="flex-row items-center mx-2 mb-2">
          <View className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2" />
          <Text className="text-xs text-gray-600">Occupied</Text>
        </View>
        <View className="flex-row items-center mx-2 mb-2">
          <View className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mr-2" />
          <Text className="text-xs text-gray-600">Maintenance</Text>
        </View>
      </View>

      {/* Seat Grid */}
      {selectedTimeSlot ? renderSeatGrid() : (
        <View className="items-center py-8">
          <Text className="text-gray-500 text-center">Select a time slot to view available seats</Text>
        </View>
      )}

      {/* Selected Seat Info */}
      {selectedSeat && (
        <View className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <Text className="text-center text-blue-800 font-medium">
            ✓ Selected: Seat {seats?.find(s => s.id === selectedSeat)?.seatNumber}
          </Text>
        </View>
      )}
    </View>
  );
}