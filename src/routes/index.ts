import { Router } from "express";
import userRoutes from "./userRoute.ts";
const router = Router();

router.use("/auth", userRoutes);

export default router;
