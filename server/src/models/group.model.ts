import mongoose from "mongoose";
import { IGroup } from "../schema";

const groupSchema = new mongoose.Schema<IGroup>({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Group =
  mongoose.models.Group || mongoose.model<IGroup>("Group", groupSchema);
