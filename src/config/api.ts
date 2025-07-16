// src/config/api.ts
const BASE_URL = 'http://10.0.2.2:3001/api/library'; // ✅ for Android emulator

export const API_ROUTES = {
  getLocations: `${BASE_URL}/getLocations`,
  getLibraries: (city: string) => `${BASE_URL}?city=${city}&page=1&limit=5`,
};
