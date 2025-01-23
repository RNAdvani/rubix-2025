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

// Middleware to handle errors
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
