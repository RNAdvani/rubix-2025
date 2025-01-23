import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../lib/TryCatch";
import * as admin from "firebase-admin";
import serviceAccount from "../config/firebase-admin.json";
import {
  formatPhoneNumber,
  generateVerificationToken,
  sendTokenResponse,
} from "../services/auth";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { ErrorHandler } from "../lib/ErrorHandler";
import { sendEmail, sendVerification } from "../services/email";
import Verification from "../models/verification.model";
import { sendWhatsapp } from "../services/whatsapp";
import { TimeCapsule } from "../models/timecapsule.model";
import { IUser } from "../schema";

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
    const { name, email, password, phone } = req.body;

    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler(400, "User already exists"));

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: formatPhoneNumber(phone),
    });

    // Link anonymous capsules to registered user
    const capsules = await TimeCapsule.find({ anonymousEmails: email });
    for (const capsule of capsules) {
      capsule.recipients.push(user._id);
      capsule.anonymousEmails = capsule.anonymousEmails.filter(
        (e: any) => e !== email
      );
      await capsule.save();
    }

    const verificationCode = generateVerificationToken();

    await Verification.create({
      user: user._id,
      code: verificationCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
    });

    await sendWhatsapp(String(verificationCode), user.phone);
    await sendVerification(email, verificationCode);

    return res.status(201).json({
      success: true,
      message: "User created and verification code sent to email and WhatsApp",
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

      await sendWhatsapp(String(verificationCode), user.phone);

      await sendVerification(email, verificationCode);

      return res.status(200).json({
        success: true,
        message: "Verification code sent to email and whatsapp",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return next(new ErrorHandler(400, "Invalid credentials"));
    }

    sendTokenResponse(200, res, user!);
  }
);
export const logoutUser = TryCatch(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

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

    await userVerificationCode.deleteOne({ user: user._id });

    sendTokenResponse(200, res, user);
  }
);

export const sendVerificationCode = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, phone } = req.body;

    const verificationCode = generateVerificationToken();

    await Verification.create({
      user: email,
      code: verificationCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendVerification(email, verificationCode);

    await sendWhatsapp(String(verificationCode), phone);

    return res.status(200).json({
      success: true,
      message: "Verification code sent to email and whatsapp",
    });
  }
);

export const updateUserNumber = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, phone } = req.body;

    let user;

    user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }

    user = await User.findOneAndUpdate({
      phone: formatPhoneNumber(phone),
    });
  }
);

export const updateUsername = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }

    const updatedUser = await User.findOneAndUpdate(
      user._id,
      { username },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Username updated successfully",
      updatedUser,
    });
  }
);

export const searchUserFromUsernameOrEmail = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("+_id email username");

    return res.status(200).json({
      success: true,
      users: users,
    });
  }
);

export const getCurrentUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  }
);
