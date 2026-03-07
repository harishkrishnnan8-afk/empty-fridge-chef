import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, ChefHat, Lightbulb, RefreshCw, Copy, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Recipe } from "@/types/recipe";
import jsPDF from "jspdf";

interface RecipeCardProps {
  recipe: Recipe;
  onTryAnother: () => void;
}

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-500/20 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Hard: "bg-red-500/20 text-red-400 border-red-500/30",
};

const RecipeCard = ({ recipe, onTryAnother }: RecipeCardProps) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const copyRecipe = () => {
    const text = `${recipe.recipeName}\n\nCuisine: ${recipe.cuisine}\nDifficulty: ${recipe.difficulty}\nPrep: ${recipe.prepTime} | Cook: ${recipe.cookTime}\nServings: ${recipe.servings}\n\nIngredients:\n${recipe.ingredients.map((i) => `• ${i}`).join("\n")}\n\nSteps:\n${recipe.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nNutrition: ${recipe.nutrition.calories} cal | ${recipe.nutrition.protein} protein | ${recipe.nutrition.carbs} carbs | ${recipe.nutrition.fat} fat\n\nPro Tip: ${recipe.proTip}`;
    navigator.clipboard.writeText(text);
    toast({ title: "📋 Copied!", description: "Recipe copied to clipboard" });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(recipe.recipeName, 20, 25);
    doc.setFontSize(12);
    doc.text(`Cuisine: ${recipe.cuisine} | Difficulty: ${recipe.difficulty}`, 20, 35);
    doc.text(`Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime} | Servings: ${recipe.servings}`, 20, 42);
    doc.setFontSize(14);
    doc.text("Ingredients:", 20, 55);
    doc.setFontSize(11);
    recipe.ingredients.forEach((ing, i) => {
      doc.text(`• ${ing}`, 25, 63 + i * 7);
    });
    const stepsY = 63 + recipe.ingredients.length * 7 + 10;
    doc.setFontSize(14);
    doc.text("Steps:", 20, stepsY);
    doc.setFontSize(11);
    let currentY = stepsY + 8;
    recipe.steps.forEach((step, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${step}`, 165);
      if (currentY + lines.length * 6 > 280) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(lines, 25, currentY);
      currentY += lines.length * 6 + 2;
    });
    doc.save(`${recipe.recipeName.replace(/\s+/g, "-")}.pdf`);
    toast({ title: "📄 Downloaded!", description: "Recipe saved as PDF" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass rounded-2xl p-6 md:p-8 glow-border max-w-3xl mx-auto"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
        {recipe.recipeName}
      </h2>

      <div className="flex flex-wrap gap-2 mb-6">
        <Badge className="glass border text-primary">{recipe.cuisine}</Badge>
        <Badge className={`border ${difficultyColor[recipe.difficulty] || "border-border text-foreground"}`}>
          {recipe.difficulty}
        </Badge>
        <Badge variant="outline" className="gap-1">
          <Clock className="w-3 h-3" /> Prep: {recipe.prepTime}
        </Badge>
        <Badge variant="outline" className="gap-1">
          <Clock className="w-3 h-3" /> Cook: {recipe.cookTime}
        </Badge>
        <Badge variant="outline" className="gap-1">
          <Users className="w-3 h-3" /> {recipe.servings} servings
        </Badge>
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-primary" /> Ingredients
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recipe.ingredients.map((ing, i) => (
            <label
              key={i}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <Checkbox
                checked={checkedIngredients.has(i)}
                onCheckedChange={() => toggleIngredient(i)}
              />
              <span
                className={checkedIngredients.has(i) ? "line-through text-muted-foreground" : "text-foreground"}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {ing}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-3">📝 Instructions</h3>
        <ol className="space-y-3">
          {recipe.steps.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <p className="text-foreground pt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                {step}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Nutrition */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-3">🥗 Nutrition Info</h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="glass border border-border text-foreground">🔥 {recipe.nutrition.calories}</Badge>
          <Badge className="glass border border-border text-foreground">💪 {recipe.nutrition.protein}</Badge>
          <Badge className="glass border border-border text-foreground">🍚 {recipe.nutrition.carbs}</Badge>
          <Badge className="glass border border-border text-foreground">🧈 {recipe.nutrition.fat}</Badge>
        </div>
      </div>

      {/* Pro Tip */}
      <div className="glass rounded-xl p-4 mb-6 border border-primary/30">
        <p className="flex items-start gap-2 text-foreground" style={{ fontFamily: "var(--font-body)" }}>
          <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <span><strong>Pro Tip:</strong> {recipe.proTip}</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onTryAnother}
          className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Try Another Recipe
        </Button>
        <Button
          onClick={copyRecipe}
          variant="outline"
          className="flex-1 h-12 rounded-xl font-bold border-border hover:bg-muted"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <Copy className="w-4 h-4 mr-2" /> Copy Recipe
        </Button>
        <Button
          onClick={downloadPDF}
          variant="outline"
          className="flex-1 h-12 rounded-xl font-bold border-border hover:bg-muted"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <Download className="w-4 h-4 mr-2" /> Save PDF
        </Button>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
