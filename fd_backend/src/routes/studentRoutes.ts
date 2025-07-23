import express from "express";
import { createStudent, getStudentByCognitoId } from '../controllers/studentControllers';

const router = express.Router();

router.post('/', createStudent);
router.get('/:cognitoId', getStudentByCognitoId);

export default router;