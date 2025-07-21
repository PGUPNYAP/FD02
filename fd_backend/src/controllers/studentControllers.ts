import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
 export const createStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId, username, email } = req.body;
  console.log("reached createStudent", req.body);

  if (!username || !email) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const existingStudent = await prisma.student.findUnique({
      where: { cognitoId },
    });

    if (existingStudent) {
      res.status(409).json({ message: "Student already exists" });
      return;
    }

    const newStudent = await prisma.student.create({
      data: { cognitoId, username, email },
    });

    res
      .status(201)
      .json({
        message: "Student created successfully",
        student: newStudent,
      });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating student: ${error.message}` });
  }
};
