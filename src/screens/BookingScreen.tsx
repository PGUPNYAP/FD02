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
import { ArrowLeftIcon, CheckIcon, ChevronDownIcon } from 'react-native-heroicons/outline';
import { Picker } from '@react-native-picker/picker';
import { Library, LibraryPlan, TimeSlot, Seat } from '../types/api';
import { bookingApi } from '../services/api';
import { useStorage, STORAGE_KEYS } from '../hooks/useStorage';
import { BookingScreenProps } from '../types/navigation';


export default function BookingScreen({ navigation, route }: BookingScreenProps) {
  const { library, selectedPlan: preSelectedPlan } = route.params;
  const [selectedPlan, setSelectedPlan] = useState<LibraryPlan | null>(preSelectedPlan || null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);
  const { getItem, setItem } = useStorage();

  const currentUser = getItem(STORAGE_KEYS.CURRENT_USER);

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

  // Generate seat numbers based on total seats
  const generateSeatNumbers = (totalSeats: number): string[] => {
    const seats: string[] = [];
    for (let i = 1; i <= totalSeats; i++) {
      seats.push(`Seat ${i}`);
    }
    return seats;
  };

  const availableSeats = generateSeatNumbers(library.totalSeats);

  const handleBookNowPress = () => {
    if (!currentUser) {
      Alert.alert('Login Required', 'Please login to book a seat.', [
        { text: 'Login', onPress: () => navigation.navigate('Login') },
        { text: 'Cancel', style: 'cancel' }
      ]);
      return;
    }

    if (!selectedPlan || !selectedTimeSlot || !selectedSeatNumber) {
      Alert.alert('Incomplete Selection', 'Please select a plan, time slot, and seat number.');
      return;
    }

    handleBookingSubmit();
  };

  const handleBookingSubmit = async () => {
    if (!selectedPlan || !selectedTimeSlot || !selectedSeatNumber || !currentUser) return;
    
    setIsBooking(true);
    try {
      // Create a mock student ID since we don't have real student management
      const mockStudentId = 'stu-1'; // Use the seeded student ID
      
      const bookingData = {
        studentId: mockStudentId,
        libraryId: library.id,
        planId: selectedPlan.id,
        timeSlotId: selectedTimeSlot.id, 
        seatId: `seat_${selectedSeatNumber.replace(/\s+/g, '_').toLowerCase()}`, // Generate seat ID
        totalAmount: Number(selectedPlan.price),
      };

      console.log('Submitting booking data:', bookingData);

      const result = await bookingApi.createBooking(bookingData);
      
      if (result.success) {
        // Save booking to user's history
        const bookingHistory = getItem(STORAGE_KEYS.BOOKING_HISTORY) || [];
        const newBooking = {
          id: result.data.id || `booking_${Date.now()}`,
          libraryName: library.libraryName,
          planName: selectedPlan.planName,
          seatNumber: selectedSeatNumber,
          timeSlot: `${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}`,
          amount: selectedPlan.price,
          date: new Date().toISOString(),
          status: 'Active'
        };
        setItem(STORAGE_KEYS.BOOKING_HISTORY, [...bookingHistory, newBooking]);

        Alert.alert(
          'Booking Confirmed!',
          `Your booking has been confirmed for ${selectedSeatNumber} at ${library.libraryName}.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Booking submission error:', error);
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
        Select Seat Number
      </Text>
      <View className="border border-gray-300 rounded-lg bg-white">
        <Picker
          selectedValue={selectedSeatNumber}
          onValueChange={(itemValue) => setSelectedSeatNumber(itemValue)}
          style={{ height: 50 }}
        >
          <Picker.Item label="Choose a seat..." value="" />
          {availableSeats.map((seat, index) => (
            <Picker.Item key={index} label={seat} value={seat} />
          ))}
        </Picker>
      </View>
      <Text className="text-xs text-gray-500 mt-2">
        Total seats available: {library.totalSeats}
      </Text>
    </View>
  );

  const renderBookingSummary = () => {
    if (!selectedPlan || !selectedTimeSlot || !selectedSeatNumber) return null;

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
            <Text className="font-medium text-gray-800">{selectedSeatNumber}</Text>
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
          onPress={handleBookNowPress}
          disabled={!selectedPlan || !selectedTimeSlot || !selectedSeatNumber || isBooking}
          className={`py-4 rounded-lg ${
            selectedPlan && selectedTimeSlot && selectedSeatNumber && !isBooking
              ? 'bg-blue-600'
              : 'bg-gray-300'
          }`}
          android_ripple={{ color: '#2563eb' }}
        >
          {isBooking ? (
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