import mongoose, { Schema } from "mongoose";
import { IMedia } from "../schema";

const mediaSchema = new Schema<IMedia>({
  url: { type: String, required: true },
  metadata: {
    type: {
      type: String,
    },
    timestamp: {
      type: Number,
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
    },
    inPictures: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    location: {
      type: {
        type: String,
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  AIGeneratedSummary: {
    type: String,
    required: true,
  },
});

export const Media =
  mongoose.models.Media || mongoose.model("Media", mediaSchema);
