import { motion } from "framer-motion";
import FloatingEmojis from "./FloatingEmojis";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeroSectionProps {
  ingredients: string;
  setIngredients: (v: string) => void;
  cuisine: string;
  setCuisine: (v: string) => void;
  difficulty: string;
  setDifficulty: (v: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const HeroSection = ({
  ingredients,
  setIngredients,
  cuisine,
  setCuisine,
  difficulty,
  setDifficulty,
  onGenerate,
  isLoading,
}: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
      <FloatingEmojis />
      <div className="relative z-10 max-w-3xl w-full mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-gradient"
        >
          What's In Your Fridge?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Type your ingredients — get a real recipe in seconds
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass rounded-2xl p-6 md:p-8 glow-border space-y-5"
        >
          <Textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g. eggs, onion, tomato, rice, cheese..."
            className="min-h-[120px] bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground text-base md:text-lg resize-none rounded-xl focus:ring-primary"
            style={{ fontFamily: "var(--font-body)" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select value={cuisine} onValueChange={setCuisine}>
              <SelectTrigger className="bg-background/50 border-border/50 h-12 rounded-xl">
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="any">Any Cuisine</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="south-indian">South Indian</SelectItem>
                <SelectItem value="north-indian">North Indian</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
                <SelectItem value="continental">Continental</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
              </SelectContent>
            </Select>

            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="bg-background/50 border-border/50 h-12 rounded-xl">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="any">Any Difficulty</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={onGenerate}
            disabled={isLoading || !ingredients.trim()}
            className="w-full h-14 text-lg font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_hsla(42,92%,63%,0.4)] disabled:opacity-50 disabled:hover:scale-100"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            👨‍🍳 Cook Something!
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
