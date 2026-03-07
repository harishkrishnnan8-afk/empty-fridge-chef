import { motion } from "framer-motion";

const emojis = ["🍳", "🥚", "🧅", "🍅", "🧄", "🥕", "🍞", "🧀", "🌶️", "🥦"];

const FloatingEmojis = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {emojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl md:text-5xl opacity-20"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [
              `${20 + Math.random() * 60}%`,
              `${10 + Math.random() * 40}%`,
              `${30 + Math.random() * 50}%`,
            ],
            x: [
              `${10 + Math.random() * 80}%`,
              `${20 + Math.random() * 60}%`,
              `${10 + Math.random() * 80}%`,
            ],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingEmojis;
