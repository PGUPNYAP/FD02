import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import { encrypt } from "../utils/encryption";

const prisma = new PrismaClient();
export const upload = multer({ storage: multer.memoryStorage() });

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const BUCKET = process.env.AWS_S3_BUCKET!;

export const onboardLibrarian = async (req: Request, res: Response) => {
  try {
    const {
      cognitoId, email, username,
      firstName, lastName, profilePhoto,
      contactNumber, alternateContactNumber,
      dateOfBirth, address, city, state, pincode, country,
      bankAccountNumber, bankIfsc, bankName, accountHolderName,
      panNumber, gstin, aadhaarNumber, addressProofType, addressProofUrl
    } = req.body;

    // Basic validation
    if (!cognitoId || !email || !username) {
      return res.status(400).json({ error: "cognitoId, email, and username are required." });
    }

    // Encrypt bank details if provided
    const encryptedBankAccountNumber = bankAccountNumber ? encrypt(bankAccountNumber) : undefined;
    const encryptedBankIfsc = bankIfsc ? encrypt(bankIfsc) : undefined;
    const encryptedBankName = bankName ? encrypt(bankName) : undefined;
    const encryptedAccountHolderName = accountHolderName ? encrypt(accountHolderName) : undefined;
    const encryptedPanNumber = panNumber ? encrypt(panNumber) : undefined;
    const encryptedGstin = gstin ? encrypt(gstin) : undefined;
    const encryptedAadhaarNumber = aadhaarNumber ? encrypt(aadhaarNumber) : undefined;

    const librarian = await prisma.librarian.upsert({
      where: { cognitoId },
      update: {
        email,
        username,
        firstName,
        lastName,
        profilePhoto,
        contactNumber,
        alternateContactNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address,
        city,
        state,
        pincode,
        country,

        // Encrypted bank/KYC data
        bankAccountNumber: encryptedBankAccountNumber,
        bankIfsc: encryptedBankIfsc,
        bankName: encryptedBankName,
        accountHolderName: encryptedAccountHolderName,
        panNumber: encryptedPanNumber,
        gstin: encryptedGstin,
        aadhaarNumber: encryptedAadhaarNumber,
        addressProofType,
        addressProofUrl,
        profileCompleted: true // Set based on logic if all required fields present
      },
      create: {
        cognitoId,
        email,
        username,
        firstName,
        lastName,
        profilePhoto,
        contactNumber,
        alternateContactNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address,
        city,
        state,
        pincode,
        country,
        bankAccountNumber: encryptedBankAccountNumber,
        bankIfsc: encryptedBankIfsc,
        bankName: encryptedBankName,
        accountHolderName: encryptedAccountHolderName,
        panNumber: encryptedPanNumber,
        gstin: encryptedGstin,
        aadhaarNumber: encryptedAadhaarNumber,
        addressProofType,
        addressProofUrl,
        profileCompleted: true
      }
    });

    // Only return fields safe for response (do NOT return full bank details)
    res.json({
      message: "Onboarding completed",
      id: librarian.id,
      firstName: librarian.firstName,
      lastName: librarian.lastName,
      email: librarian.email,
      profileCompleted: librarian.profileCompleted
    });
  } catch (error: any) {
    res.status(500).json({ error: "Onboarding failed.", details: error.message || error });
  }
};

// POST / (Onboard librarian with profile photo)
// POST / (Onboard librarian with profile photo)
// export const onboardLibrarian = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { contactNumber, address } = req.body;
//   const cognitoId = req.body.cognitoId || req.user?.id; // Adjust as needed for your auth

//   if (!cognitoId || !contactNumber || !address) {
//     res.status(400).json({ message: "Missing required fields" });
//     return;
//   }

//   try {
//     // Check if librarian exists
//     const existingLibrarian = await prisma.librarian.findUnique({
//       where: { cognitoId },
//     });

//     if (!existingLibrarian) {
//       res.status(409).json({ message: "Librarian doesn't exist" });
//       return;
//     }

//     // Handle profile photo upload to S3
//     let profilePhotoUrl: string | undefined = undefined;
//     if (req.file) {
//       const fileExt = path.extname(req.file.originalname);
//       const key = `librarians/${cognitoId}/${uuidv4()}${fileExt}`;
//       await s3.send(
//         new PutObjectCommand({
//           Bucket: BUCKET,
//           Key: key,
//           Body: req.file.buffer,
//           ContentType: req.file.mimetype,
//         })
//       );
//       profilePhotoUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
//     }

