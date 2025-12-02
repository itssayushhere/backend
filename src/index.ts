// src/index.js
import dotenv from 'dotenv';
import app from './app.ts';
import { connectDB } from './config/db.ts';

dotenv.config();

// Connect to DB first
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
