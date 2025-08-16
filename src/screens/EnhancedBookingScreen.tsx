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
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Library, LibraryPlan, TimeSlot } from '../types/api';
import { bookingApi, studentApi, timeSlotApi } from '../services/api';
import { useStorage, STORAGE_KEYS } from '../hooks/useStorage';
import { BookingScreenProps } from '../types/navigation';
import SeatSelectionGrid from '../components/SeatSelectionGrid';

export default function EnhancedBookingScreen({ navigation, route }: BookingScreenProps) {
  const { library, selectedPlan: preSelectedPlan } = route.params;
  const [selectedPlan, setSelectedPlan] = useState<LibraryPlan | null>(preSelectedPlan || null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedSeatId, setSelectedSeatId] = useState<string>('');
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<number>(0);
  const { getItem } = useStorage();
  const queryClient = useQueryClient();

  // Load current user from storage
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Load user data on component mount
  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getItem(STORAGE_KEYS.CURRENT_USER);
        console.log("userData from Booking : ",userData);
        setCurrentUser(userData);
        console.log('📱 Current user loaded in booking screen:', userData);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    loadUserData();
  }, []);

  // Fetch real timeslots from backend
  const { 
    data: timeSlots, 
    isLoading: isLoadingTimeSlots, 
    error: timeSlotsError 
  } = useQuery({
    queryKey: ['timeslots', library.id],
    queryFn: () => timeSlotApi.getTimeSlotsByLibraryId(library.id),
    enabled: !!library.id,
    staleTime: 30000, // 30 seconds
  });

  // const bookingMutation = useMutation({
  //   mutationFn: bookingApi.createBooking,
  //   onSuccess: (data) => {
  //     // Invalidate and refetch seat data
  //     queryClient.invalidateQueries({ queryKey: ['seats', library.id] });
  //     queryClient.invalidateQueries({ queryKey: ['timeslots', library.id] });
      
  //     Alert.alert(
  //       'Booking Confirmed!',
  //       `Your booking has been confirmed for Seat ${selectedSeatNumber} at ${library.libraryName}.`,
  //       [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
  //     );
  //   },
  //   onError: (error: any) => {
  //     console.error('Booking error:', error);
  //     Alert.alert(
  //       'Booking Failed', 
  //       error.message || 'Something went wrong. Please try again.'
  //     );
  //   },
  // });

  // Mutation to verify student exists before booking
  // const verifyStudentMutation = useMutation({
  //   mutationFn: studentApi.getStudentByCognitoId,
  //   onSuccess: (studentData) => {
  //     console.log('✅ Student verified:', studentData);
  //     // Proceed with booking using the verified student ID
  //     proceedWithBooking(studentData.id);
  //   },
  //   onError: (error: any) => {
  //     console.error('❌ Student verification failed:', error);
  //     Alert.alert(
  //       'Authentication Error',
  //       'Please login again to continue booking.',
  //       [{ text: 'Login', onPress: () => navigation.navigate('Login') }]
  //     );
  //   },
  // });
  const handleSeatSelect = (seatId: string, seatNumber: number) => {
    setSelectedSeatId(seatId);
    setSelectedSeatNumber(seatNumber);
  };

  const handleBookNowPress = () => {
    if (isLoadingUser) {
      Alert.alert('Loading', 'Please wait while we verify your login status.');
      return;
    }
    console.log("current user in handle Book press",currentUser.accessToken);
    if (!currentUser.accessToken) {
      Alert.alert('Login Required', 'Please login to book a seat.', [
        { text: 'Login', onPress: () => navigation.navigate('Login') },
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
  //  verifyStudentMutation.mutate(currentUser.cognitoId);
   // proceedWithBooking();
  };

  // const proceedWithBooking = () => {
  //   if (!selectedPlan || !selectedTimeSlot || !selectedSeatId) return;
    
  //   try {
  //     // Ensure all IDs are strings and match backend expectations
  //     const bookingData = {
  //      // studentId: verifiedStudentId, // Use the verified backend student ID
  //       libraryId: library.id,
  //       planId: selectedPlan.id,
  //       timeSlotId: selectedTimeSlot.id,
  //       seatId: selectedSeatId,
  //       totalAmount: Number(selectedPlan.price), // Ensure it's a number
  //     };

  //     console.log('📝 Submitting booking with verified data:', bookingData);
      
  //     // Validate all required fields are present
  //     const requiredFields = ['studentId', 'libraryId', 'planId', 'timeSlotId', 'seatId', 'totalAmount'];
  //     const missingFields = requiredFields.filter(field => !bookingData[field as keyof typeof bookingData]);
      
  //     if (missingFields.length > 0) {
  //       throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  //     }
      
  //  //   bookingMutation.mutate(bookingData);
  //   } catch (error) {
  //     console.error('Booking submission error:', error);
  //     Alert.alert('Booking Error', 'Failed to prepare booking data. Please try again.');
  //   }
  // };

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
      
      {isLoadingTimeSlots ? (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-2 text-gray-600">Loading time slots...</Text>
        </View>
      ) : timeSlotsError ? (
        <View className="items-center py-8">
          <Text className="text-red-500 mb-4">Failed to load time slots</Text>
          <Pressable
            onPress={() => queryClient.invalidateQueries({ queryKey: ['timeslots', library.id] })}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Retry</Text>
          </Pressable>
        </View>
      ) : !timeSlots || timeSlots.length === 0 ? (
        <View className="items-center py-8">
          <Text className="text-gray-600">No time slots available</Text>
        </View>
      ) : (
      <View className="flex-row flex-wrap">
        {timeSlots.map((slot) => (
          <Pressable
            key={slot.id}
            onPress={() => slot.isBookable && setSelectedTimeSlot(slot)}
            disabled={!slot.isBookable}
            className={`p-3 rounded-lg border-2 mr-3 mb-3 min-w-24 ${
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
              {slot.availableSpots} available
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
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800">{library.libraryName}</Text>
          <Text className="text-gray-600">{library.address}</Text>
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
        {/* <Pressable
          onPress={handleBookNowPress}
          disabled={!selectedPlan || !selectedTimeSlot || !selectedSeatId || bookingMutation.isPending || verifyStudentMutation.isPending || isLoadingUser}
          className={`py-4 rounded-lg ${
            selectedPlan && selectedTimeSlot && selectedSeatId && !bookingMutation.isPending && !verifyStudentMutation.isPending && !isLoadingUser
              ? 'bg-blue-600'
              : 'bg-gray-300'
          }`}
          android_ripple={{ color: '#2563eb' }}
        >
          {/* {(bookingMutation.isPending || verifyStudentMutation.isPending || isLoadingUser) ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Book Now
            </Text>
          )} }
        </Pressable> */}
      </View>
    </SafeAreaView>
  );
}