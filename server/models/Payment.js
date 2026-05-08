const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    itemType: { type: String, enum: ["Crop", "Chemical"], required: true },
    item: { type: mongoose.Schema.Types.ObjectId, refPath: "items.itemType" },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Credit Card", "Debit Card", "Bank Transfer", "Cash"], required: true },
  paymentStatus: { 
    type: String, 
    enum: ["Pending", "Completed", "Rejected", "Refund_Pending", "Refunded", "Refund_Rejected"], 
    default: "Pending" 
  },
  refundReason: { type: String },
  adminNotes: { type: String },
  transactionId: { type: String, unique: true },
  billingAddress: { type: String },
  notes: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
