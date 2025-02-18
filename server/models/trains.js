import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema({
  trainId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  totalSeats: {
    type: Number,
    default: 100
  },
  bookedSeats: [{
    seatNumber: Number,
    userId: String,
    bookingId: String
  }]
});

const Train = mongoose.model('Train', trainSchema);

export default Train;
