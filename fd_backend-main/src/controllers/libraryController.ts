// controllers/library.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
