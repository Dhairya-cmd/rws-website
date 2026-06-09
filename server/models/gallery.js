const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: String,
  category: { 
    type: String, 
    required: true,
    enum: ['Robotic Welding', 'Manual Welding', 'CNC Machining', 'Metal Fabrication', 'Fixture & Tooling', 'Sub-Assembly']
  },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  mediaUrl: { type: String, required: true }, // The URL of the image/video
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);