import express from "express";
import {
   loginUser,
   registerUser,
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
router.post("/username", updateUsername);

export { router as userRoutes };
