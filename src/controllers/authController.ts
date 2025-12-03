// controllers/auth.controller.ts
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import type { User } from "@prisma/client";

import { loginSchema, registerSchema } from "../validations/auth.schema.ts";
import { prisma } from "../config/db.ts";
import { sendResponse } from "../utils/sendResponse.ts";
import { generateToken } from "../utils/generateToken.ts";

type AuthUserPayload = {
  id: User["id"];
  email: User["email"];
  username: User["username"];
};

export const register = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return sendResponse(res, 400, "Validation failed", null, errors);
    }

    const { email, username, name, password, profilePhoto, bio, DOB, Gender } =
      validationResult.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return sendResponse(res, 400, "Email already in use");
      }
      if (existingUser.username === username) {
        return sendResponse(res, 400, "Username already taken");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const normalizedGender = Gender
      ? (Gender.toUpperCase() as "MALE" | "FEMALE")
      : null;

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password: hashedPassword,
        profilePhoto,
        bio,
        DOB: DOB,
        gender: normalizedGender,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    } as AuthUserPayload);

    return sendResponse(res, 201, "User registered successfully", {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        profilePhoto: user.profilePhoto,
        bio: user.bio,
        DOB: user.DOB,
        Gender: user.gender,
      },
      token,
    });
  } catch (error: any) {
    console.error("Register error:", error);

    return sendResponse(res, 500, "Internal server error", null, {
      message: error?.message ?? String(error),
    });
  }
};

/**
 * POST /login
 */
export const login = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return sendResponse(res, 400, "Validation failed", null, errors);
    }

    const { email, username, password } = validationResult.data;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(username ? [{ username }] : []),
        ],
      },
    });

    if (!user) {
      return sendResponse(res, 401, "Invalid email/username");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendResponse(res, 401, "Invalid email/username or password");
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    } as AuthUserPayload);

    return sendResponse(res, 200, "Login successful", {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        profilePhoto: user.profilePhoto,
        bio: user.bio,
        DOB: user.DOB,
        Gender: user.Gender,
      },
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);

    return sendResponse(res, 500, "Internal server error", null, {
      message: error?.message ?? String(error),
    });
  }
};
