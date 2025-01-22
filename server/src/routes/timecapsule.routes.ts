import express from "express";
import { upload } from "../services/multer";
import { createCapsule } from "../controllers/timecapsule.controller";
import { authenticate } from "../middleware/authenticated";

const router = express.Router();

router.post("/create", authenticate, upload.array("media", 10), createCapsule);

export { router as timeCapsuleRoutes };
