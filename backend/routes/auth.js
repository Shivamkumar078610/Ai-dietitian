import express from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

import User from '../models/User.js';


// Signup
import bcrypt from "bcryptjs";

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, name, email }, process.env.JWT_SECRET || "fitbite_secret_2024", { expiresIn: "7d" });

    res.json({ 
      message: "Signup successful ✅", 
      user: { id: user._id, name, email }, 
      token 
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during signup" });
  }
});


// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET || "fitbite_secret_2024", { expiresIn: "7d" });

    res.json({ 
      message: "Login successful ✅", 
      user: { id: user._id, name: user.name, email: user.email }, 
      token 
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
});


// Protected user basic profile
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ 
    message: "Basic profile fetched", 
    user: req.user 
  });
});



export default router;
