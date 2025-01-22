export interface MediaFile {
   id: string;
   url: string;
   alt?: string;
   type: "image" | "video" | "audio";
   thumbnail?: string;
   timestamp?: number;
}

export interface User {
   _id: string;
   name: string;
   email: string;
   password: string;
   googleId?: string;
   phone: string;
   isVerified: boolean;
   createdAt: Date;
   friends: string[];
   groups: string[];
   dob: Date;
   updatedAt: Date;
}
