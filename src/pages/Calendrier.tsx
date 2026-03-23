import Layout from "@/components/Layout";
import Timeline from "@/components/Timeline";

const Calendrier = () => {
  return (
    <Layout>
      {/* Page Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-djibouti-blue/80 text-primary-foreground py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-djibouti-blue blur-3xl" />
          <div className="absolute bottom-10 right-20 w-56 h-56 rounded-full bg-djibouti-green blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-djibouti-green font-semibold text-sm uppercase tracking-widest mb-3">Jalons Clés</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Calendrier</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl leading-relaxed">
            Les étapes majeures de notre coopération sanitaire bilatérale entre la France et Djibouti.
          </p>
        </div>
      </section>

      <Timeline />
    </Layout>
  );
};

export default Calendrier;
