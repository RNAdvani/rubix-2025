import mongoose, { Schema } from "mongoose";
import { IInvitation } from "../schema";

const invitationSchema = new Schema<IInvitation>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timeCapsule: {
      type: Schema.Types.ObjectId,
      ref: "TimeCapsule",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    invitationLink: { type: String, required: true },
  },
  { timestamps: true }
);

export const Invitation =
  mongoose.models.Invitation ||
  mongoose.model<IInvitation>("Invitation", invitationSchema);
