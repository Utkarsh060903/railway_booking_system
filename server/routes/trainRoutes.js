import express from "express";
import Train from "../models/trains.js";

const router = express.Router();

router.get("/trains", async (req, res) => {
  try {
    const trains = await Train.find();
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/trains/:trainId/availability", async (req, res) => {
  try {
    const train = await Train.findOne({ trainId: req.params.trainId });
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }

    const availableSeats = train.totalSeats - train.bookedSeats.length;
    res.json({ availableSeats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
