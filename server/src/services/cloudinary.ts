import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (
  localFilePath: string,
  resourceType: "video" | "image"
) => {
  try {
    if (!localFilePath) return null;
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      transformation: [
        { aspect_ratio: "4:3", crop: "crop" }, // Enforce 4:3 aspect ratio
        { crop: "scale" }, // Ensure the image is scaled proportionally
      ],
    });
    fs.unlinkSync(localFilePath); // Remove the locally saved temp file as the upload is successful
    return res;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath); // Remove the locally saved temp file as the upload got failed
    return null;
  }
};