//     // Create librarian
//     const newLibrarian = await prisma.librarian.update({
//       where: { cognitoId },
//       data: {
//         contactNumber,
//         address,
//         profilePhoto: profilePhotoUrl,
//         profileCompleted: true, // Assuming onboarding completes the profile
//       },
//     });

//     res
//       .status(201)
//       .json({
//         message: "Librarian onboarded successfully",
//         librarian: newLibrarian,
//       });
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error onboarding librarian: ${error.message}` });
//   }
// };
// GET /:cognitoId
export const getLibrarian = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId } = req.params;

  try {
    const librarian = await prisma.librarian.findUnique({
      where: { cognitoId },
    });

    if (!librarian) {
      res.status(404).json({ message: "Librarian not found" });
      return;
    }

    res.status(200).json(librarian);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving librarian: ${error.message}` });
  }
};

// POST /
export const createLibrarian = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId, username, email } = req.body;
  console.log("reached createLibrarian", req.body);

  if (!username || !email) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const existingLibrarian = await prisma.librarian.findUnique({
      where: { cognitoId },
    });

    if (existingLibrarian) {
      res.status(409).json({ message: "Librarian already exists" });
      return;
    }

    const newLibrarian = await prisma.librarian.create({
      data: { cognitoId, username, email },
    });

    res
      .status(201)
      .json({
        message: "Librarian created successfully",
        librarian: newLibrarian,
      });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating librarian: ${error.message}` });
  }
};

// PUT /:cognitoId
export const updateLibrarian = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId } = req.params;
  const updates = req.body;

  try {
    const librarian = await prisma.librarian.findUnique({
      where: { cognitoId },
    });

    if (!librarian) {
      res.status(404).json({ message: "Librarian not found" });
      return;
    }

    const updatedLibrarian = await prisma.librarian.update({
      where: { cognitoId },
      data: updates,
    });

    res
      .status(200)
      .json({
        message: "Librarian updated successfully",
        librarian: updatedLibrarian,
      });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating librarian: ${error.message}` });
  }
};

// GET /librarians/:id/profile-completed
export const checkLibrarianProfileCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const librarian = await prisma.librarian.findUnique({
      where: { cognitoId: id },
      select: { profileCompleted: true },
    });

    if (!librarian) {
      res.status(404).json({ message: "Librarian not found" });
      return;
    }

    res.status(200).json({ profileCompleted: librarian.profileCompleted });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error checking profile status: ${error.message}` });
  }
};

// export const onboardLibrarian = [
//   upload.single("profilePhoto"),
//   async (req: Request, res: Response): Promise<void> => {
//     const { cognitoId } = req.params;
//     // all other text fields come in req.body
//     // if you passed a JSON string you can parse it; otherwise they're flat
//     const updates = { ...req.body } as Record<string, any>;

//     try {
//       // ensure the librarian exists
//       const existing = await prisma.librarian.findUnique({
//         where: { cognitoId },
//       });
//       if (!existing) {
//         res.status(404).json({ message: "Librarian not found" });
//         return;
//       }

//       // handle the photo upload
//       if (req.file) {
//         const fileExt = req.file.originalname.split(".").pop();
//         const fileName = `${cognitoId}-${Date.now()}.${fileExt}`;
//         const filePath = `librarians/${fileName}`;

//         // upload buffer to Supabase
//         const { error: uploadError } = await supabase.storage
//           .from("librarian-profilephoto")
//           .upload(filePath, req.file.buffer, {
//             upsert: true,
//             contentType: req.file.mimetype,
//           });
//         if (uploadError) throw uploadError;

//         // get public URL
//         const {
//           data: { publicUrl },
//         } = supabase.storage
//           .from("librarian-profilephoto")
//           .getPublicUrl(filePath);

//         updates.profilePhoto = publicUrl;
//       }

//       // mark profile as completed
//       updates.profileCompleted = true;

//       // perform the Prisma update
//       const updated = await prisma.librarian.update({
//         where: { cognitoId },
//         data: updates,
//       });

//       res
//         .status(200)
//         .json({ message: "Onboarding successful", librarian: updated });
//     } catch (err: any) {
//       console.error("Onboard error:", err);
//       res.status(500).json({
//         message: "Failed to complete onboarding",
//         error: err.message,
//       });
//     }
//   },
// ];
