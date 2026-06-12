const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner', 'developer'], default: 'owner' },
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
