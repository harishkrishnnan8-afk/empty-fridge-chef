import { motion } from "framer-motion";

const steps = [
  { emoji: "🥕", title: "Add Ingredients", desc: "Type what you have in your fridge" },
  { emoji: "🍜", title: "Choose Cuisine", desc: "Pick your preferred cuisine style" },
  { emoji: "📖", title: "Get Recipe", desc: "AI generates a perfect recipe for you" },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-gradient mb-14"
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass rounded-2xl p-8 text-center hover:glow-border transition-all duration-500"
            >
              <div className="text-5xl mb-4">{step.emoji}</div>
              <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                {step.desc}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-2xl text-primary">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
