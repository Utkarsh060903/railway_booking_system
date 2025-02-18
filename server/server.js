import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { initializeTrains } from './utils/initializeTrains.js';
import trainRoutes from './routes/trainRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB().then(() => {
  initializeTrains();
});

app.use('/api', trainRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});