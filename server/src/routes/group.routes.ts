// routes/group.routes.ts
import { Router } from "express";
import {
  createGroup,
  deleteGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
} from "../controllers/group.controller";

const router = Router();

// Define routes
router.post("/", createGroup);
router.get("/", getAllGroups);
router.get("/:id", getGroupById);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);

export default router;
