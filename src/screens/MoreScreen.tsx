import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  StarIcon,
} from 'react-native-heroicons/outline';

interface MoreScreenProps {
  navigation: any;
}

export default function MoreScreen({ navigation }: MoreScreenProps) {
  const supportOptions = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      subtitle: 'Chat with our support team',
      action: () => {},
      color: 'bg-blue-500',
    },
    {
      icon: PhoneIcon,
      title: 'Call Support',
      subtitle: '+91 1800-123-4567',
      action: () => {},
      color: 'bg-green-500',
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      subtitle: 'support@focusdesk.com',
      action: () => {},
      color: 'bg-purple-500',
    },
    {
      icon: QuestionMarkCircleIcon,
      title: 'FAQ',
      subtitle: 'Find answers to common questions',
      action: () => {},
      color: 'bg-orange-500',
    },
  ];

  const menuItems = [
    {
      icon: InformationCircleIcon,
      title: 'About Us',
      subtitle: 'Learn more about Focus Desk',
      action: () => {},
    },
    {
      icon: ShieldCheckIcon,
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      action: () => {},
    },
    {
      icon: DocumentTextIcon,
      title: 'Terms of Service',
      subtitle: 'Terms and conditions',
      action: () => {},
    },
    {
      icon: StarIcon,
      title: 'Rate the App',
      subtitle: 'Share your feedback',
      action: () => {},
    },
  ];

  const renderSupportOption = (option: any, index: number) => (
    <Pressable
      key={index}
      onPress={option.action}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3"
      android_ripple={{ color: '#f3f4f6' }}
    >
      <View className="flex-row items-center">
        <View className={`w-12 h-12 ${option.color} rounded-lg items-center justify-center mr-3`}>
          <option.icon size={24} color="white" />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-gray-800">{option.title}</Text>
          <Text className="text-sm text-gray-600">{option.subtitle}</Text>
        </View>
      </View>
    </Pressable>
  );

  const renderMenuItem = (item: any, index: number) => (
    <Pressable
      key={index}
      onPress={item.action}
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
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-800 mb-1">
          More
        </Text>
        <Text className="text-gray-600">
          Support, settings, and app information
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Customer Support Section */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Customer Support
          </Text>
          {supportOptions.map(renderSupportOption)}
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Quick Actions
          </Text>
          <View className="flex-row">
            <Pressable className="flex-1 bg-blue-600 p-4 rounded-lg mr-2 items-center">
              <QuestionMarkCircleIcon size={24} color="white" />
              <Text className="text-white font-medium mt-2">Report Issue</Text>
            </Pressable>
            <Pressable className="flex-1 bg-green-600 p-4 rounded-lg ml-2 items-center">
              <ChatBubbleLeftRightIcon size={24} color="white" />
              <Text className="text-white font-medium mt-2">Feedback</Text>
            </Pressable>
          </View>
        </View>

        {/* App Information */}
        <View className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            App Information
          </Text>
          <View className="bg-white rounded-lg overflow-hidden shadow-sm">
            {menuItems.map(renderMenuItem)}
          </View>
        </View>

        {/* App Version */}
        <View className="px-4">
          <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <Text className="text-center text-gray-600 mb-1">Focus Desk</Text>
            <Text className="text-center text-sm text-gray-500">Version 1.0.0</Text>
            <Text className="text-center text-xs text-gray-400 mt-2">
              © 2024 Focus Desk. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}