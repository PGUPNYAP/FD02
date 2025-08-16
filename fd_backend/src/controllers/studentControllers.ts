import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// GET /students/:cognitoId
export const getStudentByCognitoId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId } = req.params;
  console.log("🔍 Fetching student by cognitoId:", cognitoId);

  try {
    const student = await prisma.student.findUnique({
      where: { cognitoId },
      select: {
        id: true,
        cognitoId: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        isActive: true,
        createdAt: true
      }
    });

    if (!student) {
      console.error("❌ Student not found for cognitoId:", cognitoId);
      res.status(404).json({ message: "Student not found" });
      return;
    }

    console.log("✅ Student found:", student.username);
    res.status(200).json(student);
  } catch (error: any) {
    console.error("❌ Error fetching student:", error);
    res.status(500).json({ message: `Error retrieving student: ${error.message}` });
  }
};

 export const createStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {cognitoId,username,email,firstName,lastName,phoneNumber} = req.body;
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
      console.log("✅ Student already exists:", existingStudent.username);
      res.status(409).json({ message: "Student already exists" });
      return;
    }

    const newStudent = await prisma.student.create({
      data: {cognitoId,username, email, firstName, lastName, phoneNumber},
    });

    console.log("✅ Student created successfully:", newStudent.username);
    res
      .status(201)
      .json({
        message: "Student created successfully",
        student: newStudent,
      });
  } catch (error: any) {
    console.error("❌ Error creating student:", error);
    res
      .status(500)
      .json({ message: `Error creating student: ${error.message}` });
  }
};


export const getStudentByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.params;
  console.log("🔍 Fetching student by email:", email);

  try {
    const student = await prisma.student.findUnique({
      where: { email },
      select: {
        id: true,
        cognitoId: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        isActive: true,
        createdAt: true
      }
    });

    if (!student) {
      console.error("❌ Student not found for email:", email);
      res.status(404).json({ message: "Student not found" });
      return;
    }

    console.log("✅ Student found:", student);
    res.status(200).json(student);
  } catch (error: any) {
    console.error("❌ Error fetching student:", error);
    res.status(500).json({ message: `Error retrieving student: ${error.message}` });
  }
};