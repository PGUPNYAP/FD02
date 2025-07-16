import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  Image,
} from 'react-native';
import {
  UserIcon,
  ClockIcon,
  CreditCardIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
} from 'react-native-heroicons/outline';
import { ProfileScreenProps } from '../types/navigation';


export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    profileImage: null,
  };

  // Mock current subscription
  const currentSubscription = {
    libraryName: 'Shanti Library',
    planName: 'Monthly Plan',
    validUntil: '2024-02-15',
    seatNumber: 'A1',
    status: 'Active',
  };

  // Mock booking history
  const bookingHistory = [
    {
      id: '1',
      libraryName: 'Shanti Library',
      planName: 'Monthly Plan',
      date: '2024-01-15',
      amount: 2500,
      status: 'Active',
    },
    {
      id: '2',
      libraryName: 'Kripa Library',
      planName: 'Weekly Plan',
      date: '2024-01-01',
      amount: 700,
      status: 'Completed',
    },
  ];

  const menuItems = [
    {
      icon: BellIcon,
      title: 'Notifications',
      subtitle: 'Manage your notifications',
      onPress: () => {},
    },
    {
      icon: CreditCardIcon,
      title: 'Payment Methods',
      subtitle: 'Manage payment options',
      onPress: () => {},
    },
    {
      icon: QuestionMarkCircleIcon,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => navigation.navigate('Support'),
    },
    {
      icon: Cog6ToothIcon,
      title: 'Settings',
      subtitle: 'App preferences and settings',
      onPress: () => {},
    },
  ];

  const renderProfileHeader = () => (
    <View className="items-center py-6 bg-blue-50">
      <View className="w-24 h-24 bg-blue-600 rounded-full items-center justify-center mb-4">
        {user.profileImage ? (
          <Image
            source={{ uri: user.profileImage }}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <UserIcon size={40} color="white" />
        )}
      </View>
      <Text className="text-xl font-bold text-gray-800">{user.name}</Text>
      <Text className="text-gray-600">{user.email}</Text>
      <Text className="text-gray-600">{user.phone}</Text>
    </View>
  );

  const renderCurrentSubscription = () => (
    <View className="mx-4 mt-4 mb-6">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Current Subscription
      </Text>
      {currentSubscription ? (
        <View className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">
                {currentSubscription.libraryName}
              </Text>
              <Text className="text-sm text-gray-600">
                {currentSubscription.planName}
              </Text>
            </View>
            <View className={`px-2 py-1 rounded-full ${
              currentSubscription.status === 'Active' 
                ? 'bg-green-100' 
                : 'bg-gray-100'
            }`}>
              <Text className={`text-xs font-medium ${
                currentSubscription.status === 'Active' 
                  ? 'text-green-800' 
                  : 'text-gray-800'
              }`}>
                {currentSubscription.status}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">
              Seat: {currentSubscription.seatNumber}
            </Text>
            <Text className="text-sm text-gray-600">
              Valid until: {currentSubscription.validUntil}
            </Text>
          </View>
        </View>
      ) : (
        <View className="bg-gray-50 p-6 rounded-lg items-center">
          <Text className="text-gray-600 mb-2">No active subscription</Text>
          <Pressable
            onPress={() => navigation.navigate('Home')}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Browse Libraries</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  const renderBookingHistory = () => (
    <View className="mx-4 mb-6">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Booking History
      </Text>
      {bookingHistory.length > 0 ? (
        bookingHistory.map((booking) => (
          <View
            key={booking.id}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-3"
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="font-semibold text-gray-800">
                  {booking.libraryName}
                </Text>
                <Text className="text-sm text-gray-600">
                  {booking.planName}
                </Text>
                <Text className="text-xs text-gray-500">
                  {booking.date}
                </Text>
              </View>
              <View className="items-end">
                <Text className="font-semibold text-gray-800">
                  ₹{booking.amount.toLocaleString()}
                </Text>
                <View className={`px-2 py-1 rounded-full mt-1 ${
                  booking.status === 'Active' 
                    ? 'bg-green-100' 
                    : 'bg-gray-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    booking.status === 'Active' 
                      ? 'text-green-800' 
                      : 'text-gray-800'
                  }`}>
                    {booking.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View className="bg-gray-50 p-6 rounded-lg items-center">
          <ClockIcon size={40} color="#9ca3af" />
          <Text className="text-gray-600 mt-2">No booking history</Text>
        </View>
      )}
    </View>
  );

  const renderMenuItem = (item: any, index: number) => (
    <Pressable
      key={index}
      onPress={item.onPress}
      className="flex-row items-center p-4 bg-white border-b border-gray-100"
      android_ripple={{ color: '#f3f4f6' }}
    >
      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
        <item.icon size={20} color="#6b7280" />
      </View>
      <View className="flex-1">
        <Text className="font-medium text-gray-800">{item.title}</Text>
        <Text className="text-sm text-gray-600">{item.subtitle}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        {renderCurrentSubscription()}
        {renderBookingHistory()}
        
        <View className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Account Settings
          </Text>
          <View className="bg-white rounded-lg overflow-hidden shadow-sm">
            {menuItems.map(renderMenuItem)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}