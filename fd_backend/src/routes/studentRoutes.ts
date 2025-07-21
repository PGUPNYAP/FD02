import express from "express";
import { createStudent } from '../controllers/studentControllers';

const router = express.Router();

router.post('/', createStudent);

export default router;