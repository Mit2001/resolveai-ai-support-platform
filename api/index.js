import app from '../server/app.js';
import { connectDB } from '../server/config/db.js';

let isDbInitialized = false;

export default async function handler(req, res) {
  if (!isDbInitialized) {
    try {
      await connectDB();
      isDbInitialized = true;
    } catch (err) {
      console.warn('[Serverless DB init notice]', err.message);
    }
  }

  return app(req, res);
}
