// API Types based on backend Prisma schema
export interface Location {
  city: string;
  state: string;
  country: string;
}

export interface Librarian {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface LibraryPlan {
  id: string;
  planName: string;
  hours: number;
  days: number;
  months: number;
  price: number;
  planType: string;
  description: string | null;
  isActive: boolean;
}

export interface Review {
  id: string;
  stars: number;
  comment: string | null;
  status: string;
  isActive: boolean;
  createdAt: string;
  student: {
    firstName: string | null;
    lastName: string | null;
  };
}

export interface Seat {
  id: string;
  seatNumber: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  isActive: boolean;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  capacity: number;
  bookedCount: number;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  order: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

export interface Library {
  id: string;
  libraryName: string;
  contactNumber: string;
  whatsAppNumber: string | null;
  address: string;
  area: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  googleMapLink: string | null;
  photos: string[];
  totalSeats: number;
  openingTime: string;
  closingTime: string;
  reviewStatus: string;
  isActive: boolean;
  description: string | null;
  facilities: string[];
  createdAt: string;
  updatedAt: string;
  librarian: Librarian;
  plans: LibraryPlan[];
  reviews: Review[];
  seats?: Seat[];
  timeSlots?: TimeSlot[];
  faqs?: FAQ[];
  socialLinks?: SocialLink[];
}

export interface LibrariesResponse {
  data: Library[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BookingRequest {
  studentId: string;
  libraryId: string;
  planId: string;
  timeSlotId: string;
  seatId: string;
  totalAmount: number;
}

export interface Booking {
  id: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  checkInTime: string | null;
  checkOutTime: string | null;
  validFrom: string;
  validTo: string;
  totalAmount: number;
  createdAt: string;
  library: {
    libraryName: string;
    address: string;
  };
  plan: LibraryPlan;
  seat: Seat;
  timeSlot: TimeSlot;
}