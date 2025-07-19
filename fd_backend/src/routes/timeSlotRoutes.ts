import { Router } from 'express';
import {
  getAvailableTimeSlots,
  getTimeSlotById,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot
} from '../controllers/timeSlotController';

const router = Router();

// GET /timeslots/available?libraryId=&date= → get available time slots for a library on specific date
router.get('/available', getAvailableTimeSlots);

// GET /timeslots/:id → get specific time slot details
router.get('/:id', getTimeSlotById);

// POST /timeslots → create new time slot (librarian only)
router.post('/', createTimeSlot);

// PUT /timeslots/:id → update time slot (librarian only)
router.put('/:id', updateTimeSlot);

// DELETE /timeslots/:id → delete time slot (librarian only)
router.delete('/:id', deleteTimeSlot);

export default router;
