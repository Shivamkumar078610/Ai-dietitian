import express from "express";
import axios from "axios";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "AI service unavailable" });
    }

    const prompt = `
You are FitBite AI, a friendly Indian dietitian assistant. 

User asked: "${message}"

Keep responses:
- Short & helpful (under 300 words)
- Practical Indian food examples  
- Motivational & encouraging
- Use emojis sparingly
- Reference Dashboard for plans/tracking

Context: Indian user wanting personalized diet plans, calorie tracking, meal ideas.

Respond conversationally but professionally.
    `;

    const aiRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          { role: "system", content: "You are FitBite AI Dietitian. Helpful, encouraging, Indian recipes." },
          { role: "user", content: prompt }
        ],
        max_tokens: 400
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const response = aiRes.data.choices[0].message.content.trim();

    res.json({ 
      reply: response,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("Chat error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI chat failed. Try again!" });
  }
});

export default router;
