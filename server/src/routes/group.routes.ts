// routes/group.routes.ts
import { Router } from "express";
import {
  createGroup,
  getAllGroupsOfUsers,
  updateGroup,
} from "../controllers/group.controller";

const router = Router();

// Define routes
router.post("/create", createGroup);
router.post("/getgroups", getAllGroupsOfUsers);
router.put("/update", updateGroup);

export default router;
