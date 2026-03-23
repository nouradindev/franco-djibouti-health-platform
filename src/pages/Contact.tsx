import { useState } from "react";
import Layout from "@/components/Layout";
import { MapPin, Phone, Mail, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      {/* Page Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-djibouti-blue/80 text-primary-foreground py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full bg-djibouti-green blur-3xl" />
          <div className="absolute bottom-0 left-20 w-56 h-56 rounded-full bg-djibouti-blue blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-djibouti-green font-semibold text-sm uppercase tracking-widest mb-3">Nous Contacter</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Contact</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl leading-relaxed">
            Pour toute question ou demande de partenariat, n'hésitez pas à nous écrire.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4" ref={ref}>
          <div className={`grid grid-cols-1 lg:grid-cols-5 gap-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Coordonnées</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">Adresse</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ambassade de France à Djibouti<br />
                        Plateau du Serpent, B.P. 2039<br />
                        République de Djibouti
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">Téléphone</h3>
                      <p className="text-sm text-muted-foreground mt-1">+253 21 35 25 03</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">Email</h3>
                      <p className="text-sm text-muted-foreground mt-1">cooperation.sante@diplomatie.gouv.fr</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">Horaires</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Dimanche — Jeudi<br />
                        08h00 — 16h00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-foreground mb-2">Envoyez-nous un message</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Nom complet</label>
                      <Input
                        required
                        maxLength={100}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Votre nom"
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                      <Input
                        type="email"
                        required
                        maxLength={255}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="votre@email.com"
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Sujet</label>
                    <Input
                      required
                      maxLength={200}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="L'objet de votre message"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                    <Textarea
                      required
                      maxLength={2000}
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Décrivez votre demande..."
                      className="bg-background resize-none"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer le Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
