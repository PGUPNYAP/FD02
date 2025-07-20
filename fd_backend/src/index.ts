import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import libraryRouter from './routes/libraryRoutes';
import librarianRoute from './routes/librarianRoutes';
import libraryBookingRoutes from './routes/libraryBookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import timeSlotRoutes from './routes/timeSlotRoutes';

dotenv.config();

const app = express();

// CORS configuration - IMPORTANT for React Native
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan("combined")); // More detailed logging

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  console.log('✅ Health check endpoint hit');
  res.json({ 
    message: 'Focus Desk Backend Running',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3001
  });
});

// API Routes with logging
app.use('/api/library', (req, res, next) => {
  console.log(`📚 Library API: ${req.method} ${req.path}`);
  next();
}, libraryRouter);

app.use('/api/librarians', (req, res, next) => {
  console.log(`👨‍💼 Librarian API: ${req.method} ${req.path}`);
  next();
}, librarianRoute);

app.use('/api/bookings', (req, res, next) => {
  console.log(`📅 Booking API: ${req.method} ${req.path}`, req.body);
  next();
}, libraryBookingRoutes);

app.use('/api/reviews', (req, res, next) => {
  console.log(`⭐ Review API: ${req.method} ${req.path}`, req.body);
  next();
}, reviewRoutes);

app.use('/api/timeslots', (req, res, next) => {
  console.log(`⏰ TimeSlot API: ${req.method} ${req.path}`);
  next();
}, timeSlotRoutes);

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: [
      'GET /',
      'GET /api/library/getLocations',
      'GET /api/library',
      'POST /api/bookings',
      'POST /api/reviews'
    ]
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🔥 Server Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}`);
  console.log(`📚 Library API: http://localhost:${PORT}/api/library`);
  console.log(`📅 Booking API: http://localhost:${PORT}/api/bookings`);
  console.log(`⭐ Review API: http://localhost:${PORT}/api/reviews`);
});