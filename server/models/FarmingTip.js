const mongoose = require('mongoose');

const farmingTipSchema = new mongoose.Schema({
  weatherCondition: {
    type: String,
    required: true,
    enum: ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Snow', 'Mist', 'Haze', 'All']
  },
  tip: { type: String, required: true },
  category: {
    type: String,
    enum: ['general', 'crop', 'irrigation', 'harvest', 'pest'],
    default: 'general'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

module.exports = mongoose.model('FarmingTip', farmingTipSchema);
