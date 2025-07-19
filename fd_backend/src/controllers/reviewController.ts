import { Request, Response } from 'express';
import { PrismaClient, ReviewStatus } from '@prisma/client';

const prisma = new PrismaClient();

// POST /reviews
export const createReview = async (req: Request, res: Response) => {
  try {
    const { studentId, libraryId, stars, comment } = req.body;
    if (!studentId || !libraryId || !stars) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (stars < 1 || stars > 5) {
      return res.status(400).json({ success: false, message: 'Stars must be between 1 and 5' });
    }

    const review = await prisma.review.create({
      data: { studentId, libraryId, stars, comment, status: ReviewStatus.PENDING }
    });

    return res.status(201).json({ success: true, data: review, message: 'Review submitted' });
  } catch (error: any) {
    console.error('createReview error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
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
