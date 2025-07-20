import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { Library, LibraryPlan } from './api';

// Root Stack Navigator Types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Profile: undefined;
  LibraryDetails: {
    libraryId: string;
  };
  Booking: {
    library: Library;
    selectedPlan?: LibraryPlan;
  };
};

// Tab Navigator Types
export type TabParamList = {
  Home: undefined;
  Resources: undefined;
  Mentorship: undefined;
  More: undefined;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Specific Screen Props
export type LibraryDetailsScreenProps = RootStackScreenProps<'LibraryDetails'>;
export type BookingScreenProps = RootStackScreenProps<'Booking'>;
export type HomeScreenProps = TabScreenProps<'Home'>;
export type ResourcesScreenProps = TabScreenProps<'Resources'>;
export type MentorshipScreenProps = TabScreenProps<'Mentorship'>;