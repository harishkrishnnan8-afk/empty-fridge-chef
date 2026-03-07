import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Priya Sharma",
    initials: "PS",
    text: "I had random veggies and leftover rice — this app turned it into restaurant-quality fried rice! My family loved it. 🍛",
  },
  {
    name: "Arjun Patel",
    initials: "AP",
    text: "As a college student, this is a lifesaver. No more wasting food or ordering takeout. Every recipe has been amazing! 🎓",
  },
  {
    name: "Meera Krishnan",
    initials: "MK",
    text: "The South Indian recipes are so authentic! Made perfect dosa with just ingredients I had at home. My mom was impressed. 😍",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-gradient mb-14"
        >
          What People Are Saying
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-2xl p-6 hover:glow-border transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="font-bold text-foreground">{t.name}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                "{t.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
