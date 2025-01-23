import express from "express";
import { upload } from "../services/multer";
import {
  addContributors,
  addMedia,
  addRecepients,
  createCapsule,
  getCapsule,
  getCreatedCapsules,
  getReceivedCapsules,
  lockCapsule,
  updateCapsule,
} from "../controllers/timecapsule.controller";
import { authenticate } from "../middleware/authenticated";

const router = express.Router();

router.post("/create", authenticate, upload.array("media", 10), createCapsule);
router.post("/add-contributors", authenticate, addContributors);
router.post("/add-recipients", authenticate, addRecepients);
router.get("/get-all", authenticate, getCreatedCapsules);
router.post("/lock-capsule", authenticate, lockCapsule);
router.get("/get-received", authenticate, getReceivedCapsules);
router.get("/get/:id", authenticate, getCapsule);
router.patch("/update", authenticate, updateCapsule);
router.patch("/add-media", authenticate, upload.array("media", 10), addMedia);

export { router as timeCapsuleRoutes };
