// import { Request, Response, NextFunction } from 'express';
// import { PrismaClient } from '@prisma/client';
// // import { createStudentSchema } from '../validators/student.validator';


// const prisma = new PrismaClient();

// // export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
// //   try {
// //     const result = createStudentSchema.safeParse(req.body);
// //     if (!result.success) {
// //       return res.status(400).json({ error: result.error.flatten() });
// //     }

// //     const { username, email, contactNumber } = result.data;

// //     const newStudent = await prisma.student.create({
// //       data: {
// //         clerkUserId: req.auth.userId,
// //         username,
// //         email,
// //         contactNumber,
// //         librarianId: 'some-librarian-id', // replace later
// //       },
// //     });

// //     res.status(201).json(newStudent);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// export const getStudents = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const students = await prisma.student.findMany();
//     res.json(students);
//   } catch (error) {
//     next(error);
//   }
// };
