import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Pressable,
  Linking,
  Alert,
  StatusBar,
} from 'react-native';
import {
  ArrowLeftIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ShareIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
} from 'react-native-heroicons/outline';
import { ChatBubbleLeftRightIcon as WhatsAppIcon } from 'react-native-heroicons/solid';
import { useLibraryDetails } from '../hooks/useLibraries';
import { reviewApi } from '../services/api';
import { Review, FAQ, Library } from '../types/api';
import { useStorage, STORAGE_KEYS } from '../hooks/useStorage';
import { LibraryDetailsScreenProps } from '../types/navigation';
import ImageSlider from '../components/ImageSlider';
import ExpandableText from '../components/ExpandableText';
import FacilityIcon from '../components/FacilityIcon';
import ReviewForm from '../components/ReviewForm';

export default function LibraryDetailsScreen({ navigation, route }: LibraryDetailsScreenProps) {
  const { libraryId } = route.params;
  const { data: library, isLoading, error } = useLibraryDetails(libraryId);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { getItem } = useStorage();

  const currentUser = getItem(STORAGE_KEYS.CURRENT_USER);

  const handleCall = () => {
    if (library?.contactNumber) {
      Linking.openURL(`tel:${library.contactNumber}`);
    }
  };


  const handleWhatsApp = () => {
    if (library?.whatsAppNumber) {
      const phoneWithCountryCode = library.whatsAppNumber.replace(/\D/g, '');
      const url = `whatsapp://send?phone=${phoneWithCountryCode}`;

      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            Alert.alert('Error', 'WhatsApp is not installed on your device.');
          }
        })
        .catch((err) => {
          console.error('WhatsApp error:', err);
          Alert.alert('Error', 'Failed to open WhatsApp.');
        });
    } else {
      Alert.alert('Missing Number', 'This library does not have a WhatsApp number.');
    }
  };


  const handleDirections = () => {
    if (library?.googleMapLink) {
      Linking.openURL(library.googleMapLink);
    }
  };

  const handleBookNow = () => {
    if (library) {
      navigation.navigate('Booking', { library });
    } else {
      Alert.alert(
        'Library not available',
        'Unable to proceed with booking because library details are not loaded.'
      );
    }
  };

  const handlePlanPress = (plan: any) => {
    if (library) {
      navigation.navigate('Booking', { library, selectedPlan: plan });
    }
  };

  const handleSubmitReview = async (reviewData: { stars: number; comment: string }) => {
    if (!currentUser) {
      Alert.alert('Login Required', 'Please login to submit a review.', [
        { text: 'Login', onPress: () => navigation.navigate('Login') },
        { text: 'Cancel', style: 'cancel' }
      ]);
      return;
    }

    try {
      // Create a mock student ID since we don't have real student management
      const mockStudentId = 'stu-1'; // Use the seeded student ID
      
      const reviewRequest = {
        studentId: mockStudentId,
        libraryId: library!.id,
        stars: reviewData.stars,
        comment: reviewData.comment || undefined,
      };

      console.log('Submitting review data:', reviewRequest);

      await reviewApi.createReview({
        studentId: mockStudentId,
        libraryId: library!.id,
        stars: reviewData.stars,
        comment: reviewData.comment || undefined,
      });
      Alert.alert('Success', 'Thank you for your review!');
    } catch (error) {
      console.error('Review submission error:', error);
      throw error;
    }
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
      <View key={review.id} className="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
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
          {review.student ? (
            <Text className="ml-2 text-sm text-gray-600 font-medium">
              {review.student.firstName} {review.student.lastName}
            </Text>
          ) : (
            <Text className="ml-2 text-sm text-gray-500 italic">
              Anonymous
            </Text>
          )}
        </View>
        {review.comment && (
          <Text className="text-sm text-gray-700 leading-5">{review.comment}</Text>
        )}
      </View>
    ));
  };

  const renderFAQs = (faqs: FAQ[]) => {
    if (faqs.length === 0) return null;

    return faqs.map((faq) => (
      <View key={faq.id} className="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <Text className="font-semibold text-gray-800 mb-2">
          Q: {faq.question}
        </Text>
        <Text className="text-gray-600 text-sm leading-5">
          A: {faq.answer}
        </Text>
      </View>
    ));
  };

  if (isLoading) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-2 text-gray-600">Loading library details...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (error || !library) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
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
      </>
    );
  }

  const averageRating = library.reviews.length > 0 
    ? library.reviews.reduce((sum, review) => sum + review.stars, 0) / library.reviews.length 
    : 0;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100">
          <Pressable
            onPress={() => navigation.goBack()}
            className="p-2 rounded-full bg-gray-50"
            android_ripple={{ color: '#f3f4f6' }}
          >
            <ArrowLeftIcon size={24} color="#374151" />
          </Pressable>
          <Text className="text-lg font-semibold text-gray-800">Library Details</Text>
          <Pressable 
            className="p-2 rounded-full bg-gray-50" 
            android_ripple={{ color: '#f3f4f6' }}
          >
            <ShareIcon size={24} color="#374151" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Image Slider */}
          <ImageSlider 
            images={library.photos} 
            height={280} 
            libraryName={library.libraryName}
          />

          <View className="p-4">
          {/* Library Info */}
          <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  {library.libraryName}
                </Text>
                <View className="flex-row items-center mb-2">
                  <MapPinIcon size={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-600 flex-1">{library.address}</Text>
                </View>
                <View className="flex-row items-center">
                  <ClockIcon size={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-700 font-medium">
                    {library.openingTime} - {library.closingTime}
                  </Text>
                </View>
              </View>
              {averageRating > 0 && (
                <View className="items-center bg-yellow-50 px-3 py-2 rounded-xl">
                  <View className="flex-row items-center">
                    <StarIcon size={16} color="#fbbf24" />
                    <Text className="ml-1 font-bold text-gray-800">
                      {averageRating.toFixed(1)}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">
                    {library.reviews.length} reviews
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-between space-x-2">
              <Pressable
                onPress={handleCall}
                className="flex-1 bg-green-600 py-2.5 px-3 rounded-lg flex-row items-center justify-center shadow-sm"
                android_ripple={{ color: '#16a34a' }}
              >
                <PhoneIcon size={16} color="white" />
                <Text className="ml-1.5 text-white font-medium text-sm">Call</Text>
              </Pressable>

              {library.whatsAppNumber && (
                <Pressable
                  onPress={handleWhatsApp}
                  className="flex-1 bg-green-500 py-2.5 px-3 rounded-lg flex-row items-center justify-center shadow-sm mx-1"
                  android_ripple={{ color: '#22c55e' }}
                >
                  <WhatsAppIcon size={16} color="white" />
                  <Text className="ml-1.5 text-white font-medium text-sm">WhatsApp</Text>
                </Pressable>
              )}

              <Pressable
                onPress={handleDirections}
                className="flex-1 bg-blue-600 py-2.5 px-3 rounded-lg flex-row items-center justify-center shadow-sm"
                android_ripple={{ color: '#2563eb' }}
              >
                <MapPinIcon size={16} color="white" />
                <Text className="ml-1.5 text-white font-medium text-sm">Directions</Text>
              </Pressable>
            </View>
          </View>

          {/* Description */}
          {library.description && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3 px-1">About</Text>
              <ExpandableText 
                text={library.description}
                numberOfLines={10}
                containerStyle="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
                textStyle="text-gray-700 leading-6"
              />
            </View>
          )}

          {/* Facilities */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3 px-1">Facilities</Text>
            <View className="flex-row flex-wrap">
              {library.facilities.map((facility, index) => (
                <FacilityIcon key={index} facility={facility} size={16} />
              ))}
            </View>
          </View>

          {/* Plans */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3 px-1">Subscription Plans</Text>
            {library.plans.map((plan) => (
              <Pressable 
                key={plan.id} 
                onPress={() => handlePlanPress(plan)}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-3"
                android_ripple={{ color: '#f3f4f6' }}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="font-bold text-gray-900 text-lg">{plan.planName}</Text>
                    <Text className="text-sm text-gray-600 mb-1">
                      {plan.hours} hours • {plan.days} days
                    </Text>
                    {plan.description && (
                      <Text className="text-sm text-gray-500">
                        {plan.description}
                      </Text>
                    )}
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-bold text-blue-600">
                      ₹{plan.price.toLocaleString()}
                    </Text>
                    <Text className="text-xs text-gray-500">per {plan.planType}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Reviews */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3 px-1">
              <Text className="text-lg font-semibold text-gray-800">Reviews</Text>
              <Pressable
                onPress={() => setShowReviewForm(true)}
                className="flex-row items-center bg-blue-600 px-3 py-2 rounded-lg"
                android_ripple={{ color: '#2563eb' }}
              >
                <PlusIcon size={16} color="white" />
                <Text className="text-white font-medium ml-1 text-sm">Add Review</Text>
              </Pressable>
            </View>
            {renderReviews(library.reviews)}
          </View>

          {/* FAQs */}
          {library.faqs && library.faqs.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3 px-1">
                Frequently Asked Questions
              </Text>
              {renderFAQs(library.faqs)}
            </View>
          )}
        </View>
        </ScrollView>

        {/* Book Now Button */}
        <View className="p-4 bg-white border-t border-gray-100">
          <Pressable
            onPress={handleBookNow}
            className="bg-blue-600 py-4 rounded-2xl shadow-lg"
            style={{
              shadowColor: '#3b82f6',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
            android_ripple={{ color: '#2563eb' }}
          >
            <Text className="text-white text-center font-bold text-lg">
              Book Now
            </Text>
          </Pressable>
        </View>

        {/* Review Form Modal */}
        <ReviewForm
          isVisible={showReviewForm}
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleSubmitReview}
          libraryName={library.libraryName}
        />
      </SafeAreaView>
    </>
  );
}