import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import tasksRouter from './routes/tasks.js';
import authRouter from './routes/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS Setup
const allowedOrigins = [
  'http://localhost:5173', // Local dev frontend
  process.env.CLIENT_URL,  // Production frontend URL from .env
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Helmet Setup for Security
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow serving static files like images, fonts, etc.
}));

app.use(cookieParser());
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);

// Serve frontend static files
const frontendPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(frontendPath));

// For any unmatched routes, serve the frontend index.html
// Serve static files only if not an API request
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(frontendPath, 'index.html'));
});


// MongoDB Connection and Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
