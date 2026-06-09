// backend/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const path = require('path');

// Make the uploads folder public
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================
// MIDDLEWARE
// ============================================================

// 1. Enable CORS (Cross-Origin Resource Sharing)
// This allows your React frontend (on port 3000) to access this API
app.use(cors());

// 2. Body Parser
// Allows the server to read JSON data sent from your Admin Dashboard forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// DATABASE CONNECTION
// ============================================================

// Replace the string below with your MongoDB Compass connection string if not using .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rws_database';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// ============================================================
// ROUTES
// ============================================================

// Import your Admin Routes
const adminRoutes = require('./routes/adminRoutes');

// Link the routes to the /api/admin path
// This makes endpoints available at http://localhost:5000/api/admin/...
app.use('/api/admin', adminRoutes);

// Health Check Route (To verify the server is alive)
app.get('/', (req, res) => {
  res.send('RWS Backend API is running...');
});

// ============================================================
// SERVER STARTUP
// ============================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is floating at http://localhost:${PORT}`);
  console.log(`📡 Admin API ready at http://localhost:${PORT}/api/admin/all-content`);
});