import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Ticket } from '../models/Ticket.js';
import { Message } from '../models/Message.js';
import { AIInsight } from '../models/AIInsight.js';
import { initialUsers, initialTickets, initialMessages } from '../services/mockDataStore.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resolveai';
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    }

    console.log('[Seed] Clearing existing MongoDB collections...');
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Message.deleteMany({});
    await AIInsight.deleteMany({});

    console.log('[Seed] Inserting users, tickets, and messages...');
    // We insert raw documents so pre-hashed passwords and specific ObjectIds are preserved
    await User.collection.insertMany(initialUsers);
    await Ticket.collection.insertMany(initialTickets);
    await Message.collection.insertMany(initialMessages);

    console.log(`[Seed] Seeded ${initialUsers.length} Users, ${initialTickets.length} Tickets, ${initialMessages.length} Messages successfully!`);
  } catch (error) {
    console.warn('[Seed] MongoDB Seed note (running in memory mode if MongoDB is off):', error.message);
  }
};

// If run directly via `node utils/seedData.js`
if (process.argv[1]?.includes('seedData.js')) {
  seedDatabase().then(() => {
    console.log('Seeding complete. Exiting.');
    process.exit(0);
  });
}
