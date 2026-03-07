import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "@/hooks/use-toast";
import { Recipe } from "@/types/recipe";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LoadingState from "@/components/LoadingState";
import RecipeCard from "@/components/RecipeCard";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("any");
  const [difficulty, setDifficulty] = useState("any");
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const generateRecipe = async () => {
    if (!ingredients.trim()) return;
    setIsLoading(true);
    setRecipe(null);

    try {
      // ✅ Calls our secure backend — GROQ_API_KEY never reaches the browser
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredients.trim(),
          cuisine: cuisine === "any" ? "any" : cuisine,
          difficulty: difficulty === "any" ? "any" : difficulty,
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error("Server returned non-JSON response:", text);
        throw new Error(`Invalid server response. Please check your backend logs.`);
      }

      if (!res.ok || data?.error) {
        throw new Error(data?.error || `Server error: ${res.status}`);
      }

      setRecipe(data as Recipe);

      // Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f7c948", "#ff9f1c", "#ffffff"],
      });

      toast({ title: "Your recipe is ready! 🎉", description: data.recipeName });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err: any) {
      console.error("Recipe generation error:", err);
      toast({
        title: "Oops! Something went wrong 😅",
        description: err?.message || "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAnother = () => {
    setRecipe(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection
        ingredients={ingredients}
        setIngredients={setIngredients}
        cuisine={cuisine}
        setCuisine={setCuisine}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        onGenerate={generateRecipe}
        isLoading={isLoading}
      />

      <div ref={resultRef} className="px-4 pb-10">
        <AnimatePresence mode="wait">
          {isLoading && <LoadingState key="loading" />}
          {recipe && !isLoading && (
            <RecipeCard key="recipe" recipe={recipe} onTryAnother={handleTryAnother} />
          )}
        </AnimatePresence>
      </div>

      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
