import mongoose from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  googleId?: string;
  password: string;
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
  isPublic: boolean;
  recipients: IUser[]; // self id always
  accessCode: string; //If permanent is false then only code and password should be emailed to receiptents
  isCollaborative: boolean;
  contributors: IUser[];
  isInstagramUpload: boolean; //10 images or videos
  isPermanentLock: boolean;
  isCollaboratorLock: boolean; // Creator wants to lock(in)
  isRequiredUpdates: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvitation extends Document {
  _id: mongoose.Types.ObjectId;
  sender: IUser;
  recipient: IUser;
  timeCapsule: ITimeCapsule;
  updatedAt: Date;
  createdAt: Date;
  status: "pending" | "accepted";
  invitationLink: string;
}

export interface IVerification extends Document {
  _id: mongoose.Types.ObjectId;
  user: IUser;
  code: string;
  expiresAt: Date;
}
