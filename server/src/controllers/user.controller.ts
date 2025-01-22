import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../lib/TryCatch";
import * as admin from "firebase-admin";
import serviceAccount from "../config/firebase-admin.json";
import { generateVerificationToken, sendTokenResponse } from "../services/auth";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { ErrorHandler } from "../lib/ErrorHandler";
import { sendVerification } from "../services/email";
import Verification from "../models/verification.model";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const signInWithGoogle = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { idToken } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const googleUserId = decodedToken.uid;
    const email = decodedToken.email;
    const name = decodedToken.name || email?.split("@")[0].replace(".", "");

    let user;

    user = await User.findOne({
      googleId: googleUserId,
    });

    if (user) {
      sendTokenResponse(200, res, user);
    }

    user = await User.create({
      name,
      email,
      googleId: googleUserId,
      isVerified: true,
    });

    sendTokenResponse(201, res, user!);
  }
);

export const registerUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler(400, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const verificationCode = generateVerificationToken();

    await Verification.create({
      user: user._id,
      code: verificationCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    sendVerification(email, verificationCode);

    return res.status(201).json({
      success: true,
      message: "User created and verification code sent to email",
      user,
    });
  }
);

export const loginUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    let user;

    user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler(400, "Invalid credentials"));
    }

    if (!user.isVerified) {
      const verificationCode = generateVerificationToken();

      await Verification.create({
        user: user._id,
        code: verificationCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });

      sendVerification(email, verificationCode);

      return res.status(200).json({
        success: true,
        message: "Verification code sent to email",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return next(new ErrorHandler(400, "Invalid credentials"));
    }

    sendTokenResponse(200, res, user!);
  }
);

export const verifyUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, verificationCode } = req.body;

    let user = await User.findOne({
      email,
    });

    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }

    const userVerificationCode = await Verification.findOne({
      user: user._id,
    });

    if (!userVerificationCode) {
      return next(new ErrorHandler(400, "Verification code expired"));
    }

    if (Number(userVerificationCode.code) !== Number(verificationCode)) {
      return next(new ErrorHandler(400, "Invalid verification code"));
    }

    user = await User.findOneAndUpdate(
      { email },
      { $set: { isVerified: true } },
      { new: true }
    );

    await userVerificationCode.delete();

    sendTokenResponse(200, res, user);
  }
);
