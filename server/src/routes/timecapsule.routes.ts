import express from "express";
import { upload } from "../services/multer";
import {
  addContributors,
  addRecepients,
  createCapsule,
  getCreatedCapsules,
} from "../controllers/timecapsule.controller";
import { authenticate } from "../middleware/authenticated";

const router = express.Router();

router.post("/create", authenticate, upload.array("media", 10), createCapsule);
router.post("/add-contributors", authenticate, addContributors);
router.post("/add-recipients", authenticate, addRecepients);
router.get("/get-all", authenticate, getCreatedCapsules);

export { router as timeCapsuleRoutes };
