import mongoose from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  googleId?: string;
  password: string;
  username: string;
  phone: string;
  isVerified: boolean;
  createdAt: Date;
  friends: IUser[];
  groups: IGroup[];
  dob: Date;
  updatedAt: Date;
}

export interface IGroup extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  owner: IUser;
  members: IUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMedia extends Document {
  url: string;
  metadata: {
    type: string;
    timestamp: number;
    tags: string[];
    description: string;
    inPictures: IUser[];
    location: {
      type: string;
      coordinates: [number, number];
    };
  };
  AIGeneratedSummary: string;
}
export interface ITimeCapsule extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  unlockDate: Date;
  creator: IUser;
  media: IMedia[];
  recipients: IUser[]; // Registered users
  anonymousRecipients: { email: string; accessCode: string }[]; // Anonymous emails with access codes
  usedAccessCodes?: string[]; // Optional: Track used access codes
  accessCode: string; // If applicable
  isCollaborative: boolean;
  contributors: IUser[];
  isInstagramUpload: boolean;
  isPermanentLock: boolean;
  isCollaboratorLock: boolean;
  isRequiredUpdates: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface IInvitation extends Document {
  sender: IUser["_id"];
  recipient: IUser["_id"];
  timeCapsule: ITimeCapsule["_id"];
  status: "pending" | "accepted" | "declined";
  invitationLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVerification extends Document {
  _id: mongoose.Types.ObjectId;
  user: IUser;
  code: string;
  expiresAt: Date;
}
