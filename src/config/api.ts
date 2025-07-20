// src/config/api.ts
const BASE_URL = 'http://10.0.2.2:3001/api'; // ✅ for Android emulator
// const BASE_URL = 'http://localhost:3001/api'; // ✅ for iOS simulator

export const API_ROUTES = {
  // Library routes
  getLocations: `${BASE_URL}/library/getLocations`,
  getLibraries: (city: string) => `${BASE_URL}/library?city=${city}&page=1&limit=5`,
  getLibraryById: (id: string) => `${BASE_URL}/library/${id}`,
  
  // Booking routes
  createBooking: `${BASE_URL}/bookings`,
  getUserBookings: (userId: string) => `${BASE_URL}/bookings/user/${userId}`,
  
  // Review routes
  createReview: `${BASE_URL}/reviews`,
  getReviewsByLibrary: (libraryId: string) => `${BASE_URL}/reviews/library/${libraryId}`,
};