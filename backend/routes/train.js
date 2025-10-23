// backend/routes/train.js
const express = require("express");
const Train = require("../models/Train");
const router = express.Router();

/**
 * 🟢 Add new train
 */
router.post("/", async (req, res) => {
  try {
    const train = new Train(req.body);
    await train.save();
    res.status(201).json({ message: "Train added successfully", train });
  } catch (err) {
    console.error("❌ Error adding train:", err);
    res.status(400).json({ message: "Error adding train", error: err.message });
  }
});

/**
 * 🟢 Get all trains
 */
router.get("/", async (req, res) => {
  try {
    const trains = await Train.find().sort({ date: 1 });
    res.json(trains);
  } catch (err) {
    console.error("❌ Error fetching trains:", err);
    res.status(500).json({ message: "Error fetching trains", error: err.message });
  }
});

/**
 * 🟢 Search trains by 'from', 'to', and 'date'
 * This is used in BookingForm.jsx → handleSearch()
 */
// Search trains by from, to, date
router.get("/search", async (req, res) => {
  const { from, to, date } = req.query;
  console.log("Search query params:", { from, to, date });
  try {
    if (!from || !to || !date) {
      return res.status(400).json({ message: "Missing required query parameters" });
    }

    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    const adjustedStartDate = new Date(startDate.getTime() + startDate.getTimezoneOffset() * 60 * 1000);
    const adjustedEndDate = new Date(endDate.getTime() + endDate.getTimezoneOffset() * 60 * 1000);

    const trains = await Train.find({
      from,
      to,
      date: { $gte: adjustedStartDate, $lte: adjustedEndDate }
    });

    res.json(trains);
  } catch (err) {
    console.error("Error searching trains:", err);
    res.status(500).json({ message: "Error searching trains", error: err.message });
  }
});


/**
 * 🟢 Get train by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }
    res.json(train);
  } catch (err) {
    console.error("❌ Error fetching train by ID:", err);
    res.status(500).json({ message: "Error fetching train", error: err.message });
  }
});

/**
 * 🟡 Update train by ID
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedTrain = await Train.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTrain) {
      return res.status(404).json({ message: "Train not found" });
    }
    res.json({ message: "Train updated successfully", train: updatedTrain });
  } catch (err) {
    console.error("❌ Error updating train:", err);
    res.status(400).json({ message: "Error updating train", error: err.message });
  }
});

/**
 * 🔴 Delete train by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedTrain = await Train.findByIdAndDelete(req.params.id);
    if (!deletedTrain) {
      return res.status(404).json({ message: "Train not found" });
    }
    res.json({ message: "Train deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting train:", err);
    res.status(400).json({ message: "Error deleting train", error: err.message });
  }
});

module.exports = router;
