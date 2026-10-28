const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const seedDemoUsers = require('../utils/seedUsers');

// MONGO_URI diya hai  -> us database (Atlas / local MongoDB) se connect hoga
// MONGO_URI khali hai -> local embedded MongoDB (sirf development ke liye)
module.exports = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (uri && process.env.USE_MEMORY_DB !== 'true') {
      await mongoose.connect(uri);
      console.log('MongoDB connected');
      return;
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('Production me MONGO_URI (Atlas) set karna zaruri hai');
    }

    const { MongoMemoryServer } = require('mongodb-memory-server');
    const dbPath = path.join(__dirname, '..', 'data', 'db');
    fs.mkdirSync(dbPath, { recursive: true });

    const mem = await MongoMemoryServer.create({
      instance: { dbName: 'staffsync', dbPath, storageEngine: 'wiredTiger' },
    });
    await mongoose.connect(mem.getUri());
    console.log('Embedded MongoDB running (data saved in backend/data/db)');
    await seedDemoUsers();
  } catch (err) {
    console.error('Database error:', err.message);
    console.error('Tip: agar embedded MongoDB start nahi ho raha, MongoDB Atlas ka URI .env ke MONGO_URI me daal do.');
    process.exit(1);
  }
};
