import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import tasksRouter from './routes/tasks.js';
import authRouter from './routes/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// CORS Setup
const allowedOrigins = [
  'http://localhost:5173',                          // Local dev frontend
  'https://sparke-task-frontend.vercel.app',        // Vercel frontend
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));

// Helmet Setup for Security
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cookieParser());
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);

// MongoDB Connection and Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
