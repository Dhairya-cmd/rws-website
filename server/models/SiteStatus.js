const mongoose = require('mongoose');
module.exports = mongoose.model('SiteStatus', new mongoose.Schema({
  key: { type: String, default: 'status' },
  isShutdown: { type: Boolean, default: false },
  shutdownMessage: { type: String, default: 'This website is temporarily unavailable.' },
  shutdownBy: String,
  shutdownAt: Date,
}, { timestamps: true }));
