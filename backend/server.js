import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});


// ================= AUTH ROUTES =================

// SIGNUP
app.post("/api/auth/signup", (req, res) => {
  console.log("Signup:", req.body);

  res.json({
    message: "Signup successful ✅",
    user: req.body
  });
});

// LOGIN
app.post("/api/auth/login", (req, res) => {
  console.log("Login:", req.body);

  res.json({
    message: "Login successful ✅",
    user: req.body
  });
});


// ================= AI DIET PLAN =================

app.post("/api/diet/generate", async (req, res) => {
  try {
    const { age, height, weight, goal, diet } = req.body;

    const prompt = `
Create a personalized 7-day Indian diet plan.

User Details:
Age: ${age}
Height: ${height} cm
Weight: ${weight} kg
Goal: ${goal}
Diet: ${diet}

Rules:
- 7 days (Monday to Sunday)
- Each day must include breakfast, lunch, dinner, snacks
- Include realistic Indian foods
- Include calorie-conscious meals

Return ONLY JSON (no text):
{
  "Monday": { "breakfast": "", "lunch": "", "dinner": "", "snacks": "" },
  "Tuesday": { "breakfast": "", "lunch": "", "dinner": "", "snacks": "" },
  "Wednesday": { "breakfast": "", "lunch": "", "dinner": "", "snacks": "" },
  "Thursday": { "breakfast": "", "lunch": "", "dinner": "", "snacks": "" },
  "Friday": { "breakfast": "", "lunch": "", "dinner": "", "snacks": "" },
  "Saturday": { "breakfast": "", "lunch": "", "dinner": "", "snacks": "" },
  "Sunday": { "breakfast": "", "lunch": "", "dinner": "", "snacks": "" }
}
`;

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

    // DEBUG
    console.log("AI RAW RESPONSE:", data);

    let text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({ error: "AI response empty ❌" });
    }

    // 🧠 CLEAN RESPONSE (important)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let plan;

    try {
      plan = JSON.parse(text);
    } catch (err) {
      console.log("JSON parse error:", text);
      return res.status(500).json({ error: "Invalid JSON from AI ❌" });
    }

    res.json({ plan });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).json({ error: "AI generation failed ❌" });
  }
});


// ================= START SERVER =================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});