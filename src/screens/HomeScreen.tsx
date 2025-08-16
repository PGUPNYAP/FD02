import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { useLibraries } from '../hooks/useLibraries';
import { useStorage, STORAGE_KEYS } from '../hooks/useStorage';
import LocationPicker from '../components/LocationPicker';
import LocationButton from '../components/LocationButton';
import ProfileButton from '../components/ProfileButton';
import LibraryCard from '../components/LibraryCard';
import { Library } from '../types/api';
import { HomeScreenProps } from '../types/navigation';

const { height } = Dimensions.get('window');

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { getItem, setItem } = useStorage();

  // Load user data and saved location on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoadingUser(true);

        // Load current user from storage
        const userData = await getItem(STORAGE_KEYS.CURRENT_USER);
        setCurrentUser(userData);
        console.log('📱 User data loaded in HomeScreen:', userData);

        // Load saved location from storage
        const savedLocation = await getItem(STORAGE_KEYS.SELECTED_LOCATION);
        if (savedLocation) {
          setSelectedLocation(savedLocation);
          console.log('📍 Saved location loaded:', savedLocation);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserData();
  }, []);

  // Handle location change and save to storage
  const handleLocationChange = async (location: string) => {
    setSelectedLocation(location);
    try {
      await setItem(STORAGE_KEYS.SELECTED_LOCATION, location);
      console.log('📍 Location saved to storage:', location);
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  // Create user object for ProfileButton
  const user = currentUser
    ? {
        name: currentUser.firstName || currentUser.username || 'User',
        profileImage: currentUser.profilePhoto || null,
      }
    : null;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useLibraries(selectedLocation, !!selectedLocation);

  const libraries =
    data?.pages.flatMap(page => (page as { data: Library[] }).data) || [];

  // Filter libraries based on search query
  const filteredLibraries = libraries.filter(
    library =>
      library.libraryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      library.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      library.city.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleLibraryPress = (library: Library) => {
    navigation.navigate('LibraryDetails', { libraryId: library.id });
  };

  const handleBookNow = (library: Library) => {
    navigation.getParent()?.navigate('Booking', { library });
  };

  const handleProfilePress = () => {
    if (currentUser) {
      navigation.getParent()?.navigate('Profile');
    } else {
      navigation.getParent()?.navigate('Login');
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderLibraryItem = ({ item }: { item: Library }) => (
    <LibraryCard
      library={item}
      onPress={() => handleLibraryPress(item)}
      onBookNow={() => handleBookNow(item)}
    />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#3b82f6" />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-16">
      <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
        <Text className="text-blue-600 font-bold text-2xl">📚</Text>
      </View>
      <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">
        {!selectedLocation
          ? 'Choose Your Location'
          : searchQuery
          ? 'No Results Found'
          : 'No Libraries Available'}
      </Text>
      <Text className="text-sm text-gray-500 text-center px-8 leading-5">
        {!selectedLocation
          ? 'Select your preferred location to discover amazing study spaces near you'
          : searchQuery
          ? `No libraries found matching "${searchQuery}". Try a different search term.`
          : 'No libraries are currently available in this location. Check back later!'}
      </Text>
    </View>
  );

  // Show loading state while fetching user data
  if (isLoadingUser) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-3 text-gray-600 font-medium">Loading...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Enhanced Header */}
        <View className="bg-white shadow-sm border-b border-gray-100">
          {/* Top Row - Location and Profile */}
          <View className="flex-row justify-between items-center px-4 pt-4 pb-3">
            <LocationButton
              selectedLocation={selectedLocation}
              onPress={() => setShowLocationPicker(true)}
            />
            <ProfileButton user={user || undefined} onPress={handleProfilePress} />
          </View>

          {/* Welcome Section */}
          <View className="px-4 pb-4">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {currentUser
                ? `Welcome back, ${currentUser.firstName || currentUser.username || 'User'}! 👋`
                : 'Find Your Perfect Study Space'}
            </Text>
            <Text className="text-gray-600 text-base leading-5">
              {selectedLocation
                ? `Discover amazing libraries in ${selectedLocation}`
                : 'Choose your location to get started'}
            </Text>
          </View>

          {/* Compact Search Bar */}
          {selectedLocation && (
            <View className="px-4 pb-4">
              <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-3 py-2.5">
                <MagnifyingGlassIcon size={18} color="#6b7280" />
                <TextInput
                  placeholder="Search libraries, areas..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="flex-1 ml-2 text-base text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          )}
        </View>

        {/* Content Area */}
        {selectedLocation ? (
          <>
            {/* Quick Stats */}
            {libraries.length > 0 && !searchQuery && (
              <View className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                <Text className="text-sm text-blue-800 font-medium text-center">
                  {libraries.length} libraries found in {selectedLocation}
                </Text>
              </View>
            )}

            {/* Libraries List */}
            <FlatList
              data={filteredLibraries}
              renderItem={renderLibraryItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{ 
                paddingHorizontal: 16, 
                paddingTop: 16,
                paddingBottom: 20,
                flexGrow: 1
              }}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={!isLoading ? renderEmptyState : null}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={refetch}
                  colors={['#3b82f6']}
                  tintColor="#3b82f6"
                />
              }
            />
          </>
        ) : (
          <View className="flex-1">
            {renderEmptyState()}
          </View>
        )}

        {/* Loading State */}
        {isLoading && selectedLocation && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-3 text-gray-600 font-medium">Loading libraries...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View className="flex-1 items-center justify-center px-8">
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
              <Text className="text-red-600 font-bold text-xl">⚠️</Text>
            </View>
            <Text className="text-red-600 text-center mb-2 font-semibold">
              Failed to load libraries
            </Text>
            <Text className="text-gray-600 text-center text-sm leading-5">
              Please check your internet connection and try again
            </Text>
          </View>
        )}

        {/* Location Picker Modal */}
        <LocationPicker
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          isVisible={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
        />
      </SafeAreaView>
    </>
  );
}