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
const libraries = [
  'library-1',
  'library-2',
  'library-3',
  'library-4',
  'library-5',
];

const seatsData = [];

let seatIdCounter = 1;

for (const libraryId of libraries) {
  for (let seatNumber = 1; seatNumber <= 30; seatNumber++) {
    let status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' = 'AVAILABLE';
    let isActive = true;

    // Example status logic — you can adjust to match your rules
    if (seatNumber % 10 === 0) {
      status = 'MAINTENANCE';
      isActive = false;
    } else if (seatNumber % 4 === 0) {
      status = 'OCCUPIED';
    }

    seatsData.push({
      id: `seat-${seatIdCounter}`,
      seatNumber,
      status,
      isActive,
      libraryId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    seatIdCounter++;
  }
}

await prisma.seat.createMany({
  data: seatsData,
});

console.log(`✅ Seeded ${seatsData.length} seats across ${libraries.length} libraries`);

  // Social Links
  await prisma.socialLink.createMany({ data: [
    { id: 'social-1', platform: 'facebook', url: 'https://fb.com/knowledge-hub', isActive: true, libraryId: 'library-1', createdAt: new Date(), updatedAt: new Date() },
    { id: 'social-2', platform: 'instagram', url: 'https://instagram.com/knowledge-hub', isActive: true, libraryId: 'library-1', createdAt: new Date(), updatedAt: new Date() },
    { id: 'social-3', platform: 'twitter', url: 'https://twitter.com/readers-arena', isActive: true, libraryId: 'library-2', createdAt: new Date(), updatedAt: new Date() }
  ]});
  console.log("✅ Seeded social links");
// 💡 Library Plan Config
const planConfig = [
  // Library 1
  {
    libraryId: 'library-1',
    monthly: { 6: 600, 8: 800, 12: 1000 },
    quarterly: { 12: 3200 }
  },
  // Library 2
  {
    libraryId: 'library-2',
    monthly: { 6: 600, 8: 800, 12: 1000 },
    quarterly: { 6: 1800, 8: 2400 }
  },
  // Library 3
  {
    libraryId: 'library-3',
    monthly: { 6: 500, 8: 700 },
    quarterly: { 6: 1500, 8: 2100 }
  },
  // Library 4
  {
    libraryId: 'library-4',
    monthly: { 6: 550, 8: 750 },
    quarterly: { 6: 1650, 8: 2250 }
  },
  // Library 5
  {
    libraryId: 'library-5',
    monthly: { 6: 580, 8: 780 },
    quarterly: { 6: 1740, 8: 2340 }
  }
];

// ⚡ Function to generate all plans
function generatePlans() {
  const plans = [];
  let counter = 1;

  for (const lib of planConfig) {
    // Monthly plans
    for (const [hoursPerDay, price] of Object.entries(lib.monthly)) {
      plans.push({
        id: `plan-${counter++}`,
        planName: `Monthly ${hoursPerDay} Hours`,
        hours: Number(hoursPerDay) * 30, // daily hours * 30 days
        days: 30,
        months: 1,
        price: price,
        planType: 'monthly',
        description: `Monthly access with ${hoursPerDay} hours daily`,
        isActive: true,
        libraryId: lib.libraryId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Quarterly plans
    for (const [hoursPerDay, price] of Object.entries(lib.quarterly)) {
      plans.push({
        id: `plan-${counter++}`,
        planName: `Quarterly ${hoursPerDay} Hours`,
        hours: Number(hoursPerDay) * 90, // daily hours * 90 days
        days: 90,
        months: 3,
        price: price,
        planType: 'quarterly',
        description: `Quarterly access with ${hoursPerDay} hours daily`,
        isActive: true,
        libraryId: lib.libraryId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  return plans;
}

// 📦 Seed into DB
await prisma.libraryPlan.createMany({
  data: generatePlans()
});

console.log("✅ Seeded plans for all libraries");


  // TimeSlots
await prisma.timeSlot.createMany({
  data: [
    // Library 1
    {
      id: 'ts-1',
      startTime: '08:00',
      endTime: '14:00', // 6 hours
      date: new Date(),
      capacity: 20,
      bookedCount: 5,
      status: 'AVAILABLE',
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-2',
      startTime: '14:00',
      endTime: '22:00', // 8 hours
      date: new Date(),
      capacity: 25,
      bookedCount: 20,
      status: 'BOOKED',
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-3',
      startTime: '08:00',
      endTime: '20:00', // 12 hours
      date: new Date(),
      capacity: 30,
      bookedCount: 10,
      status: 'AVAILABLE',
      libraryId: 'library-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Library 2
    {
      id: 'ts-4',
      startTime: '07:00',
      endTime: '13:00', // 6 hours
      date: new Date(),
      capacity: 15,
      bookedCount: 5,
      status: 'AVAILABLE',
      libraryId: 'library-2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-5',
      startTime: '13:00',
      endTime: '21:00', // 8 hours
      date: new Date(),
      capacity: 18,
      bookedCount: 18,
      status: 'BOOKED',
      libraryId: 'library-2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-6',
      startTime: '08:00',
      endTime: '20:00', // 12 hours
      date: new Date(),
      capacity: 28,
      bookedCount: 12,
      status: 'AVAILABLE',
      libraryId: 'library-2',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Library 3
    {
      id: 'ts-7',
      startTime: '09:00',
      endTime: '17:00', // 8 hours
      date: new Date(),
      capacity: 20,
      bookedCount: 10,
      status: 'AVAILABLE',
      libraryId: 'library-3',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-8',
      startTime: '17:00',
      endTime: '23:00', // 6 hours
      date: new Date(),
      capacity: 15,
      bookedCount: 15,
      status: 'BOOKED',
      libraryId: 'library-3',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Library 4
    {
      id: 'ts-9',
      startTime: '06:00',
      endTime: '14:00', // 8 hours
      date: new Date(),
      capacity: 22,
      bookedCount: 8,
      status: 'AVAILABLE',
      libraryId: 'library-4',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-10',
      startTime: '14:00',
      endTime: '20:00', // 6 hours
      date: new Date(),
      capacity: 18,
      bookedCount: 18,
      status: 'BOOKED',
      libraryId: 'library-4',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Library 5
    {
      id: 'ts-11',
      startTime: '08:00',
      endTime: '20:00', // 12 hours
      date: new Date(),
      capacity: 25,
      bookedCount: 15,
      status: 'AVAILABLE',
      libraryId: 'library-5',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ts-12',
      startTime: '20:00',
      endTime: '02:00', // 6 hours overnight
      date: new Date(),
      capacity: 12,
      bookedCount: 12,
      status: 'BOOKED',
      libraryId: 'library-5',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
});

console.log("✅ Seeded custom time slots for all libraries");

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