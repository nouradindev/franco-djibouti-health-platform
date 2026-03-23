import Layout from "@/components/Layout";
import FlagshipPrograms from "@/components/FlagshipPrograms";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Programmes = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <Layout>
      {/* Page Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-djibouti-green/80 text-primary-foreground py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-djibouti-green blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-djibouti-blue blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-djibouti-green font-semibold text-sm uppercase tracking-widest mb-3">Initiatives Collaboratives</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Nos Programmes</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl leading-relaxed">
            Des initiatives stratégiques au service du changement systémique dans l'infrastructure sanitaire nationale de Djibouti.
          </p>
        </div>
      </section>

      <FlagshipPrograms />

      {/* Call to Action */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center" ref={ref}>
          <div className={`max-w-2xl mx-auto ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Vous souhaitez participer ?
            </h2>
            <p className="text-muted-foreground mb-6">
              Rejoignez nos programmes de coopération et contribuez à l'amélioration du système de santé.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Nous Contacter
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Programmes;
