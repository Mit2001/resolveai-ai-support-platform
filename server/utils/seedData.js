import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Ticket } from '../models/Ticket.js';
import { Message } from '../models/Message.js';
import { initialUsers, initialTickets, initialMessages } from '../services/mockDataStore.js';

dotenv.config();

let isSeeding = false;
let isSeeded = false;

/**
 * Safely ensure demo users and initial data exist in MongoDB Atlas / local MongoDB
 * without deleting or overriding existing production data.
 */
export const safeSeedDatabase = async () => {
  if (isSeeded || isSeeding) return;
  if (mongoose.connection.readyState !== 1) return;

  isSeeding = true;
  try {
    // 1. Ensure demo users exist
    let insertedUsersCount = 0;
    for (const u of initialUsers) {
      const existing = await User.findOne({ email: u.email.toLowerCase() });
      if (!existing) {
        const userDoc = {
          _id: new mongoose.Types.ObjectId(u._id),
          name: u.name,
          email: u.email.toLowerCase(),
          password: u.password, // Pre-hashed with bcrypt for 'password123'
          role: u.role,
          avatar: u.avatar,
          company: u.company,
          status: u.status || 'active',
          createdAt: u.createdAt || new Date(),
        };
        await User.collection.insertOne(userDoc);
        insertedUsersCount++;
      }
    }

    if (insertedUsersCount > 0) {
      console.log(`[SafeSeed] Ensured ${insertedUsersCount} missing demo user(s) in MongoDB.`);
    }

    // 2. Ensure initial tickets exist if collection is empty
    const ticketCount = await Ticket.countDocuments();
    if (ticketCount === 0 && initialTickets.length > 0) {
      const ticketsToInsert = initialTickets.map((t) => ({
        ...t,
        _id: new mongoose.Types.ObjectId(t._id),
        customer: new mongoose.Types.ObjectId(t.customer),
        assignedAgent: t.assignedAgent ? new mongoose.Types.ObjectId(t.assignedAgent) : null,
      }));
      await Ticket.collection.insertMany(ticketsToInsert);

      const messagesToInsert = initialMessages.map((m) => ({
        ...m,
        _id: new mongoose.Types.ObjectId(m._id),
        ticket: new mongoose.Types.ObjectId(m.ticket),
        sender: new mongoose.Types.ObjectId(m.sender),
      }));
      await Message.collection.insertMany(messagesToInsert);

      console.log(`[SafeSeed] Populated initial demo tickets and messages (${ticketsToInsert.length} tickets).`);
    }

    isSeeded = true;
  } catch (error) {
    console.warn('[SafeSeed] Notice during database initialization:', error.message);
  } finally {
    isSeeding = false;
  }
};

// Backwards-compatible alias
export const seedDatabase = safeSeedDatabase;

// If run directly via `node utils/seedData.js`
if (process.argv[1]?.includes('seedData.js')) {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resolveai';
  mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => safeSeedDatabase())
    .then(() => {
      console.log('Safe seeding check complete. Exiting.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed error:', err.message);
      process.exit(1);
    });
}

