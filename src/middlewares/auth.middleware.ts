import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/sendResponse.ts";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return sendResponse(res, 401, "Authentication token missing", null);
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    req.user = decoded;

    next();
  } catch (error: any) {

    return sendResponse(res, 401, "Invalid or expired token", null, {
      message: error?.message ?? String(error),
    });

  }
};
