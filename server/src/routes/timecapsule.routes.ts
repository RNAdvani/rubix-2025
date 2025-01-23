import express from "express";
import { upload } from "../services/multer";
import {
   createCapsule,
   getCreatedCapsules,
} from "../controllers/timecapsule.controller";
import { authenticate } from "../middleware/authenticated";

const router = express.Router();

router.post("/create", authenticate, upload.array("media", 10), createCapsule);
router.get("/get-created", authenticate, getCreatedCapsules);

export { router as timeCapsuleRoutes };
