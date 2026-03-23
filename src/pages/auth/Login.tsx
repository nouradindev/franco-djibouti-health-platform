import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Mail, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import flagsCrossed from "@/assets/flags-crossed.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Connexion réussie");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex bg-primary relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/[0.06]"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.15, ease: "easeOut" }}
          className="absolute -bottom-16 -left-16 w-[350px] h-[350px] rounded-full bg-white/[0.06]"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-white/[0.05]"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="absolute top-1/3 left-[15%] w-48 h-48 rounded-full bg-accent/10"
        />
      </div>

      {/* Left panel - Welcome text */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="hidden lg:flex lg:w-1/2 items-center justify-center relative z-10"
      >
        <div className="max-w-md px-12">
          <img src={flagsCrossed} alt="Logo" className="w-20 h-auto mb-10 drop-shadow-2xl" />
          <h1 className="text-5xl font-bold text-white tracking-tight mb-4 uppercase">
            Bienvenue
          </h1>
          <p className="text-xl text-white/80 font-semibold mb-6">
            Portail Santé France – Djibouti
          </p>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Plateforme de gestion des programmes de coopération sanitaire, publications et événements institutionnels entre la France et Djibouti.
          </p>
        </div>
      </motion.div>

      {/* Right panel - Login card */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-[420px]"
        >
          <div className="bg-card rounded-3xl shadow-2xl shadow-black/20 p-8 md:p-10 border border-border/30">
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-6">
              <img src={flagsCrossed} alt="Logo" className="w-14 h-auto" />
            </div>

            {/* Avatar icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground text-center mb-1">Connexion</h2>
            <p className="text-muted-foreground text-sm text-center mb-8">
              Entrez vos identifiants pour accéder à l'administration
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-12 h-12 rounded-xl bg-muted/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all uppercase tracking-wider"
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {loading ? "Connexion…" : "Se connecter"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
            </div>

            {/* Back to site */}
            <div className="text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2 transition-colors group"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Retour au site public
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
