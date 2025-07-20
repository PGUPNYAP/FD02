import axios from 'axios';
import { Location, LibrariesResponse, Library, BookingRequest, ReviewRequest } from '../types/api';

// API Configuration
const BASE_URL = 'http://10.0.2.2:3001/api'; // Android emulator
// const BASE_URL = 'http://localhost:3001/api'; // iOS simulator

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
      code: error.code
    });
    
    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('🔥 Network Error - Check if backend is running on port 3001');
    }
    
    return Promise.reject(error);
  }
);

// API Services
export const libraryApi = {
  // Get all locations
  getLocations: async (): Promise<Location[]> => {
    try {
      const response = await api.get('/library/getLocations');
      return response.data;
    } catch (error) {
      console.error('getLocations error:', error);
      throw error;
    }
  },

  // Get libraries by city with pagination
  getLibraries: async (city: string, page = 1, limit = 10): Promise<LibrariesResponse> => {
    try {
      const response = await api.get(`/library?city=${encodeURIComponent(city)}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('getLibraries error:', error);
      throw error;
    }
  },

  // Get library by ID
  getLibraryById: async (id: string): Promise<Library> => {
    try {
      const response = await api.get(`/library/${id}`);
      return response.data;
    } catch (error) {
      console.error('getLibraryById error:', error);
      throw error;
    }
  },

  // Search libraries
  searchLibraries: async (params: {
    city?: string;
    state?: string;
    libraryName?: string;
    page?: number;
    limit?: number;
  }): Promise<LibrariesResponse> => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      const response = await api.get(`/library?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('searchLibraries error:', error);
      throw error;
    }
  },
};

// Booking API
export const bookingApi = {
  createBooking: async (booking: BookingRequest): Promise<{ success: boolean; data: any; message: string }> => {
    try {
      console.log('📝 Creating booking with data:', booking);
      const response = await api.post('/bookings', booking);
      console.log('✅ Booking created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Booking creation failed:', error);
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Booking failed');
      }
      throw new Error('Network error - please check your connection');
    }
  },

  getUserBookings: async (userId: string): Promise<any[]> => {
    try {
      // Mock data for now since endpoint doesn't exist
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    } catch (error) {
      console.error('getUserBookings error:', error);
      throw error;
    }
  },
};

// Review API
export const reviewApi = {
  createReview: async (review: ReviewRequest): Promise<{ success: boolean; data: any; message: string }> => {
    try {
      console.log('📝 Creating review with data:', review);
      const response = await api.post('/reviews', review);
      console.log('✅ Review created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Review creation failed:', error);
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Review submission failed');
      }
      throw new Error('Network error - please check your connection');
    }
  },

  getReviewsByLibrary: async (libraryId: string): Promise<{ success: boolean; data: any[] }> => {
    try {
      const response = await api.get(`/reviews/library/${libraryId}`);
      return response.data;
    } catch (error) {
      console.error('getReviewsByLibrary error:', error);
      throw error;
    }
  },
};

export default api;