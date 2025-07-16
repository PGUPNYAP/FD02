import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const useStorage = () => {
  const setItem = (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      storage.set(key, jsonValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  const getItem = <T>(key: string): T | null => {
    try {
      const jsonValue = storage.getString(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  };

  const removeItem = (key: string) => {
    try {
      storage.delete(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  };

  const clear = () => {
    try {
      storage.clearAll();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  return {
    setItem,
    getItem,
    removeItem,
    clear,
  };
};

// Storage keys
export const STORAGE_KEYS = {
  SELECTED_LOCATION: 'selected_location',
  USER_PROFILE: 'user_profile',
  BOOKING_HISTORY: 'booking_history',
  FAVORITES: 'favorites',
};