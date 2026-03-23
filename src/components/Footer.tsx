import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-5 rounded-sm overflow-hidden flex shadow">
                  <div className="w-1/3 bg-[hsl(225,70%,50%)]" />
                  <div className="w-1/3 bg-white" />
                  <div className="w-1/3 bg-[hsl(0,80%,50%)]" />
                </div>
                <div className="w-7 h-5 rounded-sm overflow-hidden flex flex-col shadow">
                  <div className="h-1/2 bg-djibouti-blue" />
                  <div className="h-1/2 bg-djibouti-green" />
                </div>
              </div>
            </div>
            <p className="font-bold text-sm mb-3">Coopération Sanitaire<br />France — Djibouti</p>
            <p className="text-xs text-primary-foreground/60 leading-relaxed">
              Un partenariat au service de la santé publique, unissant l'expertise française et l'engagement djiboutien.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2.5 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-djibouti-green transition-colors">Accueil</Link></li>
              <li><Link to="/programmes" className="hover:text-djibouti-green transition-colors">Programmes</Link></li>
              <li><Link to="/calendrier" className="hover:text-djibouti-green transition-colors">Calendrier</Link></li>
              <li><Link to="/publications" className="hover:text-djibouti-green transition-colors">Publications</Link></li>
              <li><Link to="/contact" className="hover:text-djibouti-green transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Liens Institutionnels */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Liens Institutionnels</h3>
            <ul className="space-y-2.5 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-djibouti-green transition-colors">Ministère de la Santé — France</a></li>
              <li><a href="#" className="hover:text-djibouti-green transition-colors">Ministère de la Santé — Djibouti</a></li>
              <li><a href="#" className="hover:text-djibouti-green transition-colors">Ambassade de France</a></li>
              <li><a href="#" className="hover:text-djibouti-green transition-colors">OMS</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Contact</h3>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-djibouti-green" />
                <span>Plateau du Serpent, B.P. 2039<br />Djibouti</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-djibouti-green" />
                <span>+253 21 35 25 03</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-djibouti-green" />
                <span className="text-xs">cooperation.sante@diplomatie.gouv.fr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-primary-foreground/40">
          <span>© 2024 Coopération Sanitaire France-Djibouti. Tous droits réservés.</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-primary-foreground transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
