import express from "express";
import {
  createLibrarian,
  getLibrarian,
  updateLibrarian,
  checkLibrarianProfileCompleted,
  upload,
  onboardLibrarian,
} from "../controllers/librarianControllers";
import { authMiddleware } from "../middlewares/middleware";

const router = express.Router();

router.post("/", createLibrarian);
router.post("/onboarding",onboardLibrarian);
router.get("/:cognitoId", getLibrarian);
router.put("/:cognitoId", updateLibrarian);
router.get("/:id/profile-completed", checkLibrarianProfileCompleted); 
// router.post(
//   "/onboard",
//   authMiddleware(["librarian"]),     // optional: if using auth
//   upload.single("profilePhoto"),     // multer middleware to handle file upload
//   onboardLibrarian                   // controller
// );
export default router;
