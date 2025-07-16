import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {
  BookOpenIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  GlobeAltIcon,
} from 'react-native-heroicons/outline';

interface ResourcesScreenProps {
  navigation: any;
}

export default function ResourcesScreen({ navigation }: ResourcesScreenProps) {
  const resourceCategories = [
    {
      id: '1',
      title: 'Study Materials',
      description: 'Access curated study materials and notes',
      icon: BookOpenIcon,
      color: 'bg-blue-500',
      items: ['UPSC Notes', 'Engineering Books', 'Medical Guides', 'MBA Resources'],
    },
    {
      id: '2',
      title: 'Online Courses',
      description: 'Enroll in professional development courses',
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      items: ['Programming', 'Data Science', 'Digital Marketing', 'Design'],
    },
    {
      id: '3',
      title: 'Practice Tests',
      description: 'Take mock tests and practice exams',
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
      items: ['JEE Mock Tests', 'NEET Practice', 'CAT Preparation', 'GATE Tests'],
    },
    {
      id: '4',
      title: 'Video Lectures',
      description: 'Watch expert lectures and tutorials',
      icon: VideoCameraIcon,
      color: 'bg-red-500',
      items: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    },
    {
      id: '5',
      title: 'Research Papers',
      description: 'Access academic papers and journals',
      icon: GlobeAltIcon,
      color: 'bg-indigo-500',
      items: ['IEEE Papers', 'Medical Journals', 'Business Studies', 'Science Articles'],
    },
  ];

  const renderResourceCard = (resource: any) => (
    <Pressable
      key={resource.id}
      className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
      android_ripple={{ color: '#f3f4f6' }}
    >
      <View className="p-4">
        <View className="flex-row items-center mb-3">
          <View className={`w-12 h-12 ${resource.color} rounded-lg items-center justify-center mr-3`}>
            <resource.icon size={24} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">
              {resource.title}
            </Text>
            <Text className="text-sm text-gray-600">
              {resource.description}
            </Text>
          </View>
        </View>
        
        <View className="flex-row flex-wrap">
          {resource.items.map((item: string, index: number) => (
            <View
              key={index}
              className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2"
            >
              <Text className="text-xs text-gray-700">{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-800 mb-1">
          Study Resources
        </Text>
        <Text className="text-gray-600">
          Enhance your learning with our curated resources
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {resourceCategories.map(renderResourceCard)}
        
        {/* Coming Soon Section */}
        <View className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            More Resources Coming Soon!
          </Text>
          <Text className="text-gray-600 mb-4">
            We're constantly adding new study materials, courses, and tools to help you succeed.
          </Text>
          <Pressable className="bg-blue-600 py-2 px-4 rounded-lg self-start">
            <Text className="text-white font-medium">Get Notified</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}