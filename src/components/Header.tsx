import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import flagsCrossed from "@/assets/flags-crossed.png";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Vision Stratégique", href: "/programmes" },
  { label: "Programmes", href: "/programmes" },
  { label: "Calendrier", href: "/calendrier" },
  { label: "Publications", href: "/publications" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { session, isAdmin } = useAuth();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleAdminClick = () => {
    if (session && isAdmin) {
      navigate("/admin");
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-4 group">
          <img src={flagsCrossed} alt="Drapeaux croisés Djibouti et France" className="w-16 h-auto object-contain" />
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Ministère de la Santé
            </span>
            <span className="text-sm md:text-base font-bold text-primary leading-tight block">
              Portail Santé France – Djibouti
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
                  isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAdminClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            aria-label="Administration"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden md:inline">Admin</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-foreground/70 hover:text-primary hover:bg-secondary transition-colors"
            aria-label="Changer le thème"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            className="lg:hidden p-2 text-foreground rounded-md hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden bg-background border-t border-border px-4 pb-4 animate-fade-in">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 text-sm font-semibold uppercase tracking-wide border-b border-border/50 last:border-0 transition-colors ${
                  isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={() => { setMobileOpen(false); handleAdminClick(); }}
            className="flex items-center gap-2 w-full py-3 text-sm font-semibold uppercase tracking-wide text-primary"
          >
            <ShieldCheck className="w-4 h-4" />
            Administration
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
