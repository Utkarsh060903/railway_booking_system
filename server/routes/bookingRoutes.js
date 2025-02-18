import express from "express";
import { v4 as uuidv4 } from "uuid";
import Train from "../models/trains.js";
import Booking from "../models/booking.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

router.post("/bookings", authenticate, async (req, res) => {
  try {
    const { trainId } = req.body;
    const userId = req.user.userId;

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
    if (!train) return res.status(404).json({ message: "Train not found" });

    if (train.bookedSeats.length >= train.totalSeats) {
      return res.status(400).json({ message: "No seats available" });
    }

    const seatNumber = train.bookedSeats.length + 1;
    const bookingId = uuidv4();
    const booking = new Booking({ bookingId, trainId, userId, seatNumber });
    await booking.save();

    train.bookedSeats.push({ seatNumber, userId, bookingId });
    await train.save();

    res.status(201).json(booking);
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
    res.json({ status: booking.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/bookings/:bookingId/cancel", authenticate, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId,
      userId: req.user.userId,
    });
    if (!booking)
      return res
        .status(404)
        .json({ message: "Booking not found or unauthorized" });

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

export default router;
