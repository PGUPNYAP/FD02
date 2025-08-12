// routes/library.routes.ts
import { Router } from "express";
import { getLibraries, getLibraryById, getLocations, onboardLibrarian, getSeatsByLibraryId } from "../controllers/libraryController";

const router = Router();

router.get("/", getLibraries);      // GET all with filters, pagination
router.get("/getLocations", getLocations); // GET all locations
router.post("/onboarding",onboardLibrarian)
router.get("/:id", getLibraryById); // GET specific by ID
router.get("/libraries/:id",getSeatsByLibraryId);

export default router;
