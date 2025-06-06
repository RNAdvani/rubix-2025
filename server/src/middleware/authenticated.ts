import { NextFunction, Request, Response } from "express";
import { IUser } from "../schema";
import jwt from "jsonwebtoken";
import { TryCatch } from "../lib/TryCatch";
import User from "../models/user.model";
import { ErrorHandler } from "../lib/ErrorHandler";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export const authenticate = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get token from Authorization header
    const token = req.cookies.token;

    if (!token) {
      next(new ErrorHandler(401, "Not authorized to access this route"));
      return;
    }

    try {
      const decodeData = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };
      const user = await User.findById(decodeData.id);

      if (!user) {
        res.status(401).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }
  }
);
