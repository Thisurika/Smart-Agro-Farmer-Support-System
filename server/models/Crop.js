const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ["Grains", "Vegetables", "Fruits", "Pulses", "Oilseeds", "Spices", "Cash Crops", "Other"]
  },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true, enum: ["kg", "ton", "lb", "unit"] },
  image: { type: String, default: "crop-placeholder.webp" },
  status: { type: String, enum: ["In Stock", "Out of Stock"], default: "In Stock" },
  harvestDate: { type: Date },
  origin: { type: String },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Pre-save middleware: auto-set status to "Out of Stock" when quantity === 0
cropSchema.pre('save', function() {
  if (this.quantity === 0) {
    this.status = 'Out of Stock';
  } else if (this.quantity > 0 && this.status === 'Out of Stock') {
    this.status = 'In Stock';
  }
});

module.exports = mongoose.model('Crop', cropSchema);
