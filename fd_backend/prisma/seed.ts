import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

async function main() {
  // Clear existing data (in reverse dependency order)
  await prisma.notification.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.review.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.libraryPlan.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.library.deleteMany();
  await prisma.librarian.deleteMany();
  await prisma.student.deleteMany();

  // Now insert fresh seed data
  // ... rest of your seeding code


  // Students
  await prisma.student.createMany({ data: [
    {
      id: 'stu-1',
      cognitoId: 'cognito-stu-1',
      username: 'studentAlpha',
      email: 'alpha@student.com',
      password: 'secureAlphaPass',
      provider: 'COGNITO',
      role: 'STUDENT',
      firstName: 'Alpha',
      lastName: 'Smith',
      phoneNumber: '9001100110',
      profilePhoto: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'stu-2',
      cognitoId: 'cognito-stu-2',
      username: 'studentBeta',
      email: 'beta@student.com',
      password: 'strongBetaPass',
      provider: 'GOOGLE',
      role: 'STUDENT',
      firstName: 'Beta',
      lastName: 'Jones',
      phoneNumber: '9002200220',
      profilePhoto: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'stu-3',
      cognitoId: 'cognito-stu-3',
      username: 'studentGamma',
      email: 'gamma@student.com',
      password: 'passGamma!',
      provider: 'COGNITO',
      role: 'STUDENT',
      firstName: 'Gamma',
      lastName: 'Brown',
      phoneNumber: '9003300330',
      profilePhoto: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]});
  console.log("✅ Seeded students");

  // Librarians
  await prisma.librarian.createMany({ data: [
  {
    id: 'lib-1',
    cognitoId: 'cognito-lib-1',
    username: 'librarianAlpha',
    email: 'alpha@library.com',
    password: 'libAlphaPass',
    provider: 'COGNITO',
    role: 'LIBRARIAN',
    firstName: 'Lib',
    lastName: 'Alpha',
    contactNumber: '9110001000',
    alternateContactNumber: null,
    dateOfBirth: new Date('1985-06-25'),
    profileCompleted: true,
    isActive: true,
    address: '123 Main St',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    country: 'India',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'lib-2',
    cognitoId: 'cognito-lib-2',
    username: 'librarianBeta',
    email: 'beta@library.com',
    password: 'libBetaPass',
    provider: 'GOOGLE',
    role: 'LIBRARIAN',
    firstName: 'Lib',
    lastName: 'Beta',
    contactNumber: '9220002000',
    alternateContactNumber: '9009900990',
    dateOfBirth: new Date('1990-02-14'),
    profileCompleted: false,
    isActive: true,
    address: '456 Library Ave',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'lib-3',
    cognitoId: 'cognito-lib-3',
    username: 'librarianGamma',
    email: 'gamma@library.com',
    password: 'libGammaPass',
    provider: 'GOOGLE',
    role: 'LIBRARIAN',
    firstName: 'Lib',
    lastName: 'Gamma',
    contactNumber: '9330003000',
    alternateContactNumber: null,
    dateOfBirth: new Date('1988-05-10'),
    profileCompleted: true,
    isActive: true,
    address: '789 Gamma Rd',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110002',
    country: 'India',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'lib-4',
    cognitoId: 'cognito-lib-4',
    username: 'librarianDelta',
    email: 'delta@library.com',
    password: 'libDeltaPass',
    provider: 'COGNITO',
    role: 'LIBRARIAN',
    firstName: 'Lib',
    lastName: 'Delta',
    contactNumber: '9440004000',
    alternateContactNumber: null,
    dateOfBirth: new Date('1992-11-11'),
    profileCompleted: true,
    isActive: true,
    address: '456 Delta Lane',
    city: 'Laxmi Nagar',
    state: 'Delhi',
    pincode: '110003',
    country: 'India',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'lib-5',
    cognitoId: 'cognito-lib-5',
    username: 'librarianEpsilon',
    email: 'epsilon@library.com',
    password: 'libEpsilonPass',
    provider: 'GOOGLE',
    role: 'LIBRARIAN',
    firstName: 'Lib',
    lastName: 'Epsilon',
    contactNumber: '9550005000',
    alternateContactNumber: null,
    dateOfBirth: new Date('1995-01-01'),
    profileCompleted: true,
    isActive: true,
    address: 'Epsilon Street 9',
    city: 'Laxmi Nagar',
    state: 'Delhi',
    pincode: '110004',
    country: 'India',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]});

  console.log("✅ Seeded librarians");

  // Libraries
  await prisma.library.createMany({
  data: [
    {
      id: 'library-1',
      libraryName: 'Shanti Library',
      contactNumber: '9111100011',
      whatsAppNumber: '9111100012',
      address: 'J7HW+GCJ, Railway Colony, Mandawali, New Delhi, Delhi',
      city: 'Mandawali',
      state: 'Delhi',
      pincode: '110092',
      country: 'India',
      googleMapLink: 'https://maps.app.goo.gl/sdVCavP6NCrr28rKA',
      photos: [
  "https://i.postimg.cc/fLbSyYJV/Whats-App-Image-2025-07-17-at-2-24-08-PM.jpg",
  "https://i.postimg.cc/ZqtGxh3m/Whats-App-Image-2025-07-17-at-2-25-04-PM.jpg",
  "https://i.postimg.cc/fLbSyYJV/Whats-App-Image-2025-07-17-at-2-24-08-PM.jpg",
  "https://i.postimg.cc/ZqtGxh3m/Whats-App-Image-2025-07-17-at-2-25-04-PM.jpg"
],
      totalSeats: 30,
      openingTime: '06:00',
      closingTime: '23:00',
      reviewStatus: 'APPROVED',
      isActive: true,
      description: 'A modern library with collaborative zones.',
      facilities: ['WiFi', 'AC', 'Parking', 'Cafeteria'],
      createdAt: new Date(),
      updatedAt: new Date(),
      librarianId: 'lib-1'
    },
    {
      id: 'library-2',
      libraryName: 'Kripa Library',
      contactNumber: '9122200022',
      whatsAppNumber: '9122200023',
      address: '78 Knowledge Rd, Mandawali',
      city: 'Mandawali',
      state: 'Delhi',
      pincode: '110092',
      country: 'India',
      googleMapLink: 'https://maps.google.com/readers-arena',
      photos: ["https://i.postimg.cc/ZqtGxh3m/Whats-App-Image-2025-07-17-at-2-25-04-PM.jpg",
               "https://i.postimg.cc/fLbSyYJV/Whats-App-Image-2025-07-17-at-2-24-08-PM.jpg",],
      totalSeats: 20,
      openingTime: '6:00',
      closingTime: '22:00',
      reviewStatus: 'APPROVED', // changed from PENDING
      isActive: true,
      description: 'Silent study spaces and reference materials.',
      facilities: ['WiFi', 'CCTV', 'AC'],
      createdAt: new Date(),
      updatedAt: new Date(),
      librarianId: 'lib-2'
    },
    {
      id: 'library-3',
      libraryName: 'Focus Study Zone',
      contactNumber: '9133300033',
      whatsAppNumber: '9133300034',
      address: '12 Study Marg, Mandawali',
      city: 'Mandawali',
      state: 'Delhi',
      pincode: '110092',
      country: 'India',
      googleMapLink: 'https://maps.google.com/focus-study-zone',
      photos: [],
      totalSeats: 25,
      openingTime: '08:00',
      closingTime: '21:00',
      reviewStatus: 'APPROVED',
      isActive: true,
      description: 'Quiet study rooms and group zones.',
      facilities: ['WiFi', 'AC', 'Drinking Water'],
      createdAt: new Date(),
      updatedAt: new Date(),
      librarianId: 'lib-3'
    },
    {
      id: 'library-4',
      libraryName: 'Scholars Den',
      contactNumber: '9144400044',
      whatsAppNumber: '9144400045',
      address: '23 Education Ave, Laxmi Nagar',
      city: 'Laxmi Nagar',
      state: 'Delhi',
      pincode: '110092',
      country: 'India',
      googleMapLink: 'https://maps.google.com/scholars-den',
      photos: [],
      totalSeats: 40,
      openingTime: '07:00',
      closingTime: '22:00',
      reviewStatus: 'APPROVED',
      isActive: true,
      description: 'Large reading halls and high-speed internet.',
      facilities: ['WiFi', 'CCTV', 'Lockers'],
      createdAt: new Date(),
      updatedAt: new Date(),
      librarianId: 'lib-4'
    },
    {
      id: 'library-5',
      libraryName: 'Delhi Central Library',
      contactNumber: '9155500055',
      whatsAppNumber: '9155500056',
      address: '5 Central Rd, Laxmi Nagar',
      city: 'Laxmi Nagar',
      state: 'Delhi',
      pincode: '110092',
      country: 'India',
      googleMapLink: 'https://maps.google.com/delhi-central-library',
      photos: [],
      totalSeats: 50,
      openingTime: '06:00',
      closingTime: '23:00',
      reviewStatus: 'APPROVED',
      isActive: true,
      description: 'Public library with free access and printing.',
      facilities: ['WiFi', 'Printing', 'Study Material'],
      createdAt: new Date(),
      updatedAt: new Date(),
      librarianId: 'lib-5'
    }
  ]
});
console.log("✅ Seeded 5 libraries in Delhi (Mandawali & Laxmi Nagar)");

  // Seats
 await prisma.seat.createMany({
  data: [
    // Library 1
    { id: 'seat-1', seatNumber: 1, status: 'AVAILABLE', isActive: true, libraryId: 'library-1', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-2', seatNumber: 2, status: 'OCCUPIED', isActive: true, libraryId: 'library-1', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-3', seatNumber: 3, status: 'MAINTENANCE', isActive: false, libraryId: 'library-1', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-16', seatNumber: 4, status: 'AVAILABLE', isActive: true, libraryId: 'library-1', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-17', seatNumber: 5, status: 'AVAILABLE', isActive: true, libraryId: 'library-1', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-18', seatNumber: 6, status: 'AVAILABLE', isActive: true, libraryId: 'library-1', createdAt: new Date(), updatedAt: new Date() },

    // Library 2
    { id: 'seat-4', seatNumber: 1, status: 'AVAILABLE', isActive: true, libraryId: 'library-2', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-5', seatNumber: 2, status: 'OCCUPIED', isActive: true, libraryId: 'library-2', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-6', seatNumber: 3, status: 'AVAILABLE', isActive: true, libraryId: 'library-2', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-19', seatNumber: 4, status: 'AVAILABLE', isActive: true, libraryId: 'library-2', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-20', seatNumber: 5, status: 'AVAILABLE', isActive: true, libraryId: 'library-2', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-21', seatNumber: 6, status: 'AVAILABLE', isActive: true, libraryId: 'library-2', createdAt: new Date(), updatedAt: new Date() },

    // Library 3
    { id: 'seat-7', seatNumber: 1, status: 'MAINTENANCE', isActive: false, libraryId: 'library-3', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-8', seatNumber: 2, status: 'AVAILABLE', isActive: true, libraryId: 'library-3', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-9', seatNumber: 3, status: 'OCCUPIED', isActive: true, libraryId: 'library-3', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-22', seatNumber: 4, status: 'AVAILABLE', isActive: true, libraryId: 'library-3', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-23', seatNumber: 5, status: 'AVAILABLE', isActive: true, libraryId: 'library-3', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-24', seatNumber: 6, status: 'AVAILABLE', isActive: true, libraryId: 'library-3', createdAt: new Date(), updatedAt: new Date() },

    // Library 4
    { id: 'seat-10', seatNumber: 1, status: 'AVAILABLE', isActive: true, libraryId: 'library-4', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-11', seatNumber: 2, status: 'OCCUPIED', isActive: true, libraryId: 'library-4', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-12', seatNumber: 3, status: 'AVAILABLE', isActive: true, libraryId: 'library-4', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-25', seatNumber: 4, status: 'AVAILABLE', isActive: true, libraryId: 'library-4', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-26', seatNumber: 5, status: 'AVAILABLE', isActive: true, libraryId: 'library-4', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-27', seatNumber: 6, status: 'AVAILABLE', isActive: true, libraryId: 'library-4', createdAt: new Date(), updatedAt: new Date() },

    // Library 5
    { id: 'seat-13', seatNumber: 1, status: 'AVAILABLE', isActive: true, libraryId: 'library-5', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-14', seatNumber: 2, status: 'MAINTENANCE', isActive: false, libraryId: 'library-5', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-15', seatNumber: 3, status: 'OCCUPIED', isActive: true, libraryId: 'library-5', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-28', seatNumber: 4, status: 'AVAILABLE', isActive: true, libraryId: 'library-5', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-29', seatNumber: 5, status: 'AVAILABLE', isActive: true, libraryId: 'library-5', createdAt: new Date(), updatedAt: new Date() },
    { id: 'seat-30', seatNumber: 6, status: 'AVAILABLE', isActive: true, libraryId: 'library-5', createdAt: new Date(), updatedAt: new Date() }
  ]
});

console.log("✅ Seeded 30 seats across 5 libraries");



  // Social Links
  await prisma.socialLink.createMany({ data: [
    { id: 'social-1', platform: 'facebook', url: 'https://fb.com/knowledge-hub', isActive: true, libraryId: 'library-1', createdAt: new Date(), updatedAt: new Date() },
    { id: 'social-2', platform: 'instagram', url: 'https://instagram.com/knowledge-hub', isActive: true, libraryId: 'library-1', createdAt: new Date(), updatedAt: new Date() },
    { id: 'social-3', platform: 'twitter', url: 'https://twitter.com/readers-arena', isActive: true, libraryId: 'library-2', createdAt: new Date(), updatedAt: new Date() }
  ]});
  console.log("✅ Seeded social links");

  // Library Plans
await prisma.libraryPlan.createMany({
  data: [
    {
      id: 'plan-1',
      planName: 'Monthly',
      hours: 200,
      days: 30,
      months: 1,
      price: 2500.0,
      planType: 'monthly',
      description: 'Access for one month',
      isActive: true,
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'plan-2',
      planName: 'Weekly',
      hours: 40,
      days: 7,
      months: 0,
      price: 700.0,
      planType: 'weekly',
      description: 'Access for a week',
      isActive: true,
      libraryId: 'library-2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'plan-3',
      planName: 'Daily Pass',
      hours: 8,
      days: 1,
      months: 0,
      price: 120.0,
      planType: 'daily',
      description: 'One-day access with 8 hours of usage',
      isActive: true,
      libraryId: 'library-3',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'plan-4',
      planName: 'Weekend Pass',
      hours: 16,
      days: 2,
      months: 0,
      price: 250.0,
      planType: 'weekend',
      description: 'Access for Saturday and Sunday',
      isActive: true,
      libraryId: 'library-4',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'plan-5',
      planName: 'Quarterly Plan',
      hours: 600,
      days: 90,
      months: 3,
      price: 6000.0,
      planType: 'quarterly',
      description: 'Best for long-term users – 3-month access',
      isActive: true,
      libraryId: 'library-5',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'plan-6',
      planName: 'Student Special',
      hours: 100,
      days: 30,
      months: 1,
      price: 1200.0,
      planType: 'monthly',
      description: 'Discounted plan for students with ID',
      isActive: true,
      libraryId: 'library-2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'plan-7',
      planName: 'Evening Pass',
      hours: 60,
      days: 30,
      months: 1,
      price: 800.0,
      planType: 'evening',
      description: 'Evening access only (5PM to 10PM)',
      isActive: true,
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'plan-8',
      planName: 'Flexi Plan',
      hours: 150,
      days: 45,
      months: 1,
      price: 1800.0,
      planType: 'flexi',
      description: 'Flexible hour usage within 45 days',
      isActive: true,
      libraryId: 'library-5',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
});
console.log("✅ Seeded all library plans");


  // TimeSlots
  // TimeSlots - Add more realistic time slots for each library
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  await prisma.timeSlot.createMany({
  data: [
    // Library 1 - Today's slots
    {
      id: 'ts-1',
      startTime: '09:00',
      endTime: '12:00',
      date: today,
      capacity: 10,
      bookedCount: 2,
      status: 'AVAILABLE',
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-2',
      startTime: '12:00',
      endTime: '15:00',
      date: today,
      capacity: 10,
      bookedCount: 7,
      status: 'AVAILABLE',
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-3',
      startTime: '15:00',
      endTime: '18:00',
      date: today,
      capacity: 10,
      bookedCount: 2,
      status: 'AVAILABLE',
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-4',
      startTime: '18:00',
      endTime: '21:00',
      date: today,
      capacity: 10,
      bookedCount: 10,
      status: 'BOOKED',
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Library 2 - Today's slots
    {
      id: 'ts-5',
      startTime: '08:00',
      endTime: '11:00',
      date: today,
      capacity: 10,
      bookedCount: 3,
      status: 'AVAILABLE',
      libraryId: 'library-2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-6',
      startTime: '11:00',
      endTime: '14:00',
      date: today,
      capacity: 8,
      bookedCount: 5,
      status: 'AVAILABLE',
      libraryId: 'library-2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-7',
      startTime: '14:00',
      endTime: '17:00',
      date: today,
      capacity: 8,
      bookedCount: 8,
      status: 'BOOKED',
      libraryId: 'library-2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Library 3 - Today's slots
    {
      id: 'ts-8',
      startTime: '10:00',
      endTime: '13:00',
      date: today,
      capacity: 12,
      bookedCount: 4,
      status: 'AVAILABLE',
      libraryId: 'library-3',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-9',
      startTime: '13:00',
      endTime: '15:00',
      date: today,
      capacity: 12,
      bookedCount: 8,
      status: 'AVAILABLE',
      libraryId: 'library-3',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Tomorrow's slots for Library 1
    {
      id: 'ts-10',
      startTime: '09:00',
      endTime: '12:00',
      date: tomorrow,
      capacity: 10,
      bookedCount: 0,
      status: 'AVAILABLE',
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-11',
      startTime: '12:00',
      endTime: '15:00',
      date: tomorrow,
      capacity: 10,
      bookedCount: 0,
      status: 'AVAILABLE',
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-12',
      startTime: '15:00',
      endTime: '18:00',
      date: tomorrow,
      capacity: 10,
      bookedCount: 0,
      status: 'AVAILABLE',
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Library 4 - Today's slots
    {
      id: 'ts-13',
      startTime: '07:00',
      endTime: '10:00',
      date: today,
      capacity: 8,
      bookedCount: 5,
      status: 'AVAILABLE',
      libraryId: 'library-4',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-14',
      startTime: '10:00',
      endTime: '13:00',
      date: today,
      capacity: 15,
      bookedCount: 8,
      status: 'AVAILABLE',
      libraryId: 'library-4',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Library 5 - Today's slots
    {
      id: 'ts-15',
      startTime: '06:00',
      endTime: '09:00',
      date: today,
      capacity: 20,
      bookedCount: 1,
      status: 'AVAILABLE',
      libraryId: 'library-5',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-16',
      startTime: '09:00',
      endTime: '12:00',
      date: today,
      capacity: 20,
      bookedCount: 15,
      status: 'AVAILABLE',
      libraryId: 'library-5',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-17',
      startTime: '12:00',
      endTime: '15:00',
      date: today,
      capacity: 20,
      bookedCount: 20,
      status: 'BOOKED',
      libraryId: 'library-5',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-18',
      startTime: '15:00',
      endTime: '18:00',
      date: today,
      capacity: 20,
      bookedCount: 12,
      status: 'AVAILABLE',
      libraryId: 'library-5',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
});

console.log("✅ Seeded comprehensive time slots for all libraries");

  // Bookings
  await prisma.booking.createMany({ data: [
    {
      id: 'booking-1',
      status: 'ACTIVE',
      checkInTime: new Date(),
      checkOutTime: null,
      validFrom: new Date(),
      validTo: new Date(new Date().setDate(new Date().getDate() + 30)),
      totalAmount: 2500,
      studentId: 'stu-1',
      libraryId: 'library-1',
      planId: 'plan-1',
      timeSlotId: 'ts-1',
      seatId: 'seat-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'booking-2',
      status: 'COMPLETED',
      checkInTime: new Date(new Date().setDate(new Date().getDate() - 1)),
      checkOutTime: new Date(),
      validFrom: new Date(new Date().setDate(new Date().getDate() - 8)),
      validTo: new Date(),
      totalAmount: 700,
      studentId: 'stu-3',
      libraryId: 'library-2',
      planId: 'plan-2',
      timeSlotId: 'ts-3',
      seatId: 'seat-3',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]});
  console.log("✅ Seeded bookings");

  // Transactions
  await prisma.transaction.createMany({ data: [
    {
      id: 'txn-1',
      amount: 2500.0,
      paymentMethod: 'UPI',
      paymentStatus: 'COMPLETED',
      paymentId: 'pay_UPI_001',
      description: 'Monthly plan - Alpha',
      studentId: 'stu-1',
      librarianId: 'lib-1',
      bookingId: 'booking-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'txn-2',
      amount: 700.0,
      paymentMethod: 'CARD',
      paymentStatus: 'COMPLETED',
      paymentId: 'pay_CARD_001',
      description: 'Weekly plan - Gamma',
      studentId: 'stu-3',
      librarianId: 'lib-2',
      bookingId: 'booking-2',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]});
  console.log("✅ Seeded transactions");

  // Reviews
  await prisma.review.createMany({ data: [
    {
      id: 'rev-1',
      stars: 5,
      comment: 'Fantastic library experience!',
      status: 'APPROVED',
      isActive: true,
      studentId: 'stu-1',
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rev-2',
      stars: 4,
      comment: 'Quiet and clean.',
      status: 'APPROVED',
      isActive: true,
      studentId: 'stu-3',
      libraryId: 'library-2',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]});
  console.log("✅ Seeded reviews");

  // Complaints
  await prisma.complaint.createMany({ data: [
    {
      id: 'comp-1',
      complaint: 'WiFi not working on 2nd floor.',
      status: 'PENDING',
      resolution: null,
      resolvedAt: null,
      studentId: 'stu-2',
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'comp-2',
      complaint: 'Air conditioning too cold.',
      status: 'RESOLVED',
      resolution: 'Temperature adjusted.',
      resolvedAt: new Date(),
      studentId: 'stu-3',
      libraryId: 'library-2',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]});
  console.log("✅ Seeded complaints");

  // FAQs
  await prisma.faq.createMany({ data: [
    {
      id: 'faq-1',
      question: 'Is food allowed inside?',
      answer: 'Only in the cafeteria zone.',
      isActive: true,
      order: 1,
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-2',
      question: 'Are there lockers?',
      answer: 'Yes, locker facility is available for all members.',
      isActive: true,
      order: 2,
      libraryId: 'library-2',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]});
  console.log("✅ Seeded FAQs");

  // Notifications
  await prisma.notification.createMany({ data: [
    {
      id: 'notif-1',
      title: 'Booking Confirmed',
      message: 'Your monthly booking has been confirmed.',
      type: 'BOOKING_CONFIRMATION',
      isRead: false,
      studentId: 'stu-1',
      librarianId: null,
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'notif-2',
      title: 'Library Timings Update',
      message: 'Library timings have been updated for the summer.',
      type: 'LIBRARY_UPDATE',
      isRead: false,
      studentId: null,
      librarianId: 'lib-1',
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]});
  console.log("✅ Seeded notifications");
}

main()
  .then(() => {
    console.log('🌱 Database seeding complete!');
    return prisma.$disconnect();
  })
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  });