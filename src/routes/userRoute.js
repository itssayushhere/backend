import { Router } from "express";
import { register, login } from "../controllers/userController.js";

const router = Router();

// User registration route
router.post("/register", register);

// User login route
router.post("/login", login);

export default router;