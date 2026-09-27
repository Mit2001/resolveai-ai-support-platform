import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Single-origin & Vercel CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like same-origin, curl, server-to-server)
      if (!origin) return callback(null, true);
      // Allow localhost for local development & all vercel.app domains in production
      if (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.vercel.app') ||
        (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for same-origin serverless proxy
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check handler
const healthHandler = (req, res) => {
  res.status(200).json({
    success: true,
    service: 'ResolveAI API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''),
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// API Routes - registered with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/team', teamRoutes);

// Fallback route registration without /api prefix for serverless environments where prefix is stripped
app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);
app.use('/customers', customerRoutes);
app.use('/ai', aiRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/team', teamRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
