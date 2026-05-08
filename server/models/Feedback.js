const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  role: { type: String, default: 'Farmer' },
  message: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  adminReply: { type: String },
  repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  repliedAt: { type: Date },
  isAnonymous: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);
