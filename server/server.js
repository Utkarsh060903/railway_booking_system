import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { initializeTrains } from './utils/initializeTrains.js';
import trainRoutes from './routes/trainRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB().then(() => {
  initializeTrains();
});

app.use('/api', trainRoutes);
app.use('/api', userRoutes),
app.use('/api', bookingRoutes)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});