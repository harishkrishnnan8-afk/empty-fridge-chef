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

app.use(cors()); // Allow all origins in dev for easier local testing
app.use(express.json());

app.post("/api/generate-recipe", async (req, res) => {
  const { ingredients, cuisine, difficulty } = req.body;

  if (!ingredients || !ingredients.trim()) {
    console.error("❌ Rejected: Missing ingredients");
    return res.status(400).json({ error: "Ingredients are required." });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY is missing from .env");
    return res.status(500).json({ error: "Server misconfiguration: GROQ_API_KEY not found." });
  }

  const cuisineNote = cuisine && cuisine !== "any" ? ` Prefer ${cuisine} cuisine.` : "";
  const difficultyNote = difficulty && difficulty !== "any" ? ` Difficulty level: ${difficulty}.` : "";

  const systemPrompt =
    `You are a professional chef. Generate a detailed recipe using the provided ingredients. ` +
    `Return ONLY a valid JSON object. Do not include markdown code blocks, do not include any text before or after the JSON. ` +
    `Fields required: recipeName, cuisine, difficulty (Easy/Medium/Hard), prepTime, cookTime, servings (number), ingredients (array), steps (array), nutrition (object with calories, protein, carbs, fat), proTip.` +
    `${cuisineNote}${difficultyNote}`;

  console.log(`\n🍳 Recipe Request: "${ingredients.trim()}"`);
  console.log(`   Options: ${cuisine} cuisine, ${difficulty} difficulty`);

  try {
    console.log("   -> Contacting Groq AI...");
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
          { role: "user", content: `Ingredients: ${ingredients.trim()}` },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error(`❌ Groq API Error (${groqResponse.status}):`, errText);

      let msg = "AI service error. Please try again.";
      try {
        const errJson = JSON.parse(errText);
        msg = errJson.error?.message || msg;
      } catch (e) { }

      return res.status(groqResponse.status).json({ error: msg });
    }

    const data = await groqResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("❌ AI returned empty response");
      return res.status(500).json({ error: "No response from AI service." });
    }

    // Extraction logic for robustness
    let cleaned = content.trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    try {
      const recipe = JSON.parse(cleaned);
      console.log("   ✅ Recipe generated successfully!");
      return res.json(recipe);
    } catch (parseErr) {
      console.error("❌ Failed to parse AI response as JSON:", cleaned);
      return res.status(500).json({ error: "AI returned invalid format. Please try again." });
    }
  } catch (err) {
    console.error("❌ Server Error:", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error during generation.",
    });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global error handler:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 Backend running at http://127.0.0.1:${PORT}`);
    console.log(`   Health check: http://127.0.0.1:${PORT}/api/health\n`);
  });
}

// Export for Vercel
export default app;
