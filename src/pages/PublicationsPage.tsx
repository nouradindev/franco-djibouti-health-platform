import Layout from "@/components/Layout";
import Publications from "@/components/Publications";

const PublicationsPage = () => {
  return (
    <Layout>
      {/* Page Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-djibouti-green/70 text-primary-foreground py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/2 w-80 h-80 rounded-full bg-djibouti-green blur-3xl" />
          <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-djibouti-blue blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-djibouti-green font-semibold text-sm uppercase tracking-widest mb-3">Ressources</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Publications</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl leading-relaxed">
            Rapports, communiqués et études issus de notre coopération bilatérale en santé.
          </p>
        </div>
      </section>

      <Publications />
    </Layout>
  );
};

export default PublicationsPage;
