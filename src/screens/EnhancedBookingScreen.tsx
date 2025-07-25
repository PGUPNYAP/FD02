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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Library, LibraryPlan, TimeSlot } from '../types/api';
import { bookingApi, studentApi, timeSlotApi } from '../services/api';
import { useStorage, STORAGE_KEYS } from '../hooks/useStorage';
import { BookingScreenProps } from '../types/navigation';
import SeatSelectionGrid from '../components/SeatSelectionGrid';
import { useQuery } from '@tanstack/react-query';

export default function EnhancedBookingScreen({ navigation, route }: BookingScreenProps) {
  const { library, selectedPlan: preSelectedPlan } = route.params;
  const [selectedPlan, setSelectedPlan] = useState<LibraryPlan | null>(preSelectedPlan || null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedSeatId, setSelectedSeatId] = useState<string>('');
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<number>(0);
  const { getItem } = useStorage();
  const queryClient = useQueryClient();

  const currentUser = getItem(STORAGE_KEYS.CURRENT_USER);

  // Get today's date for time slots
  const today = new Date().toISOString().split('T')[0];

  // Fetch time slots from API
  const { 
    data: timeSlots = [], 
    isLoading: timeSlotsLoading 
  } = useQuery({
    queryKey: ['timeSlots', library.id, today],
    queryFn: () => timeSlotApi.getAvailableTimeSlots(library.id, today),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const bookingMutation = useMutation({
    mutationFn: bookingApi.createBooking,
    onSuccess: (data) => {
      // Invalidate and refetch seat data
      queryClient.invalidateQueries({ queryKey: ['seats', library.id] });
      
      // Store booking in local storage
      const bookingHistory = getItem(STORAGE_KEYS.BOOKING_HISTORY) || [];
      const newBooking = {
        id: data.data?.id || `booking_${Date.now()}`,
        libraryName: library.libraryName,
        planName: selectedPlan?.planName,
        seatNumber: selectedSeatNumber,
        timeSlot: `${selectedTimeSlot?.startTime} - ${selectedTimeSlot?.endTime}`,
        amount: selectedPlan?.price,
        date: new Date().toISOString(),
        status: 'Active'
      };
      setItem(STORAGE_KEYS.BOOKING_HISTORY, [...bookingHistory, newBooking]);
      
      Alert.alert(
        'Booking Confirmed!',
        `Your booking has been confirmed for Seat ${selectedSeatNumber} at ${library.libraryName}.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    },
    onError: (error: any) => {
      console.error('Booking error:', error);
      Alert.alert(
        'Booking Failed', 
        error.message || 'Something went wrong. Please try again.'
      );
    },
  });

  // Mutation to verify student exists before booking
  const verifyStudentMutation = useMutation({
    mutationFn: studentApi.getStudentByCognitoId,
    onSuccess: (studentData) => {
      console.log('✅ Student verified:', studentData);
      // Proceed with booking using the verified student ID
      proceedWithBooking(studentData.id);
    },
    onError: (error: any) => {
      console.error('❌ Student verification failed:', error);
      Alert.alert(
        'Authentication Error',
        'Please login again to continue booking.',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    },
  });

  const handleSeatSelect = (seatId: string, seatNumber: number) => {
    setSelectedSeatId(seatId);
    setSelectedSeatNumber(seatNumber);
  };

  const handleBookNowPress = () => {
    if (!currentUser) {
      Alert.alert('Login Required', 'Please login to book a seat.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
        { text: 'Cancel', style: 'cancel' }
      ]);
      return;
    }

    if (!selectedPlan || !selectedTimeSlot || !selectedSeatId) {
      Alert.alert(
        'Incomplete Selection', 
        'Please select a plan, time slot, and seat to proceed.'
      );
      return;
    }

    // First verify the student exists in the backend
    console.log('🔍 Verifying student before booking...');
    verifyStudentMutation.mutate(currentUser.cognitoId);
  };

  const proceedWithBooking = (verifiedStudentId: string) => {
    if (!selectedPlan || !selectedTimeSlot || !selectedSeatId) return;
    
    try {
      // Ensure all IDs are strings and match backend expectations
      const bookingData = {
        studentId: verifiedStudentId, // Use the verified backend student ID
        libraryId: library.id,
        planId: selectedPlan.id,
        timeSlotId: selectedTimeSlot.id,
        seatId: selectedSeatId,
        totalAmount: Number(selectedPlan.price), // Ensure it's a number
      };

      console.log('📝 Submitting booking with verified data:', bookingData);
      
      // Validate all required fields are present
      const requiredFields = ['studentId', 'libraryId', 'planId', 'timeSlotId', 'seatId', 'totalAmount'];
      const missingFields = requiredFields.filter(field => !bookingData[field as keyof typeof bookingData]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      bookingMutation.mutate(bookingData);
    } catch (error) {
      console.error('Booking submission error:', error);
      Alert.alert('Booking Error', 'Failed to prepare booking data. Please try again.');
    }
  };

  const renderPlanSelection = () => (
    <View className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Select Subscription Plan
      </Text>
      {library.plans.map((plan) => (
        <Pressable
          key={plan.id}
          onPress={() => setSelectedPlan(plan)}
          className={`p-4 rounded-xl border-2 mb-3 ${
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
    <View className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Select Time Slot
      </Text>
      
      {timeSlotsLoading ? (
        <View className="items-center py-4">
          <ActivityIndicator size="small" color="#3b82f6" />
          <Text className="mt-2 text-gray-600 text-sm">Loading time slots...</Text>
        </View>
      ) : (
      <View className="flex-row flex-wrap">
        {timeSlots.map((slot: any) => (
          <Pressable
            key={slot.id}
            onPress={() => slot.isBookable && setSelectedTimeSlot(slot)}
            disabled={!slot.isBookable}
            className={`p-3 rounded-xl border-2 mr-3 mb-3 min-w-28 ${
              selectedTimeSlot?.id === slot.id
                ? 'border-blue-600 bg-blue-50'
                : slot.isBookable
                ? 'border-gray-200 bg-white'
                : 'border-gray-200 bg-gray-100'
            }`}
            android_ripple={{ color: '#f3f4f6' }}
          >
            <Text
              className={`text-center font-medium ${
                slot.isBookable ? 'text-gray-800' : 'text-gray-400'
              }`}
            >
              {slot.startTime} - {slot.endTime}
            </Text>
            <Text className="text-xs text-center text-gray-500 mt-1">
              {slot.availableSpots || 0} available
            </Text>
            {selectedTimeSlot?.id === slot.id && (
              <View className="absolute -top-1 -right-1">
                <CheckIcon size={16} color="#2563eb" />
              </View>
            )}
          </Pressable>
        ))}
      </View>
      )}
    </View>
  );

  const renderBookingSummary = () => {
    if (!selectedPlan || !selectedTimeSlot || !selectedSeatId) return null;

    return (
      <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Booking Summary
        </Text>
        <View className="bg-gray-50 p-4 rounded-xl">
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
            <Text className="font-medium text-gray-800">Seat {selectedSeatNumber}</Text>
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
        <View className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <Text className="text-xl font-bold text-gray-800">{library.libraryName}</Text>
          <Text className="text-gray-600 mt-1">{library.address}</Text>
          <Text className="text-sm text-blue-600 mt-2">📍 {library.city}, {library.state}</Text>
        </View>

        {renderPlanSelection()}
        {renderTimeSlotSelection()}
        
        {/* Seat Selection Grid */}
        <View className="mb-6">
          <SeatSelectionGrid
            libraryId={library.id}
            selectedTimeSlot={selectedTimeSlot}
            onSeatSelect={handleSeatSelect}
            selectedSeatId={selectedSeatId}
          />
        </View>

        {renderBookingSummary()}
      </ScrollView>

      {/* Book Button */}
      <View className="p-4 border-t border-gray-200">
        <Pressable
          onPress={handleBookNowPress}
          disabled={!selectedPlan || !selectedTimeSlot || !selectedSeatId || bookingMutation.isPending || verifyStudentMutation.isPending}
          className={`py-4 rounded-lg ${
            selectedPlan && selectedTimeSlot && selectedSeatId && !bookingMutation.isPending && !verifyStudentMutation.isPending
              ? 'bg-blue-600'
              : 'bg-gray-300'
          }`}
          android_ripple={{ color: '#2563eb' }}
        >
          {(bookingMutation.isPending || verifyStudentMutation.isPending) ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Book Now
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}