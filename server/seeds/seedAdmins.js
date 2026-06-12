require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/rws_database';

const admins = [
  {
    username: process.env.OWNER_USER || 'owner',
    password: process.env.OWNER_PASS || 'owner123',
    role: 'owner',
  },
  {
    username: process.env.DEV_USER || 'developer',
    password: process.env.DEV_PASS || 'dev123',
    role: 'developer',
  },
];

mongoose.connect(MONGO).then(async () => {
  console.log('Connected to MongoDB');
  for (const a of admins) {
    const hashed = await bcrypt.hash(a.password, 12);
    await Admin.findOneAndUpdate(
      { username: a.username },
      { username: a.username, password: hashed, role: a.role },
      { upsert: true, new: true }
    );
    console.log(`✅ Seeded: ${a.username} (${a.role})`);
  }
  mongoose.disconnect();
  console.log('Done!');
}).catch(err => console.error('Error:', err.message));
