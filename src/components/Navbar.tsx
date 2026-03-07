import { useState } from "react";
import { Moon, Sun, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-gradient" style={{ fontFamily: "var(--font-heading)" }}>
            Empty Fridge Chef
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full glass hover:glow-border transition-all duration-300"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
