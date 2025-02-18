import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const generateUserId = () => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, userId, password } = req.body;
    
    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    // Check if userId exists
    const existingUserId = await User.findOne({ userId });
    if (existingUserId) {
      return res.status(400).json({ message: "User ID already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      userId, 
      name, 
      email, 
      password: hashedPassword 
    });
    await newUser.save();
    
    res.status(201).json({ 
      message: "User registered successfully", 
      userId,
      email 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, userId, password } = req.body;
    
    // Find user by either email or userId
    const user = await User.findOne({
      $or: [
        { email: email },
        { userId: userId }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: "Login successful",
      userId: user.userId,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;