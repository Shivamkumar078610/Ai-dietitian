import express from "express";
import axios from "axios";
import authMiddleware from "../middleware/auth.js";
import Profile from "../models/Profile.js";

const router = express.Router();


router.post("/", authMiddleware, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !messages.length) {
      return res.status(400).json({ error: "Messages required" });
    }

    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(400).json({ error: "Complete your profile first" });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "AI service unavailable" });
    }

    const systemContent = `
You are a professional AI Dietitian and Nutritionist.
You behave like ChatGPT.
You give:
- Personalized advice
- Friendly human-like responses
- Clear explanations
- Indian food knowledge

STRICT RULES:
- Respect dietPreference (${profile.dietPreference}): veg = NO chicken/meat/fish, vegan = NO dairy/egg/animal products
- Allergies: ${profile.allergies}
- Budget: ₹${profile.budget}/week
- Age: ${profile.age}, Gender: ${profile.gender}, Height: ${profile.height}cm, Weight: ${profile.weight}kg, Activity: ${profile.activityLevel}

Indian realistic meals only. Conversational.
    `;


    const aiMessages = [
      { role: "system", content: systemContent },
      ...messages.map((m) => ({
        role: m.role.toLowerCase(),
        content: m.content
      })).slice(-20)
    ];

    const aiRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages: aiMessages,
        max_tokens: 600
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
