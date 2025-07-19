// controllers/library.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { encrypt } from "../utils/encryption";

const prisma = new PrismaClient();

export const createLibrarian = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoId, username, email } = req.body;

  if (!cognitoId || !username || !email) {
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

// GET /library?city=&state=&country=&libraryName=&page=&limit=&sortField=&sortOrder=
export const getLibraries = async (req: Request, res: Response) => {
  try {
    // Extract query params
    const { city, state, country, libraryName, page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build Prisma 'where' filter
    const where: any = {};
    if (city) where.city = String(city);
    if (state) where.state = String(state);
    if (country) where.country = String(country);
    if (libraryName) where.libraryName = { contains: String(libraryName), mode: 'insensitive' };

    const skip = (Number(page) - 1) * Number(limit);

    // Prisma query
    const [libraries, total] = await Promise.all([
      prisma.library.findMany({
        where,
        take: Number(limit),
        skip,
        orderBy: { [String(sortField)]: sortOrder === 'asc' ? 'asc' : 'desc' },
        include: {
          librarian: { select: { id: true, firstName: true, lastName: true } },
          plans: true,
          reviews: true
        }
      }),
      prisma.library.count({ where })
    ]);

    res.json({
      data: libraries,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch libraries", details: error });
  }
};

// GET /library/:id
export const getLibraryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const library = await prisma.library.findUnique({
      where: { id },
      include: {
        librarian: { select: { id: true, firstName: true, lastName: true } },
        plans: true,
        reviews: true,
        seats: true,
        timeSlots: true,
        faqs: true,
        socialLinks: true
      }
    });

    if (!library) {
      return res.status(404).json({ error: "Library not found" });
    }

    res.json(library);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch library", details: error });
  }
};

export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await prisma.library.findMany({
      select: {
        area: true,
        city: true,
        state: true,
        country: true
      },
      distinct: ['area','city', 'state', 'country']
    });

    const formattedLocations = locations.map((loc: { area: string | null, city: string | null, state: string | null, country: string | null }) => ({
      city: loc.city,
      state: loc.state,
      country: loc.country
    }));

    res.json(formattedLocations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch locations", details: error });
  }
}

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


