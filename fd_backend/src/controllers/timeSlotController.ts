import { Request, Response } from 'express';
import { PrismaClient, TimeSlotStatus } from '@prisma/client';

const prisma = new PrismaClient();

// GET /timeslots/available?libraryId=&date=
export const getAvailableTimeSlots = async (req: Request, res: Response) => {
  try {
    const { libraryId, date } = req.query;

    if (!libraryId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Library ID and date are required'
      });
    }

    const requestedDate = new Date(date as string);
    
    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requestedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot select time slots for past dates'
      });
    }

    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        libraryId: String(libraryId),
        date: requestedDate,
        status: TimeSlotStatus.AVAILABLE
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        date: true,
        capacity: true,
        bookedCount: true,
        status: true,
        library: {
          select: {
            id: true,
            libraryName: true,
            openingTime: true,
            closingTime: true
          }
        }
      },
      orderBy: { startTime: 'asc' }
    });

    // Calculate available spots for each slot
    const slotsWithAvailability = timeSlots.map(slot => ({
      ...slot,
      availableSpots: slot.capacity - slot.bookedCount,
      isBookable: (slot.capacity - slot.bookedCount) > 0
    }));

    return res.json({
      success: true,
      data: {
        date: requestedDate,
        timeSlots: slotsWithAvailability,
        totalSlots: slotsWithAvailability.length
      },
      message: 'Available time slots retrieved successfully'
    });

  } catch (error) {
    console.error('Error in getAvailableTimeSlots:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /timeslots/:id
export const getTimeSlotById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id },
      include: {
        library: {
          select: {
            id: true,
            libraryName: true,
            address: true,
            city: true
          }
        },
        bookings: {
          select: {
            id: true,
            student: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      }
    });

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found'
      });
    }

    const slotWithAvailability = {
      ...timeSlot,
      availableSpots: timeSlot.capacity - timeSlot.bookedCount,
      isBookable: (timeSlot.capacity - timeSlot.bookedCount) > 0
    };

    return res.json({
      success: true,
      data: slotWithAvailability,
      message: 'Time slot retrieved successfully'
    });

  } catch (error) {
    console.error('Error in getTimeSlotById:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /timeslots (Create new time slot - for librarians)
export const createTimeSlot = async (req: Request, res: Response) => {
  try {
    const { libraryId, startTime, endTime, date, capacity } = req.body;

    // Validation
    if (!libraryId || !startTime || !endTime || !date || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Use HH:MM format'
      });
    }

    // Validate start time is before end time
    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: 'Start time must be before end time'
      });
    }

    // Check if library exists
    const library = await prisma.library.findUnique({
      where: { id: libraryId }
    });

    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    // Check for overlapping time slots
    const overlapping = await prisma.timeSlot.findFirst({
      where: {
        libraryId,
        date: new Date(date),
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          }
        ]
      }
    });

    if (overlapping) {
      return res.status(409).json({
        success: false,
        message: 'Time slot overlaps with existing slot'
      });
    }

    const timeSlot = await prisma.timeSlot.create({
      data: {
        libraryId,
        startTime,
        endTime,
        date: new Date(date),
        capacity: parseInt(capacity),
        bookedCount: 0,
        status: TimeSlotStatus.AVAILABLE
      },
      include: {
        library: {
          select: { libraryName: true }
        }
      }
    });

    return res.status(201).json({
      success: true,
      data: timeSlot,
      message: 'Time slot created successfully'
    });

  } catch (error) {
    console.error('Error in createTimeSlot:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// PUT /timeslots/:id (Update time slot - for librarians)
export const updateTimeSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, capacity, status } = req.body;

    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id }
    });

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found'
      });
    }

    // Prevent updating if there are active bookings
    if (timeSlot.bookedCount > 0 && (startTime || endTime)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify time when slot has bookings'
      });
    }

    const updatedTimeSlot = await prisma.timeSlot.update({
      where: { id },
      data: {
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(capacity && { capacity: parseInt(capacity) }),
        ...(status && { status })
      },
      include: {
        library: {
          select: { libraryName: true }
        }
      }
    });

    return res.json({
      success: true,
      data: updatedTimeSlot,
      message: 'Time slot updated successfully'
    });

  } catch (error) {
    console.error('Error in updateTimeSlot:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// DELETE /timeslots/:id (Delete time slot - for librarians)
export const deleteTimeSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id }
    });

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found'
      });
    }

    // Prevent deletion if there are active bookings
    if (timeSlot.bookedCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete time slot with active bookings'
      });
    }

    await prisma.timeSlot.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Time slot deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteTimeSlot:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const getTimeSlotsByLibraryId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const timeSlots = await prisma.timeSlot.findMany({
      where: { id },
      include: {
        library: {
          select: {
            id: true,
            libraryName: true,
            address: true,
            city: true
          }
        },
        bookings: {
          select: {
            id: true,
            student: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: {
        startTime: 'asc'  // Optional: order by start time
      }
    });

    if (!timeSlots || timeSlots.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No time slots found for this library'
      });
    }

    const slotsWithAvailability = timeSlots.map(timeSlot => ({
      ...timeSlot,
      availableSpots: timeSlot.capacity - timeSlot.bookedCount,
      isBookable: (timeSlot.capacity - timeSlot.bookedCount) > 0
    }));

    return res.json({
      success: true,
      data: slotsWithAvailability,
      message: 'Time slots retrieved successfully',
      count: slotsWithAvailability.length
    });

  } catch (error) {
    console.error('Error in getTimeSlotsByLibraryId:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};