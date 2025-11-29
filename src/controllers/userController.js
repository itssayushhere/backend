import { prisma } from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../validations/auth.schema.js";


export const register = async (req, res) => {
  try {
    // Validate request body with Zod
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const { email, username, name, password, profilePhoto, bio, DOB, gender } =
      validationResult.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser?.email === email) {
        return res.status(400).json({ message: "Email already in use" });
      }
      if (existingUser?.username === username) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password: hashedPassword,
        profilePhoto,
        bio,
        DOB: new Date(DOB),
        gender,
      },
    });

    const token = generateToken({
      id: user?.id,
      email: user?.email,
      username: user?.username,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user?.id,
        email: user?.email,
        username: user?.username,
        name: user?.name,
        profilePhoto: user?.profilePhoto,
        bio: user?.bio,
        DOB: user?.DOB,
        gender: user?.gender,
      },
      token,
    });
    
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      error: error.message,
    });

  }
};

export const login = async (req, res) => {
  try {
    // Validate request body with Zod
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
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
      return res
        .status(401)
        .json({ message: "Invalid email/username" });
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid  or password" });
    }

    const token = generateToken({
      id: user?.id,
      email: user?.email,
      username: user?.username,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user?.id,
        email: user?.email,
        username: user?.username,
        name: user?.name,
        profilePhoto: user?.profilePhoto,
        bio: user?.bio,
        DOB: user?.DOB,
        gender: user?.gender,
      },
      token,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
