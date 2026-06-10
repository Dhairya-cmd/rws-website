const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
  title: String,
  icon: String,
  desc: String,
  detail: String,
  order: Number
});
module.exports = mongoose.model('Service', serviceSchema);