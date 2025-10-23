const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // changed to optional
  pnr: { type: String },
  from: { type: String, required: false }, // optional
  to: { type: String, required: false },   // optional
  email: { type: String, required: false },
  phone: { type: String, required: false },
  date: { type: Date, required: false },   // optional
  passengers: { type: Array, default: [] },
  totalCost: { type: Number, default: 0 },
  bookedAt: { type: Date, default: Date.now },
  trainName: { type: String },
  trainNumber: { type: String },
  quota: { type: String, default: 'GENERAL (GN)' },
  distance: { type: Number },
  departureTime: { type: String },
  arrivalTime: { type: String },
  travelClass: { type: String },
  transactionId: { type: String },
  convenienceFee: { type: Number, default: 23.60 },
  pgCharges: { type: Number, default: 0 },
  invoiceNumber: { type: String },
  gstin: { type: String, default: '07AAAGM0289C1ZL' },
  bookingStatus: { type: String, default: 'CONFIRMED' },
  currentStatus: { type: String, default: 'CONFIRMED' }
});

module.exports = mongoose.model('Ticket', TicketSchema);
