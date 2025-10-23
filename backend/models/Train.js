// backend/models/Train.js
const mongoose = require("mongoose");

const trainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: Date, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  ac2Tier: { type: Number, required: true },
  ac3Tier: { type: Number, required: true },
  sleeper: { type: Number, required: true }
});

module.exports = mongoose.model("Train", trainSchema);
