const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ["Crop Issue", "Chemical Issue", "Payment Issue", "Account Issue", "Technical Issue", "Other"]
  },
  priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
  status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
  adminReplies: [{
    message: { type: String, required: true },
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    repliedAt: { type: Date, default: Date.now }
  }],
  attachments: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
