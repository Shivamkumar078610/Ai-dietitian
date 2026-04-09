import express from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // TODO: Real DB save user
    const user = { id: Date.now(), name, email };
    const token = jwt.sign(user, process.env.JWT_SECRET || "fitbite_secret_2024", { expiresIn: "7d" });

    res.json({ 
      message: "Signup successful ✅", 
      user, 
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
    
    // TODO: Real DB verify user/password
    if (email && password) {
      const user = { id: 1, name: email.split("@")[0], email };
      const token = jwt.sign(user, process.env.JWT_SECRET || "fitbite_secret_2024", { expiresIn: "7d" });

      res.json({ 
        message: "Login successful ✅", 
        user, 
        token 
      });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
});

// Protected profile
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ 
    message: "Profile fetched", 
    user: req.user 
  });
});

export default router;
