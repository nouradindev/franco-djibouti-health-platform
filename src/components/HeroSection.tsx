import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Stethoscope, Users, Building, Globe2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-cooperation.jpg";
import flagsCrossed from "@/assets/flags-crossed.png";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const id = setInterval(() => {
      n += step;
      if (n >= target) { setCount(target); clearInterval(id); } else setCount(n);
    }, 40);
    return () => clearInterval(id);
  }, [target]);
  return <>{count}{suffix}</>;
}

const highlights = [
  { icon: Stethoscope, label: "Formation Médicale", color: "text-primary" },
  { icon: Building, label: "Infrastructures", color: "text-accent" },
  { icon: Users, label: "Partenariats", color: "text-djibouti-blue" },
  { icon: Globe2, label: "Recherche", color: "text-djibouti-red" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" as const } },
};

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <>
      <section className="relative bg-gradient-to-br from-[hsl(197,80%,92%)] via-[hsl(197,60%,95%)] to-[hsl(150,40%,96%)] overflow-hidden">
        {/* Animated blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/6 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-accent/6 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-djibouti-blue/5 blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          {/* Floating dots */}
          <motion.div
            className="absolute top-24 right-[20%] w-3 h-3 rounded-full bg-accent/40"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-52 right-[30%] w-2 h-2 rounded-full bg-primary/30"
            animate={{ y: [0, -15, 0], x: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-40 left-[8%] w-4 h-4 rounded-full bg-djibouti-green/25"
            animate={{ y: [0, -25, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-16 md:py-24 lg:py-28">
          <motion.div
            className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Left */}
            <div>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-primary/15 rounded-full px-5 py-2 mb-8 shadow-sm">
                <motion.span
                  className="w-2 h-2 rounded-full bg-accent"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Portail Officiel</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground leading-[1.05] mb-7"
              >
                France – Djibouti
                <br />
                <motion.span
                  className="bg-gradient-to-r from-[hsl(var(--accent))] via-[hsl(150,50%,40%)] to-[hsl(var(--primary))] bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Coopération Sanitaire
                </motion.span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-muted-foreground text-base md:text-lg max-w-lg mb-10 leading-relaxed">
                Un partenariat diplomatique durable dédié à l'excellence médicale, la sécurité
                sanitaire régionale et le renforcement des capacités dans la Corne de l'Afrique.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-14">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 uppercase tracking-wide text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300" asChild>
                  <Link to="/programmes">
                    Voir la Vision Stratégique
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-bold px-8 uppercase tracking-wide text-sm hover:-translate-y-1 transition-all duration-300" asChild>
                  <Link to="/programmes">Explorer les Programmes</Link>
                </Button>
              </motion.div>

              {/* Highlight icons */}
              <motion.div variants={fadeUp} className="flex gap-5">
                {highlights.map((h, i) => (
                  <motion.div
                    key={h.label}
                    className="flex items-center gap-2 group cursor-default"
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/70 shadow-sm border border-border/50 flex items-center justify-center group-hover:shadow-md transition-shadow">
                      <h.icon className={`w-4.5 h-4.5 ${h.color}`} />
                    </div>
                    <span className="text-xs font-semibold text-foreground/60 hidden lg:block">{h.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right - Image */}
            <motion.div variants={scaleIn} className="flex justify-center md:justify-end">
              <div className="relative">
                {/* Background shapes */}
                <motion.div
                  className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/15 via-accent/10 to-transparent blur-md"
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute -bottom-5 -right-5 w-36 h-36 bg-accent/10 rounded-3xl rotate-6" />
                <div className="absolute -top-5 -left-5 w-28 h-28 bg-primary/8 rounded-3xl -rotate-6" />

                {/* Main image */}
                <motion.div
                  className="relative rounded-2xl overflow-hidden shadow-2xl w-full ring-1 ring-white/30"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <img
                    src={heroImage}
                    alt="Coopération sanitaire France-Djibouti"
                    className="w-full object-cover object-top aspect-[4/3]"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                </motion.div>

                {/* Floating flags badge */}
                <motion.div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-xl p-2 border border-border"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img src={flagsCrossed} alt="Drapeaux croisés" className="w-14 h-auto" />
                </motion.div>

                {/* Floating stat card */}
                <motion.div
                  className="absolute -bottom-6 -left-8 bg-card rounded-xl shadow-xl px-6 py-4 border border-border backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <p className="text-xs text-muted-foreground font-medium">Partenariat depuis</p>
                  <p className="text-2xl font-extrabold text-primary">1977</p>
                </motion.div>

                {/* Floating mini card */}
                <motion.div
                  className="absolute -bottom-4 -right-6 bg-accent text-accent-foreground rounded-lg shadow-lg px-4 py-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <p className="text-xs font-bold">12+ Programmes</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          className="border-t border-primary/10 bg-white/40 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: 15, suffix: "+", label: "Médecins formés / an" },
                { value: 5, suffix: "", label: "Centres de télémédecine" },
                { value: 3, suffix: "", label: "Laboratoires de recherche" },
                { value: 12, suffix: "", label: "Programmes actifs" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-extrabold text-primary tabular-nums">
                    {loaded && <AnimatedCounter target={stat.value} suffix={stat.suffix} />}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Partners strip */}
      <section className="py-5 bg-background border-b border-border overflow-hidden">
        <motion.div
          className="container mx-auto px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-8 md:gap-14 text-muted-foreground/40 text-[11px] uppercase tracking-[0.2em] font-bold">
            <span>Ministère de la Santé</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>OMS</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>CHU France</span>
            <span className="w-1 h-1 rounded-full bg-border hidden sm:block" />
            <span className="hidden sm:block">Institut Pasteur</span>
            <span className="w-1 h-1 rounded-full bg-border hidden md:block" />
            <span className="hidden md:block">Croix-Rouge</span>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default HeroSection;
