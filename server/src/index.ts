import express from "express";
import morgan from "morgan";
import cors from "cors";
import { connectDb } from "./lib/db";
import emailRoutes from "./routes/email.route";
import { instagramRoutes } from "./routes/instagram.route";
import { errorMiddleware } from "./lib/ErrorHandler";
import { userRoutes } from "./routes/user.routes";
import { timeCapsuleRoutes } from "./routes/timecapsule.routes";
import groupRoutes from "./routes/group.routes";
import cookieParser from "cookie-parser";
import  mongoose from "mongoose";
import {genAI} from "./config/genai";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

connectDb();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/email", emailRoutes);
app.use("/api/instagram", instagramRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/capsule", timeCapsuleRoutes);
app.use("/api/group", groupRoutes);

// MongoDB Schema
const responseSchema = new mongoose.Schema({
  prompt: String,
  response: String,
  timestamp: { type: Date, default: Date.now },
});

const Response = mongoose.model("Response", responseSchema);

// Route to generate text
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log("Generated text:", responseText);

    // Save response to MongoDB
    const newResponse = new Response({ prompt, response: responseText });
    await newResponse.save();

    res.status(200).json({ success: true, response: responseText });
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).json({ success: false, error: "Failed to generate text." });
  }
});

// Route to fetch all responses
app.get("/api/responses", async (req, res) => {
  try {
    const responses = await Response.find();
    res.status(200).json({ success: true, responses });
  } catch (error) {
    console.error("Error fetching responses:", error);
    res.status(500).json({ success: false, error: "Failed to fetch responses." });
  }
});

app.get("/imganalyze", (req, res) => {
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
async function analyzeImage() {

  
// const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });
const IMAGE_PATH_1 = "https://res.cloudinary.com/dcntuufh9/image/upload/v1737641731/mbxcd1nck899pcucluhf.jpg ";
const IMAGE_PATH_2 = "https://res.cloudinary.com/dcntuufh9/image/upload/v1737642808/xzvkyi6crdfjvre5t4hu.jpg ";
const IMAGE_PATH_3="https://res.cloudinary.com/dcntuufh9/image/upload/v1737670374/Screenshot_2025-01-24_034151_jj6md4.png ";
const imageResp1 = await fetch(IMAGE_PATH_1).then((response) => response.arrayBuffer());
const imageResp2 = await fetch(IMAGE_PATH_2).then((response) => response.arrayBuffer());
const imageResp3 = await fetch(IMAGE_PATH_3).then((response) => response.arrayBuffer());

const result = await model.generateContent([
    {
        inlineData: {
            data: Buffer.from(imageResp1).toString("base64"),
            mimeType: "image/jpeg",
        },
    },
    {
        inlineData: {
            data: Buffer.from(imageResp2).toString("base64"),
            mimeType: "image/jpeg",
        },
    },
    {
        inlineData: {
            data: Buffer.from(imageResp3).toString("base64"),
            mimeType: "image/jpeg",
        },
    },
    'Observe very very carefully.Are the person in the images the same person?',
]);
console.log(result.response.text());

//   const imageResp = await fetch(
// "https://res.cloudinary.com/dcntuufh9/image/upload/v1737569897/yumhvp5k4nx0zrpv7woz.png")
//     .then((response) => response.arrayBuffer());

// const result = await model.generateContent([
//     {
//         inlineData: {
//             data: Buffer.from(imageResp).toString("base64"),
//             mimeType: "image/jpeg",
//         },
//     },
//     'Describe this image in great detail without formatting.',
// ]);

// console.log(result.response.text());
}
analyzeImage();
}
);
// Middleware to handle errors
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
