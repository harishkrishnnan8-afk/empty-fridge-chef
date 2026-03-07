import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat } from "lucide-react";

const loadingTexts = [
  "Checking your fridge... 🧊",
  "Consulting the recipe gods... 🙏",
  "Almost ready to cook! 🔥",
  "Mixing flavors together... 🥘",
  "Channeling Gordon Ramsay... 👨‍🍳",
];

const LoadingState = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((i) => (i + 1) % loadingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-20 gap-6"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <ChefHat className="w-16 h-16 text-primary" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p
          key={textIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl text-muted-foreground"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {loadingTexts[textIndex]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

export default LoadingState;
