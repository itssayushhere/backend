// src/app.js
import express from "express";
import routes from "./routes/index.ts";
import cors from "cors"
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// User routes
app.use("/api", routes);


export default app;
