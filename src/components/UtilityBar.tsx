import { Link } from "react-router-dom";
import { Globe, Search, Bell } from "lucide-react";

const UtilityBar = () => {
  return (
    <div className="bg-primary text-primary-foreground text-xs py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-1 text-primary-foreground/80">
          <span>Portail Officiel de la Coopération Sanitaire France – Djibouti</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold">FR</span>
            <span className="text-primary-foreground/50">|</span>
            <span className="text-primary-foreground/60 hover:text-primary-foreground cursor-pointer">AR</span>
            <span className="text-primary-foreground/50">|</span>
            <span className="text-primary-foreground/60 hover:text-primary-foreground cursor-pointer">EN</span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <button className="hover:text-djibouti-green transition-colors" aria-label="Rechercher">
              <Search className="w-3.5 h-3.5" />
            </button>
            <button className="hover:text-djibouti-green transition-colors" aria-label="Notifications">
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilityBar;
