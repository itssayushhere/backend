// src/app.js
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// User routes
app.use("/api/users", userRoutes);


export default app;
