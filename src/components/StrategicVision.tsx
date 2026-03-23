import { GraduationCap, Building2, FlaskConical, HeartPulse, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const axes = [
  {
    icon: GraduationCap,
    title: "Éducation Médicale",
    description: "Programmes de formation spécialisée pour les professionnels de santé djiboutiens en partenariat avec les CHU français.",
    gradient: "from-djibouti-blue to-primary",
    iconBg: "bg-djibouti-blue/10",
    iconColor: "text-djibouti-blue",
    number: "01",
  },
  {
    icon: Building2,
    title: "Infrastructure Hospitalière",
    description: "Modernisation des équipements et développement des capacités hospitalières à travers le pays.",
    gradient: "from-djibouti-green to-accent",
    iconBg: "bg-djibouti-green/10",
    iconColor: "text-djibouti-green",
    number: "02",
  },
  {
    icon: FlaskConical,
    title: "Recherche Clinique",
    description: "Projets de recherche conjoints sur les maladies tropicales et la santé publique régionale.",
    gradient: "from-djibouti-red to-destructive",
    iconBg: "bg-djibouti-red/10",
    iconColor: "text-djibouti-red",
    number: "03",
  },
  {
    icon: HeartPulse,
    title: "Santé Publique",
    description: "Renforcement des politiques de prévention, vaccination et surveillance épidémiologique.",
    gradient: "from-primary to-djibouti-blue",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    number: "04",
  },
];

const StrategicVision = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/50 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-[1fr,2fr] gap-16 items-start">
          {/* Left - Title */}
          <div className={`lg:sticky lg:top-32 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-accent font-bold text-sm uppercase tracking-[0.2em] mb-3">Notre Mission</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-tight">
              Vision
              <br />
              <span className="text-primary">Stratégique</span>
            </h2>
            <div className="w-16 h-1.5 bg-gradient-to-r from-accent to-primary rounded-full mb-6" />
            <p className="text-muted-foreground text-lg leading-relaxed">
              Quatre axes fondamentaux guidant notre partenariat pour un système de santé plus fort et plus équitable.
            </p>
          </div>

          {/* Right - Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {axes.map((axe, i) => (
              <div
                key={axe.title}
                className={`group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/30 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: isVisible ? `${i * 150}ms` : "0ms" }}
              >
                {/* Number */}
                <span className="absolute top-6 right-6 text-5xl font-bold text-border/50 group-hover:text-primary/10 transition-colors">{axe.number}</span>
                
                <div className={`w-14 h-14 rounded-xl ${axe.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <axe.icon className={`w-7 h-7 ${axe.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{axe.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{axe.description}</p>
                
                {/* Bottom gradient line on hover */}
                <div className={`h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${axe.gradient} transition-all duration-500 rounded-full`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategicVision;
