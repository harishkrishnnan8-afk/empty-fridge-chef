import { ChefHat } from "lucide-react";

const Footer = () => (
  <footer className="py-10 px-4 border-t border-border">
    <div className="max-w-5xl mx-auto text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <ChefHat className="w-6 h-6 text-primary" />
        <span className="text-lg font-bold text-gradient" style={{ fontFamily: "var(--font-heading)" }}>
          Empty Fridge Chef
        </span>
      </div>
      <p className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
        Never waste food again 🌱
      </p>
    </div>
  </footer>
);

export default Footer;
