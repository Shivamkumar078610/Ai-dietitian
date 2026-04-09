import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

// Routes
import authRoutes from "./routes/auth.js";
import dietRoutes from "./routes/diet.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "FitBite AI Backend running ✅", 
    endpoints: {
      auth: "/api/auth/login, /api/auth/signup",
      diet: "/api/diet/generate",
      chat: "/api/chat"
    }
  });
});

// API Routes v1
app.use("/api/auth", authRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/chat", chatRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 FitBite Backend running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints: /api/auth/*, /api/diet/generate, /api/chat`);
});


