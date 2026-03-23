import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, Search, User, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AdminTopBar() {
  const { profile, roles, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  const roleName =
    roles.includes("super_admin")
      ? "Super Admin"
      : roles.includes("admin")
      ? "Admin"
      : roles.includes("editor")
      ? "Éditeur"
      : "Utilisateur";

  return (
    <header
      className="h-16 border-b border-border/50 flex items-center justify-between px-4 lg:px-6 gap-4 shadow-sm"
      style={{ backgroundColor: 'hsl(var(--admin-header))', color: 'hsl(210, 20%, 90%)' }}
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-current hover:bg-white/10" />
        <div className="hidden md:flex relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
          <Input
            placeholder="Rechercher..."
            className="pl-9 h-9 bg-white/10 border-white/10 text-current placeholder:text-white/40 focus-visible:ring-white/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-current hover:bg-white/10">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center font-bold">
            3
          </span>
        </Button>

        <div className="w-px h-8 bg-white/15" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 h-10 px-2 text-current hover:bg-white/10">
              <Avatar className="h-8 w-8 border-2 border-white/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold leading-none">{profile?.full_name || "Admin"}</p>
                <p className="text-[10px] opacity-60 mt-0.5">{roleName}</p>
              </div>
              <ChevronDown className="h-3 w-3 opacity-50 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
              <User className="mr-2 h-4 w-4" /> Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
