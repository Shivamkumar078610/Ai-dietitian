import express from "express";
import axios from "axios";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const { age, height, weight, goal, diet } = req.body;

    if (!age || !height || !weight || !goal) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "API key missing" });
    }

    const prompt = `
Create a 7-day Indian diet plan in JSON format only.

User Details:
Age: ${age} years
Height: ${height} cm  
Weight: ${weight} kg
Goal: ${goal}
Diet preference: ${diet || "balanced"}

Format exactly:
{
  "days": [
    {
      "day": 1,
      "meals": {
        "breakfast": {...},
        "lunch": {...},
        "snack": {...},
        "dinner": {...}
      },
      "totalCalories": 2000,
      "macros": {"protein": 100, "carbs": 250, "fat": 60}
    }
  ],
  "summary": {
    "totalCalories": "1800-2000/day",
    "goal": "${goal}"
  }
}
    `;

    const aiRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiText = aiRes.data?.choices?.[0]?.message?.content;

    if (!aiText) {
      return res.status(500).json({ error: "AI response empty" });
    }

    // Clean JSON response
    let cleanText = aiText.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/```json|```/g, "");
    }
    const jsonStart = cleanText.indexOf("{");
    const jsonEnd = cleanText.lastIndexOf("}") + 1;
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanText = cleanText.substring(jsonStart, jsonEnd);
    }

    let plan;
    try {
      plan = JSON.parse(cleanText);
    } catch {
      return res.json({ raw: aiText });
    }

    res.json(plan);

  } catch (err) {
    console.error("Diet error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate plan" });
  }
});

export default router;
