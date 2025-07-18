// src/navigation/types.ts
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  LibraryDetails: { libraryId: string };
  Booking: { library: any }; // You can strongly type this later if needed

};
