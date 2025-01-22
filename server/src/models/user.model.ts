import mongoose, { Schema } from "mongoose";
import { IUser } from "../schema";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String },
  googleId: { type: String },
  password: { type: String },
  phone: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  groups: [{ type: Schema.Types.ObjectId, ref: "Group", default: [] }],
  dob: { type: Date },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
