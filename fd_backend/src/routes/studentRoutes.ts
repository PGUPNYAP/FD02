import express from "express";
import { createStudent,
     getStudentByCognitoId,
     getStudentByEmail
    } from '../controllers/studentControllers';

const router = express.Router();

router.post('/createStudent', createStudent);
router.get('/:cognitoId', getStudentByCognitoId);
router.get('/studentData/:email', getStudentByEmail);

export default router;