import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const PartnersSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-secondary/30 via-background to-secondary/20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className={`max-w-4xl mx-auto text-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Ensemble pour la santé</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Un partenariat
            <br />
            <span className="text-primary">durable et engagé</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            La coopération sanitaire entre la France et Djibouti repose sur des valeurs partagées de solidarité, d'excellence médicale et d'innovation au service des populations.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 px-8"
              asChild
            >
              <Link to="/programmes">
                Découvrir nos Programmes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-0.5 px-8"
              asChild
            >
              <Link to="/contact">Nous Contacter</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
