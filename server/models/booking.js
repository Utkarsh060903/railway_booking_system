import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  trainId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  seatNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;