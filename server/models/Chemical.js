const mongoose = require('mongoose');

const chemicalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ["Fertilizer", "Pesticide", "Herbicide", "Fungicide", "Insecticide", "Growth Regulator", "Other"]
  },
  category: { type: String, required: true },
  brand: { type: String },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true, enum: ["litre", "kg", "ml", "g", "unit"] },
  image: { type: String, default: "chemical-placeholder.webp" },
  status: { type: String, enum: ["In Stock", "Out of Stock"], default: "In Stock" },
  applicationMethod: { type: String },
  safetyInstructions: { type: String },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Pre-save middleware: auto-set status to "Out of Stock" when quantity === 0
chemicalSchema.pre('save', function() {
  if (this.quantity === 0) {
    this.status = 'Out of Stock';
  } else if (this.quantity > 0 && this.status === 'Out of Stock') {
    this.status = 'In Stock';
  }
});

module.exports = mongoose.model('Chemical', chemicalSchema);
