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

// Time Slot API
export const timeSlotApi = {
  getAvailableTimeSlots: async (libraryId: string, date: string): Promise<any[]> => {
    try {
      const response = await api.get(`/timeslots/available?libraryId=${libraryId}&date=${date}`);
      return response.data.data?.timeSlots || [];
    } catch (error) {
      console.error('getAvailableTimeSlots error:', error);
      // Return mock data if API fails
      return [
        {
          id: 'ts-1',
          startTime: '09:00',
          endTime: '12:00',
          date: date,
          capacity: 10,
          bookedCount: 3,
          status: 'AVAILABLE',
          availableSpots: 7,
          isBookable: true,
        },
        {
          id: 'ts-2',
          startTime: '12:00',
          endTime: '15:00',
          date: date,
          capacity: 10,
          bookedCount: 7,
          status: 'AVAILABLE',
          availableSpots: 3,
          isBookable: true,
        },
        {
          id: 'ts-3',
          startTime: '15:00',
          endTime: '18:00',
          date: date,
          capacity: 10,
          bookedCount: 2,
          status: 'AVAILABLE',
          availableSpots: 8,
          isBookable: true,
        },
        {
          id: 'ts-4',
          startTime: '18:00',
          endTime: '21:00',
          date: date,
          capacity: 10,
          bookedCount: 10,
          status: 'BOOKED',
          availableSpots: 0,
          isBookable: false,
        },
      ];
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
      const response = await api.get(`/bookings/user/${userId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('getUserBookings error:', error);
      // Return empty array if endpoint doesn't exist yet
      return [];
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

// Student API
export const studentApi = {
  createStudent: async (studentData: {
    cognitoId: string;
    username: string;
    email: string;
    name?: string;
    password?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<{ success: boolean; data?: any; message: string }> => {
    try {
      console.log('📝 Creating student with data:', studentData);
      const response = await api.post('/students', studentData);
      console.log('✅ Student created successfully:', response.data);
      return { success: true, data: response.data, message: response.data.message || 'Student created successfully' };
    } catch (error: any) {
      console.error('❌ Student creation failed:', error);
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Student creation failed');
      }
      throw new Error('Network error - please check your connection');
    }
  },

  // Get student by cognitoId to verify existence
  getStudentByCognitoId: async (cognitoId: string): Promise<{ id: string; cognitoId: string; username: string; email: string }> => {
    try {
      console.log('🔍 Fetching student by cognitoId:', cognitoId);
      const response = await api.get(`/students/${cognitoId}`);
      console.log('✅ Student found:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Student not found:', error);
      if (error.response?.status === 404) {
        throw new Error('Student not found. Please login again.');
      }
      throw new Error('Failed to verify student');
    }
  },
};

// Seat API
export const seatApi = {
  getAvailableSeats: async (
    libraryId: string, 
    date?: string, 
    startTime?: string, 
    endTime?: string
  ): Promise<Array<{
    id: string;
    seatNumber: number;
    status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  }>> => {
    try {
      console.log('🪑 Fetching available seats for library:', libraryId, { date, startTime, endTime });
      
      // Build query parameters for seat availability check
      const params = new URLSearchParams();
      params.append('libraryId', libraryId);
      if (date) params.append('date', date);
      if (startTime) params.append('startTime', startTime);
      if (endTime) params.append('endTime', endTime);
      
      const response = await api.get(`/bookings/available?${params.toString()}`);
      console.log('✅ Available seats fetched:', response.data);
      
      // Transform backend response to match frontend expectations
      return response.data.data || [];
    } catch (error: any) {
      console.error('❌ Failed to fetch seats:', error);
      
      // Fallback to mock data if backend endpoint doesn't exist yet
      console.log('⚠️ Using fallback mock data for seats');
      try {
        const library = await libraryApi.getLibraryById(libraryId);
        const totalSeats = library.totalSeats || 30;
        
        const seats = [];
        for (let i = 1; i <= totalSeats; i++) {
          // Randomly assign some seats as occupied for demo
          const isOccupied = Math.random() < 0.3; // 30% chance of being occupied
          seats.push({
            id: `seat-${i}`,
            seatNumber: i,
            status: isOccupied ? 'OCCUPIED' : 'AVAILABLE' as const,
          });
        }
        
        return seats;
      } catch (fallbackError) {
        throw new Error('Failed to load seats');
      }
    }
  },
};

export default api;