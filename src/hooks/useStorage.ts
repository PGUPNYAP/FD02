// src/hooks/useStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStorage = () => {
  const setItem = async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`💾 Stored ${key}:`, value);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  const getItem = async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      const result = jsonValue ? JSON.parse(jsonValue) : null;
      console.log(`📱 Retrieved ${key}:`, result);
      return result;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  };

  // Synchronous version for immediate access (use carefully)
  const getItemSync = <T>(key: string): T | null => {
    try {
      // This is a fallback - prefer async version
      console.log(`📱 Sync retrieval attempted for ${key} - use async version when possible`);
      return null;
    } catch (error) {
      console.error('Error in sync storage access:', error);
      return null;
    }
  };
  const removeItem = async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`🗑️ Removed ${key} from storage`);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  };

  const clear = async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
      console.log('🧹 Cleared all storage');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  return {
    setItem,
    getItem,
    getItemSync,
    removeItem,
    clear,
  };
};

// Storage keys
export const STORAGE_KEYS = {
  SELECTED_LOCATION: 'selected_location',
  CURRENT_USER: 'current_user',
  ALL_USERS: 'all_users',
  BOOKING_HISTORY: 'booking_history',
  FAVORITES: 'favorites',
} as const;