import mongoose, { Schema } from "mongoose";
import { ITimeCapsule } from "../schema";

const timeCapsuleSchema = new Schema<ITimeCapsule>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  unlockDate: { type: Date, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  media: { type: [String], default: [] },
  isPublic: { type: Boolean, default: false },
  recipients: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  accessCode: {
    type: String,
    required: true,
  },
  isCollaborative: {
    type: Boolean,
    default: false,
  },
  contributors: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isCollaboratorLock: {
    type: Boolean,
    default: false,
  },
  isPermanentLock: {
    type: Boolean,
    default: false,
  },
  isInstagramUpload: {
    type: Boolean,
    default: false,
  },
});

export const TimeCapsule =
  mongoose.models.TimeCapsule ||
  mongoose.model<ITimeCapsule>("TimeCapsule", timeCapsuleSchema);
