import mongoose from 'mongoose';
import { safeSeedDatabase } from '../utils/seedData.js';

let isConnected = false;
let connectionPromise = null;

export const connectDB = async () => {
  // If already connected, return existing connection
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return mongoose.connection;
  }

  // If connection is in progress, reuse the promise
  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resolveai';

  connectionPromise = (async () => {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
      });
      isConnected = true;
      console.log(`[MongoDB] Connected: ${conn.connection.host}`);
      // Safely ensure demo users and data exist without wiping existing records
      await safeSeedDatabase();
      return conn;
    } catch (error) {
      console.warn(`[MongoDB Notice] Database connection unavailable (${error.message}). Running in mock/in-memory fallback mode.`);
      isConnected = false;
      return null;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

export const isDbConnected = () => isConnected || mongoose.connection.readyState >= 1;
