import express from "express";
import { v4 as uuidv4 } from "uuid";
import Train from "../models/trains.js";
import Booking from "../models/booking.js";

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

router.post("/bookings", async (req, res) => {
  try {
    const { trainId, userId } = req.body;

    const existingBooking = await Booking.findOne({
      trainId,
      userId,
      status: "confirmed",
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "User already has a booking on this train" });
    }

    const train = await Train.findOne({ trainId });
    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }

    if (train.bookedSeats.length >= train.totalSeats) {
      return res.status(400).json({ message: "No seats available" });
    }

    const seatNumber = train.bookedSeats.length + 1;
    const bookingId = uuidv4();

    const booking = new Booking({
      bookingId,
      trainId,
      userId,
      seatNumber,
    });

    await booking.save();

    train.bookedSeats.push({
      seatNumber,
      userId,
      bookingId,
    });

    await train.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/bookings/:bookingId/cancel", async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    const train = await Train.findOne({ trainId: booking.trainId });
    train.bookedSeats = train.bookedSeats.filter(
      (seat) => seat.bookingId !== booking.bookingId
    );

    booking.status = "cancelled";

    await Promise.all([booking.save(), train.save()]);

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/bookings/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
