import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Pressable,
  Image,
  Linking,
  Dimensions,
} from 'react-native';
import {
  ArrowLeftIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  ShareIcon,
} from 'react-native-heroicons/outline';
import { useLibraryDetails } from '../hooks/useLibraries';
import { Review, FAQ } from '../types/api';
import { LibraryDetailsScreenProps } from '../types/navigation';


const { width } = Dimensions.get('window');

export default function LibraryDetailsScreen({ navigation, route }: LibraryDetailsScreenProps) {
  const { libraryId } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: library, isLoading, error } = useLibraryDetails(libraryId);

  const handleCall = () => {
    if (library?.contactNumber) {
      Linking.openURL(`tel:${library.contactNumber}`);
    }
  };

  const handleWhatsApp = () => {
    if (library?.whatsAppNumber) {
      Linking.openURL(`whatsapp://send?phone=${library.whatsAppNumber}`);
    }
  };

  const handleDirections = () => {
    if (library?.googleMapLink) {
      Linking.openURL(library.googleMapLink);
    }
  };

  const handleBookNow = () => {
    navigation.navigate('Booking', { library });
  };

  const renderImageSlider = () => {
    const images = library?.photos || [];
    if (images.length === 0) {
      return (
        <View className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 items-center justify-center">
          <Text className="text-blue-600 font-bold text-4xl">
            {library?.libraryName.charAt(0)}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentImageIndex(index);
        }}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={{ width, height: 256 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    );
  };

  const renderReviews = (reviews: Review[]) => {
    if (reviews.length === 0) {
      return (
        <Text className="text-gray-500 text-center py-4">
          No reviews yet
        </Text>
      );
    }

    return reviews.slice(0, 3).map((review) => (
      <View key={review.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
        <View className="flex-row items-center mb-2">
          <View className="flex-row">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                size={14}
                color={i < review.stars ? '#fbbf24' : '#e5e7eb'}
              />
            ))}
          </View>
          <Text className="ml-2 text-sm text-gray-600">
            {review.student.firstName} {review.student.lastName}
          </Text>
        </View>
        {review.comment && (
          <Text className="text-sm text-gray-700">{review.comment}</Text>
        )}
      </View>
    ));
  };

  const renderFAQs = (faqs: FAQ[]) => {
    if (faqs.length === 0) return null;

    return faqs.map((faq) => (
      <View key={faq.id} className="mb-3">
        <Text className="font-medium text-gray-800 mb-1">
          Q: {faq.question}
        </Text>
        <Text className="text-gray-600 text-sm">
          A: {faq.answer}
        </Text>
      </View>
    ));
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-2 text-gray-600">Loading library details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !library) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-red-500 text-center mb-2">
            Failed to load library details
          </Text>
          <Pressable
            onPress={() => navigation.goBack()}
            className="mt-4 bg-blue-600 px-6 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const averageRating = library.reviews.length > 0 
    ? library.reviews.reduce((sum, review) => sum + review.stars, 0) / library.reviews.length 
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <Pressable
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full"
          android_ripple={{ color: '#f3f4f6' }}
        >
          <ArrowLeftIcon size={24} color="#374151" />
        </Pressable>
        <Text className="text-lg font-semibold text-gray-800">Library Details</Text>
        <Pressable className="p-2 rounded-full" android_ripple={{ color: '#f3f4f6' }}>
          <ShareIcon size={24} color="#374151" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Slider */}
        <View className="relative">
          {renderImageSlider()}
          {library.photos.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
              {library.photos.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        <View className="p-4">
          {/* Library Info */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800 mb-1">
                {library.libraryName}
              </Text>
              <View className="flex-row items-center">
                <MapPinIcon size={16} color="#6b7280" />
                <Text className="ml-1 text-gray-600">{library.address}</Text>
              </View>
            </View>
            {averageRating > 0 && (
              <View className="items-center">
                <View className="flex-row items-center">
                  <StarIcon size={16} color="#fbbf24" />
                  <Text className="ml-1 font-semibold text-gray-800">
                    {averageRating.toFixed(1)}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500">
                  {library.reviews.length} reviews
                </Text>
              </View>
            )}
          </View>

          {/* Timing */}
          <View className="flex-row items-center mb-4">
            <ClockIcon size={16} color="#6b7280" />
            <Text className="ml-2 text-gray-700">
              Open: {library.openingTime} - {library.closingTime}
            </Text>
          </View>

          {/* Description */}
          {library.description && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-2">About</Text>
              <Text className="text-gray-700 leading-6">{library.description}</Text>
            </View>
          )}

          {/* Facilities */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Facilities</Text>
            <View className="flex-row flex-wrap">
              {library.facilities.map((facility, index) => (
                <View
                  key={index}
                  className="bg-blue-50 px-3 py-1 rounded-full mr-2 mb-2"
                >
                  <Text className="text-blue-700 text-sm">{facility}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Plans */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Subscription Plans</Text>
            {library.plans.map((plan) => (
              <View key={plan.id} className="bg-gray-50 p-4 rounded-lg mb-3">
                <View className="flex-row justify-between items-center">
                  <View>
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
                  <Text className="text-lg font-bold text-blue-600">
                    ₹{plan.price.toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Reviews */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Reviews</Text>
            {renderReviews(library.reviews)}
          </View>

          {/* FAQs */}
          {library.faqs && library.faqs.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Frequently Asked Questions
              </Text>
              {renderFAQs(library.faqs)}
            </View>
          )}

          {/* Contact Actions */}
          <View className="flex-row mb-6">
            <Pressable
              onPress={handleCall}
              className="flex-1 bg-green-600 py-3 rounded-lg mr-2 flex-row items-center justify-center"
              android_ripple={{ color: '#16a34a' }}
            >
              <PhoneIcon size={20} color="white" />
              <Text className="ml-2 text-white font-medium">Call</Text>
            </Pressable>

            {library.whatsAppNumber && (
              <Pressable
                onPress={handleWhatsApp}
                className="flex-1 bg-green-500 py-3 rounded-lg mx-1 flex-row items-center justify-center"
                android_ripple={{ color: '#22c55e' }}
              >
                <Text className="text-white font-medium">WhatsApp</Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleDirections}
              className="flex-1 bg-blue-600 py-3 rounded-lg ml-2 flex-row items-center justify-center"
              android_ripple={{ color: '#2563eb' }}
            >
              <MapPinIcon size={20} color="white" />
              <Text className="ml-2 text-white font-medium">Directions</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View className="p-4 border-t border-gray-200">
        <Pressable
          onPress={handleBookNow}
          className="bg-blue-600 py-4 rounded-lg"
          android_ripple={{ color: '#2563eb' }}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Book Now
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}