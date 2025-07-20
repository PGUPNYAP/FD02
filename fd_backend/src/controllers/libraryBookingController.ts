import { Request, Response } from 'express';
import { PrismaClient, BookingStatus, SeatStatus, TimeSlotStatus } from '@prisma/client';

const prisma = new PrismaClient();

// POST /bookings
export const createSeatBooking = async (req: Request, res: Response) => {
  try {
    const { studentId, libraryId, planId, timeSlotId, seatId, totalAmount } = req.body;

    console.log('Creating booking with data:', { studentId, libraryId, planId, timeSlotId, seatId, totalAmount });

    // Basic validation
    if (!studentId || !libraryId || !planId || !timeSlotId || !seatId || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if student exists
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Check if library exists
    const library = await prisma.library.findUnique({ where: { id: libraryId } });
    if (!library) {
      return res.status(404).json({ success: false, message: 'Library not found' });
    }

    // Check if plan exists
    const plan = await prisma.libraryPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    // Check time slot capacity
    const slot = await prisma.timeSlot.findUnique({ where: { id: timeSlotId } });
    if (!slot || slot.status !== TimeSlotStatus.AVAILABLE || slot.bookedCount >= slot.capacity) {
      return res.status(409).json({ success: false, message: 'Time slot not available' });
    }

    // Check seat availability
    const seat = await prisma.seat.findUnique({ where: { id: seatId } });
    if (!seat) {
      // If seat doesn't exist, create it dynamically
      const newSeat = await prisma.seat.create({
        data: {
          id: seatId,
          seatNumber: seatId.replace('seat_', '').replace(/_/g, ' '),
          status: SeatStatus.AVAILABLE,
          libraryId: libraryId,
        }
      });
      console.log('Created new seat:', newSeat);
    } else if (seat.status !== SeatStatus.AVAILABLE) {
      return res.status(409).json({ success: false, message: 'Seat not available' });
    }

    // Calculate valid dates based on plan
    const validFrom = new Date();
    const validTo = new Date();
    validTo.setDate(validTo.getDate() + plan.days);

    // Transactional booking
    const booking = await prisma.$transaction(async tx => {
      // Create booking record
      const newBooking = await tx.booking.create({
        data: {
          studentId,
          libraryId,
          planId,
          timeSlotId,
          seatId,
          validFrom,
          validTo,
          totalAmount,
          status: BookingStatus.ACTIVE
        },
        include: {
          student: { select: { id: true, firstName: true, email: true } },
          seat: { select: { id: true, seatNumber: true } },
          timeSlot: { select: { id: true, startTime: true, endTime: true, date: true } }
        }
      });

      // Get the new booked count after increment
      const bookingCount = await tx.booking.count({ where: { timeSlotId } });
      const newBookedCount = bookingCount;
      const newStatus = newBookedCount >= slot.capacity ? TimeSlotStatus.BOOKED : TimeSlotStatus.AVAILABLE;

      // Increment booked count on time slot and update status
      await tx.timeSlot.update({
        where: { id: timeSlotId },
        data: { bookedCount: { increment: 1 }, status: newStatus }
      });

      // Mark seat as reserved
      await tx.seat.update({
        where: { id: seatId },
        data: { status: SeatStatus.RESERVED }
      });

      return newBooking;
    });

    console.log('Booking created successfully:', booking);
    return res.status(201).json({ success: true, data: booking, message: 'Seat booked successfully' });
  } catch (error: any) {
    console.error('createSeatBooking error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// DELETE /bookings/:id
export const cancelSeatBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === BookingStatus.CANCELLED) {
      return res.status(400).json({ success: false, message: 'Already cancelled' });
    }

    await prisma.$transaction(async tx => {
      // Update booking status
      await tx.booking.update({ where: { id }, data: { status: BookingStatus.CANCELLED } });

      // Decrement slot bookedCount
      const slot = await tx.timeSlot.findUnique({ where: { id: booking.timeSlotId } });
      if (slot) {
        await tx.timeSlot.update({
          where: { id: slot.id },
          data: {
            bookedCount: { decrement: 1 },
            status: TimeSlotStatus.AVAILABLE
          }
        });
      }

      // Mark seat available
      await tx.seat.update({
        where: { id: booking.seatId },
        data: { status: SeatStatus.AVAILABLE }
      });
    });

    return res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error: any) {
    console.error('cancelSeatBooking error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /bookings/available?libraryId=&date=&startTime=&endTime=
export const getAvailableSeats = async (req: Request, res: Response) => {
  try {
    const { libraryId, date, startTime, endTime } = req.query;
    if (!libraryId || !date || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Missing query parameters' });
    }

    // Find matching time slot
    const slot = await prisma.timeSlot.findFirst({
      where: {
        libraryId: String(libraryId),
        date: new Date(String(date)),
        startTime: String(startTime),
        endTime: String(endTime),
        status: TimeSlotStatus.AVAILABLE
      }
    });
    if (!slot) return res.status(404).json({ success: false, message: 'Time slot not found' });

    // Fetch all seats not booked for this slot
    const bookedSeatIds = await prisma.booking.findMany({
      where: { timeSlotId: slot.id },
      select: { seatId: true }
    }).then(rows => rows.map(r => r.seatId));

    const seats = await prisma.seat.findMany({
      where: {
        libraryId: String(libraryId),
        status: SeatStatus.AVAILABLE,
        id: { notIn: bookedSeatIds }
      },
      orderBy: { seatNumber: 'asc' }
    });

    return res.json({ success: true, data: seats, message: 'Available seats retrieved' });
  } catch (error: any) {
    console.error('getAvailableSeats error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /bookings/:id
export const getSeatBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, firstName: true, email: true } },
        library: { select: { id: true, libraryName: true } },
        seat: { select: { id: true, seatNumber: true } },
        timeSlot: { select: { id: true, date: true, startTime: true, endTime: true } }
      }
    });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    return res.json({ success: true, data: booking, message: 'Booking retrieved' });
  } catch (error: any) {
    console.error('getSeatBookingById error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// PATCH /bookings/:id/status
export const updateSeatBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ['ACTIVE','COMPLETED','CANCELLED','EXPIRED'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { student: true, seat: true, timeSlot: true }
    });
    return res.json({ success: true, data: booking, message: 'Status updated' });
  } catch (error: any) {
    console.error('updateSeatBookingStatus error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
