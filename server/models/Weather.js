const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  city: { type: String, required: true },
  temperature: { type: Number },
  feelsLike: { type: Number },
  humidity: { type: Number },
  windSpeed: { type: Number },
  condition: { type: String },
  icon: { type: String },
  description: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Weather', weatherSchema);
