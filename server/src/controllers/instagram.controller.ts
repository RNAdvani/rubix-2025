import { ErrorHandler } from "../lib/ErrorHandler";
import { TryCatch } from "../lib/TryCatch";
import { uploadOnCloudinary } from "../services/cloudinary";
import { postInstaMedia, publishInstaMedia } from "../services/instagram";
import schedule from "node-schedule";

const getResourceType = (mimetype: string): "IMAGE" | "VIDEO" => {
    return mimetype.startsWith("video") ? "VIDEO" : "IMAGE";
  };
  

export const postSingleInstagram = TryCatch(async (req,res,next)=>{
    const {caption,scheduledTime} = req.body;
    const file = req.file;

    if(!file) return next(new ErrorHandler(400,"Please provide an image"))
    if(!caption) return next(new ErrorHandler(400,"Please provide a caption"))

    const resourceType = getResourceType(file.mimetype);

    const uploadResult = await uploadOnCloudinary(file.path, resourceType.toLowerCase() as "video" | "image");

    if(!uploadResult) return next(new ErrorHandler(500,"Failed to upload media on cloudinary"))

    const mediaResponse = await postInstaMedia(caption,uploadResult.secure_url,resourceType);
    console.log('Media Response:',mediaResponse)

    if(!mediaResponse) return next(new ErrorHandler(500,"Failed to post media on Instagram"))

    const publishResponse = await publishInstaMedia(mediaResponse.id);
    console.log('Publish Response:',publishResponse)
    
    return res.status(201).json({
        success:true,
        data:publishResponse
    })
})