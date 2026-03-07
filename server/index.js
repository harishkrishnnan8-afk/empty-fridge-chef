import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env from project root
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors({ origin: ["http://localhost:8080", "http://localhost:5173"] }));
app.use(express.json());

app.post("/api/generate-recipe", async (req, res) => {
  const { ingredients, cuisine, difficulty } = req.body;

  if (!ingredients || !ingredients.trim()) {
    return res.status(400).json({ error: "Ingredients are required." });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set in environment variables.");
    return res.status(500).json({ error: "Server misconfiguration: GROQ_API_KEY not set." });
  }

  const cuisineNote = cuisine && cuisine !== "any" ? ` Prefer ${cuisine} cuisine.` : "";
  const difficultyNote = difficulty && difficulty !== "any" ? ` Difficulty level: ${difficulty}.` : "";

  const systemPrompt =
    `You are a professional chef. The user gives you ingredients they have at home. ` +
    `Generate a detailed recipe using ONLY those ingredients (plus basic pantry staples like salt, pepper, oil, water). ` +
    `Return ONLY a valid JSON object with these exact fields: ` +
    `recipeName (string), cuisine (string), difficulty (string - Easy/Medium/Hard), ` +
    `prepTime (string like "10 mins"), cookTime (string like "20 mins"), servings (number), ` +
    `ingredients (array of strings with quantities), steps (array of strings - detailed instructions), ` +
    `nutrition (object with calories, protein, carbs, fat as strings like "350 kcal"), ` +
    `proTip (string - a helpful cooking tip).` +
    `${cuisineNote}${difficultyNote} Return ONLY valid JSON, no markdown, no code blocks.`;

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `My ingredients: ${ingredients.trim()}` },
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errText);

      let errorMessage = "AI service error. Please try again.";
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error?.message) {
          errorMessage = `AI Error: ${errJson.error.message}`;
        }
      } catch (e) {
        // Not JSON
      }

      if (groqResponse.status === 429) {
        return res.status(429).json({ error: "Too many requests. Please wait a moment and try again." });
      }
      if (groqResponse.status === 401) {
        return res.status(401).json({ error: "Invalid API key. Please check your GROQ_API_KEY." });
      }
      return res.status(groqResponse.status).json({ error: errorMessage });
    }

    const data = await groqResponse.json();
    const content = data.choices?.[0]?.message?.content;

    // Extract JSON from AI response (handles Groq sometimes adding text before/after)
    if (!content) {
      return res.status(500).json({ error: "No response received from AI." });
    }

    let cleaned = content.trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    try {
      const recipe = JSON.parse(cleaned);
      return res.json(recipe);
    } catch (parseErr) {
      console.error("Failed to parse recipe JSON:", cleaned);
      return res.status(500).json({ error: "AI returned invalid recipe format. Please try again." });
    }
  } catch (err) {
    console.error("generate-recipe error:", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to generate recipe. Please try again.",
    });
  }
});

// Global error handler to ensure JSON response
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`\n🚀 Backend API server running at http://localhost:${PORT}`);
  console.log(`   POST /api/generate-recipe  — Groq-powered recipe generator`);
  console.log(`   GET  /api/health           — Health check\n`);
});
