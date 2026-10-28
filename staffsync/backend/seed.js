// Atlas / local MongoDB ke liye: npm run seed
// (Embedded mode me server khud demo users bana deta hai)
require('dotenv').config();
const mongoose = require('mongoose');
const seedDemoUsers = require('./utils/seedUsers');

(async () => {
  if (!process.env.MONGO_URI) {
    console.log('MONGO_URI khali hai - embedded mode me seed apne aap ho jata hai, npm run dev chalao.');
    process.exit(0);
  }
  await mongoose.connect(process.env.MONGO_URI);
  await seedDemoUsers();
  process.exit(0);
})();
