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
import { authMiddleware } from './middlewares/middleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Focus Desk Backend Running' });
});

// Routes
// app.use('/api/students', studentRoutes);
app.use('/api/library', libraryRouter);
app.use("/api/librarians", 
    // authMiddleware(["librarian"]),
    librarianRoute);
app.use('/api/bookings', libraryBookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/timeslots', timeSlotRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
