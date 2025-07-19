import { Router } from 'express';
import {
  createReview,
  getReviewsByLibrary,
  getReviewsByStudent
} from '../controllers/reviewController';

const router = Router();

router.post('/', createReview);
router.get('/library/:libraryId', getReviewsByLibrary);
router.get('/student/:studentId', getReviewsByStudent);

export default router;
