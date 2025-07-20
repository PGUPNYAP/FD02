import axios from 'axios';
import { Location, LibrariesResponse, Library, BookingRequest, ReviewRequest } from '../types/api';

// API Configuration
const BASE_URL = 'http://10.0.2.2:3002/api'; // Android emulator - Updated to match your backend port
// const BASE_URL = 'http://localhost:3002/api'; // iOS simulator

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Services
export const libraryApi = {
  // Get all locations
  getLocations: (): Promise<Location[]> =>
    api.get('/library/getLocations').then(res => res.data),

  // Get libraries by city with pagination
  getLibraries: (city: string, page = 1, limit = 10): Promise<LibrariesResponse> =>
    api.get(`/library?city=${encodeURIComponent(city)}&page=${page}&limit=${limit}`)
      .then(res => res.data),

  // Get library by ID
  getLibraryById: (id: string): Promise<Library> =>
    api.get(`/library/${id}`).then(res => res.data),

  // Search libraries
  searchLibraries: (params: {
    city?: string;
    state?: string;
    libraryName?: string;
    page?: number;
    limit?: number;
  }): Promise<LibrariesResponse> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    return api.get(`/library?${queryParams.toString()}`).then(res => res.data);
  },
};

// Booking API
export const bookingApi = {
  createBooking: (booking: BookingRequest): Promise<{ success: boolean; data: any; message: string }> =>
    api.post('/bookings', booking).then(res => res.data),

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    // Mock data for user bookings
    await new Promise(resolve => setTimeout(resolve, 500));
    return [];
  },
};

// Review API
export const reviewApi = {
  createReview: (review: ReviewRequest): Promise<{ success: boolean; data: any; message: string }> =>
    api.post('/reviews', review).then(res => res.data),

  getReviewsByLibrary: (libraryId: string): Promise<{ success: boolean; data: any[] }> =>
    api.get(`/reviews/library/${libraryId}`).then(res => res.data),
};

export default api;