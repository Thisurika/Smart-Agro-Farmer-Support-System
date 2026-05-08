const mongoose = require('mongoose');

const refundRequestSchema = new mongoose.Schema({
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected", "Processed"], default: "Pending" },
  adminResponse: { type: String },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  processedAt: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('RefundRequest', refundRequestSchema);
