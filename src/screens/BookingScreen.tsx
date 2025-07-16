import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeftIcon, CheckIcon } from 'react-native-heroicons/outline';
import { Library, LibraryPlan, TimeSlot, Seat } from '../types/api';
import { bookingApi } from '../services/api';
import { BookingScreenProps } from '../types/navigation';


export default function BookingScreen({ navigation, route }: BookingScreenProps) {
  const { library } = route.params;
  const [selectedPlan, setSelectedPlan] = useState<LibraryPlan | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // Mock data for time slots and seats (since backend doesn't provide these endpoints)
  const mockTimeSlots: TimeSlot[] = [
    {
      id: 'ts-1',
      startTime: '09:00',
      endTime: '12:00',
      date: new Date().toISOString(),
      capacity: 10,
      bookedCount: 3,
      status: 'AVAILABLE',
    },
    {
      id: 'ts-2',
      startTime: '12:00',
      endTime: '15:00',
      date: new Date().toISOString(),
      capacity: 10,
      bookedCount: 7,
      status: 'AVAILABLE',
    },
    {
      id: 'ts-3',
      startTime: '15:00',
      endTime: '18:00',
      date: new Date().toISOString(),
      capacity: 10,
      bookedCount: 10,
      status: 'BOOKED',
    },
  ];

  const mockSeats: Seat[] = [
    { id: 'seat-1', seatNumber: 'A1', status: 'AVAILABLE', isActive: true },
    { id: 'seat-2', seatNumber: 'A2', status: 'OCCUPIED', isActive: true },
    { id: 'seat-3', seatNumber: 'A3', status: 'AVAILABLE', isActive: true },
    { id: 'seat-4', seatNumber: 'B1', status: 'AVAILABLE', isActive: true },
    { id: 'seat-5', seatNumber: 'B2', status: 'MAINTENANCE', isActive: false },
    { id: 'seat-6', seatNumber: 'B3', status: 'AVAILABLE', isActive: true },
  ];

  const handleBooking = async () => {
    if (!selectedPlan || !selectedTimeSlot || !selectedSeat) {
      Alert.alert('Incomplete Selection', 'Please select a plan, time slot, and seat.');
      return;
    }

    setIsBooking(true);
    try {
      const bookingData = {
        studentId: 'current-user-id', // This would come from auth context
        libraryId: library.id,
        planId: selectedPlan.id,
        timeSlotId: selectedTimeSlot.id,
        seatId: selectedSeat.id,
        totalAmount: selectedPlan.price,
      };

      const result = await bookingApi.createBooking(bookingData);
      
      if (result.success) {
        Alert.alert(
          'Booking Confirmed!',
          `Your booking has been confirmed. Booking ID: ${result.bookingId}`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Profile'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Booking Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const renderPlanSelection = () => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Select Subscription Plan
      </Text>
      {library.plans.map((plan) => (
        <Pressable
          key={plan.id}
          onPress={() => setSelectedPlan(plan)}
          className={`p-4 rounded-lg border-2 mb-3 ${
            selectedPlan?.id === plan.id
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white'
          }`}
          android_ripple={{ color: '#f3f4f6' }}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">{plan.planName}</Text>
              <Text className="text-sm text-gray-600">
                {plan.hours} hours • {plan.days} days
              </Text>
              {plan.description && (
                <Text className="text-sm text-gray-500 mt-1">
                  {plan.description}
                </Text>
              )}
            </View>
            <View className="items-end">
              <Text className="text-lg font-bold text-blue-600">
                ₹{plan.price.toLocaleString()}
              </Text>
              {selectedPlan?.id === plan.id && (
                <CheckIcon size={20} color="#2563eb" />
              )}
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );

  const renderTimeSlotSelection = () => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Select Time Slot
      </Text>
      <View className="flex-row flex-wrap">
        {mockTimeSlots.map((slot) => (
          <Pressable
            key={slot.id}
            onPress={() => slot.status === 'AVAILABLE' && setSelectedTimeSlot(slot)}
            disabled={slot.status !== 'AVAILABLE'}
            className={`p-3 rounded-lg border-2 mr-3 mb-3 min-w-24 ${
              selectedTimeSlot?.id === slot.id
                ? 'border-blue-600 bg-blue-50'
                : slot.status === 'AVAILABLE'
                ? 'border-gray-200 bg-white'
                : 'border-gray-200 bg-gray-100'
            }`}
            android_ripple={{ color: '#f3f4f6' }}
          >
            <Text
              className={`text-center font-medium ${
                slot.status === 'AVAILABLE' ? 'text-gray-800' : 'text-gray-400'
              }`}
            >
              {slot.startTime} - {slot.endTime}
            </Text>
            <Text className="text-xs text-center text-gray-500 mt-1">
              {slot.capacity - slot.bookedCount} available
            </Text>
            {selectedTimeSlot?.id === slot.id && (
              <View className="absolute -top-1 -right-1">
                <CheckIcon size={16} color="#2563eb" />
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderSeatSelection = () => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Select Seat
      </Text>
      <View className="flex-row flex-wrap">
        {mockSeats.map((seat) => (
          <Pressable
            key={seat.id}
            onPress={() => seat.status === 'AVAILABLE' && setSelectedSeat(seat)}
            disabled={seat.status !== 'AVAILABLE'}
            className={`w-16 h-16 rounded-lg border-2 mr-3 mb-3 items-center justify-center ${
              selectedSeat?.id === seat.id
                ? 'border-blue-600 bg-blue-50'
                : seat.status === 'AVAILABLE'
                ? 'border-gray-200 bg-white'
                : seat.status === 'OCCUPIED'
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200 bg-gray-100'
            }`}
            android_ripple={{ color: '#f3f4f6' }}
          >
            <Text
              className={`font-medium ${
                seat.status === 'AVAILABLE'
                  ? 'text-gray-800'
                  : seat.status === 'OCCUPIED'
                  ? 'text-red-600'
                  : 'text-gray-400'
              }`}
            >
              {seat.seatNumber}
            </Text>
            {selectedSeat?.id === seat.id && (
              <View className="absolute -top-1 -right-1">
                <CheckIcon size={12} color="#2563eb" />
              </View>
            )}
          </Pressable>
        ))}
      </View>
      
      {/* Legend */}
      <View className="flex-row justify-around mt-4">
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-white border-2 border-gray-200 rounded mr-2" />
          <Text className="text-xs text-gray-600">Available</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-red-50 border-2 border-red-200 rounded mr-2" />
          <Text className="text-xs text-gray-600">Occupied</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-gray-100 border-2 border-gray-200 rounded mr-2" />
          <Text className="text-xs text-gray-600">Maintenance</Text>
        </View>
      </View>
    </View>
  );

  const renderBookingSummary = () => {
    if (!selectedPlan || !selectedTimeSlot || !selectedSeat) return null;

    return (
      <View className="bg-gray-50 p-4 rounded-lg mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Booking Summary
        </Text>
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Library:</Text>
            <Text className="font-medium text-gray-800">{library.libraryName}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Plan:</Text>
            <Text className="font-medium text-gray-800">{selectedPlan.planName}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Time:</Text>
            <Text className="font-medium text-gray-800">
              {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Seat:</Text>
            <Text className="font-medium text-gray-800">{selectedSeat.seatNumber}</Text>
          </View>
          <View className="border-t border-gray-200 pt-2 mt-2">
            <View className="flex-row justify-between">
              <Text className="text-lg font-semibold text-gray-800">Total:</Text>
              <Text className="text-lg font-bold text-blue-600">
                ₹{selectedPlan.price.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <Pressable
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full mr-3"
          android_ripple={{ color: '#f3f4f6' }}
        >
          <ArrowLeftIcon size={24} color="#374151" />
        </Pressable>
        <Text className="text-lg font-semibold text-gray-800">Book Your Seat</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Library Info */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800">{library.libraryName}</Text>
          <Text className="text-gray-600">{library.address}</Text>
        </View>

        {renderPlanSelection()}
        {renderTimeSlotSelection()}
        {renderSeatSelection()}
        {renderBookingSummary()}
      </ScrollView>

      {/* Book Button */}
      <View className="p-4 border-t border-gray-200">
        <Pressable
          onPress={handleBooking}
          disabled={!selectedPlan || !selectedTimeSlot || !selectedSeat || isBooking}
          className={`py-4 rounded-lg ${
            selectedPlan && selectedTimeSlot && selectedSeat && !isBooking
              ? 'bg-blue-600'
              : 'bg-gray-300'
          }`}
          android_ripple={{ color: '#2563eb' }}
        >
          {isBooking ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Confirm Booking
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}