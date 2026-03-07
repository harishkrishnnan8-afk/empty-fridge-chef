import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients, cuisine, difficulty } = await req.json();

    if (!ingredients || !ingredients.trim()) {
      return new Response(JSON.stringify({ error: "Ingredients are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ✅ GROQ_API_KEY is read from Supabase secrets — never sent to the browser
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY not configured on server.");

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

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
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

      if (groqResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (groqResponse.status === 401) {
        return new Response(JSON.stringify({ error: "Invalid API key on server." }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI service error");
    }

    const data = await groqResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No response from AI");

    // Strip markdown code fences if present
    let cleaned = content.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const recipe = JSON.parse(cleaned);

    return new Response(JSON.stringify(recipe), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-recipe error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Failed to generate recipe" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
