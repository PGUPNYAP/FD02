import { Request, Response } from 'express';
import { PrismaClient, ReviewStatus } from '@prisma/client';

const prisma = new PrismaClient();

// POST /reviews
export const createReview = async (req: Request, res: Response) => {
  try {
    const { studentId, libraryId, stars, comment } = req.body;
    
    console.log('Creating review with data:', { studentId, libraryId, stars, comment });
    
    if (!studentId || !libraryId || !stars) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (stars < 1 || stars > 5) {
      return res.status(400).json({ success: false, message: 'Stars must be between 1 and 5' });
    }

    // Check if student and library exist
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const library = await prisma.library.findUnique({ where: { id: libraryId } });
    if (!library) {
      return res.status(404).json({ success: false, message: 'Library not found' });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        studentId_libraryId: {
          studentId,
          libraryId
        }
      }
    });

    if (existingReview) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this library' });
    }

    const review = await prisma.review.create({
      data: { studentId, libraryId, stars, comment, status: ReviewStatus.PENDING }
    });

    console.log('Review created successfully:', review);
    return res.status(201).json({ success: true, data: review, message: 'Review submitted' });
  } catch (error: any) {
    console.error('createReview error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// GET /reviews/library/:libraryId
export const getReviewsByLibrary = async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { libraryId, status: ReviewStatus.APPROVED },
      include: { student: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, data: reviews });
  } catch (error: any) {
    console.error('getReviewsByLibrary error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /reviews/student/:studentId
export const getReviewsByStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { studentId },
      include: { library: { select: { id: true, libraryName: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, data: reviews });
  } catch (error: any) {
    console.error('getReviewsByStudent error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
