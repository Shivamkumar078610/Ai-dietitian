import express from "express";
import fetch from "node-fetch";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", auth, async (req, res) => {
  const u = req.body;

  const prompt = `Create a 7-day Indian diet plan:
  Age: ${u.age}, Weight: ${u.weight}, Height: ${u.height},
  Goal: ${u.goal}, Diet: ${u.diet}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  res.json({ result: data.choices[0].message.content });
});

export default router;