import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 15, suffix: "+", label: "Médecins formés chaque année", icon: "🩺" },
  { value: 5, suffix: "", label: "Centres de télémédecine", icon: "🏥" },
  { value: 3, suffix: "", label: "Laboratoires de recherche", icon: "🔬" },
  { value: 12, suffix: "", label: "Programmes actifs", icon: "📋" },
];

function Counter({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const id = setInterval(() => {
      n += step;
      if (n >= target) { setVal(target); clearInterval(id); }
      else setVal(n);
    }, 40);
    return () => clearInterval(id);
  }, [active, target]);
  return <>{val}{suffix}</>;
}

const StatsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative py-24 bg-gradient-to-br from-primary via-[hsl(197,65%,35%)] to-[hsl(213,50%,20%)] text-primary-foreground overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-djibouti-blue/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className="text-center mb-14">
          <p className={`text-accent font-semibold text-sm uppercase tracking-widest mb-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            Impact & Résultats
          </p>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "100ms" }}>
            Nos chiffres clés
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center group ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: isVisible ? `${200 + i * 150}ms` : "0ms" }}
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2 tabular-nums">
                <Counter target={stat.value} suffix={stat.suffix} active={isVisible} />
              </p>
              <p className="text-sm text-primary-foreground/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
