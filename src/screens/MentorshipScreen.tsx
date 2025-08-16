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
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
} from 'react-native-heroicons/solid';
import { TabScreenProps } from '../types/navigation';


export default function MentorshipScreen({ }: TabScreenProps<'Mentorship'>) {
  const mentors = [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      expertise: 'UPSC Preparation',
      experience: '8 years',
      rating: 4.9,
      reviews: 156,
      price: 1500,
      image: null,
      availability: 'Available',
      specialties: ['General Studies', 'Essay Writing', 'Interview Prep'],
    },
    {
      id: '2',
      name: 'Prof. Rajesh Kumar',
      expertise: 'JEE/NEET Coaching',
      experience: '12 years',
      rating: 4.8,
      reviews: 203,
      price: 1200,
      image: null,
      availability: 'Busy',
      specialties: ['Physics', 'Mathematics', 'Problem Solving'],
    },
    {
      id: '3',
      name: 'Ms. Anita Verma',
      expertise: 'MBA Entrance',
      experience: '6 years',
      rating: 4.7,
      reviews: 89,
      price: 1800,
      image: null,
      availability: 'Available',
      specialties: ['Quantitative Aptitude', 'Logical Reasoning', 'GD/PI'],
    },
  ];

  const sessionTypes = [
    {
      icon: VideoCameraIcon,
      title: 'Video Call',
      description: 'One-on-one video sessions',
      duration: '60 min',
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Chat Session',
      description: 'Text-based mentoring',
      duration: '30 min',
    },
    {
      icon: UserGroupIcon,
      title: 'Group Session',
      description: 'Learn with peers',
      duration: '90 min',
    },
  ];

  const renderMentorCard = (mentor: any) => (
    <Pressable
      key={mentor.id}
      className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
      android_ripple={{ color: '#f3f4f6' }}
    >
      <View className="p-4">
        <View className="flex-row mb-3">
          <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center mr-3">
            {mentor.image ? (
              <Image
                source={{ uri: mentor.image }}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <Text className="text-white font-bold text-lg">
                {mentor.name.split(' ').map((n: string) => n[0]).join('')}
              </Text>
            )}
          </View>
          <View className="flex-1">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-lg font-semibold text-gray-800">
                  {mentor.name}
                </Text>
                <Text className="text-sm text-blue-600 font-medium">
                  {mentor.expertise}
                </Text>
                <Text className="text-xs text-gray-500">
                  {mentor.experience} experience
                </Text>
              </View>
              <View className={`px-2 py-1 rounded-full ${
                mentor.availability === 'Available' 
                  ? 'bg-green-100' 
                  : 'bg-yellow-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  mentor.availability === 'Available' 
                    ? 'text-green-800' 
                    : 'text-yellow-800'
                }`}>
                  {mentor.availability}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row items-center mb-3">
          <StarIcon size={16} color="#fbbf24" />
          <Text className="ml-1 text-sm font-medium text-gray-700">
            {mentor.rating}
          </Text>
          <Text className="ml-1 text-sm text-gray-500">
            ({mentor.reviews} reviews)
          </Text>
        </View>

        <View className="flex-row flex-wrap mb-3">
          {mentor.specialties.map((specialty: string, index: number) => (
            <View
              key={index}
              className="bg-blue-50 px-2 py-1 rounded-full mr-2 mb-1"
            >
              <Text className="text-xs text-blue-700">{specialty}</Text>
            </View>
          ))}
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-800">
            ₹{mentor.price}/session
          </Text>
          <Pressable
            className="bg-blue-600 px-4 py-2 rounded-lg"
            android_ripple={{ color: '#2563eb' }}
          >
            <Text className="text-white font-medium">Book Session</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  const renderSessionType = (session: any, index: number) => (
    <Pressable
      key={index}
      className="bg-white p-4 rounded-lg border border-gray-200 mr-3 min-w-32"
      android_ripple={{ color: '#f3f4f6' }}
    >
      <View className="items-center">
        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
          <session.icon size={20} color="#3b82f6" />
        </View>
        <Text className="font-medium text-gray-800 text-center mb-1">
          {session.title}
        </Text>
        <Text className="text-xs text-gray-600 text-center mb-1">
          {session.description}
        </Text>
        <Text className="text-xs text-blue-600 font-medium">
          {session.duration}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-800 mb-1">
          Find a Mentor
        </Text>
        <Text className="text-gray-600">
          Get personalized guidance from expert mentors
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Session Types */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3 px-4">
            Session Types
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {sessionTypes.map(renderSessionType)}
          </ScrollView>
        </View>

        {/* Featured Mentors */}
        <View className="px-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Featured Mentors
          </Text>
          {mentors.map(renderMentorCard)}
        </View>

        {/* How it Works */}
        <View className="mx-4 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            How Mentorship Works
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-blue-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white text-xs font-bold">1</Text>
              </View>
              <Text className="text-gray-700 flex-1">
                Choose a mentor based on your goals
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-blue-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white text-xs font-bold">2</Text>
              </View>
              <Text className="text-gray-700 flex-1">
                Book a session at your convenience
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-blue-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white text-xs font-bold">3</Text>
              </View>
              <Text className="text-gray-700 flex-1">
                Get personalized guidance and support
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}