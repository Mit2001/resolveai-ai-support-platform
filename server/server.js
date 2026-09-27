import app from './app.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 ResolveAI Backend Server running on http://localhost:${PORT}`);
  console.log(`🌟 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 Gemini AI Key: ${process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Demo/Fallback Mode 💡'}`);
  console.log(`=========================================`);
});
