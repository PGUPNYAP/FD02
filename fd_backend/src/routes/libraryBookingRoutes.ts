import { Router } from 'express';
import {
  createSeatBooking,
  cancelSeatBooking,
  getAvailableSeats,
  getSeatBookingById,
  updateSeatBookingStatus
} from '../controllers/libraryBookingController';

const router = Router();

// Create a new seat booking
router.post('/', createSeatBooking);

// Cancel a booking
router.delete('/:id', cancelSeatBooking);

// Get available seats for a library on a given date and time slot
router.get('/available', getAvailableSeats);

// Get a booking by ID
router.get('/:id', getSeatBookingById);

// Update booking status (e.g., COMPLETE, CANCELLED)
router.patch('/:id/status', updateSeatBookingStatus);

export default router;
