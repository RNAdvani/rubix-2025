import express from "express";
import {
  loginUser,
  registerUser,
  searchUserFromUsernameOrEmail,
  signInWithGoogle,
  updateUsername,
  updateUserNumber,
  verifyUser,
} from "../controllers/user.controller";
import { authenticate } from "../middleware/authenticated";

const router = express.Router();

router.post("/sign-up", registerUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/google-login", signInWithGoogle);
router.post("/username", authenticate, updateUsername);
router.get("/search", searchUserFromUsernameOrEmail);

export { router as userRoutes };
