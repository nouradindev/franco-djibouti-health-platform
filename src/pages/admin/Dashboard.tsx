import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Activity,
  Eye,
  Clock,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BarChart3,
} from "lucide-react";

const useStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [programs, publications, events, users] = await Promise.all([
        supabase.from("programs").select("id, created_at", { count: "exact", head: false }),
        supabase.from("publications").select("id, created_at", { count: "exact", head: false }),
        supabase.from("events").select("id, event_date", { count: "exact", head: false }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const programsThisMonth = programs.data?.filter(p => p.created_at >= monthStart).length ?? 0;
      const pubsThisMonth = publications.data?.filter(p => p.created_at >= monthStart).length ?? 0;
      const upcomingEvents = events.data?.filter(e => e.event_date >= now.toISOString()).length ?? 0;

      return {
        programs: { total: programs.count ?? 0, change: programsThisMonth > 0 ? `+${programsThisMonth} ce mois` : "Aucun ce mois" },
        publications: { total: publications.count ?? 0, change: pubsThisMonth > 0 ? `+${pubsThisMonth} ce mois` : "Aucune ce mois" },
        events: { total: events.count ?? 0, change: upcomingEvents > 0 ? `${upcomingEvents} à venir` : "Aucun à venir" },
        users: { total: users.count ?? 0 },
      };
    },
  });
};

interface RecentItem {
  text: string;
  time: string;
  icon: typeof FileText;
  status: string;
}

const useRecentActivity = () => {
  return useQuery({
    queryKey: ["admin-recent-activity"],
    queryFn: async () => {
      const [programs, publications, events] = await Promise.all([
        supabase.from("programs").select("title, updated_at, created_at").order("updated_at", { ascending: false }).limit(5),
        supabase.from("publications").select("title, updated_at, created_at").order("updated_at", { ascending: false }).limit(5),
        supabase.from("events").select("title, updated_at, created_at").order("updated_at", { ascending: false }).limit(5),
      ]);

      const items: RecentItem[] = [];

      programs.data?.forEach(p => {
        const isNew = p.created_at === p.updated_at;
        items.push({
          text: `${isNew ? "Programme créé" : "Programme modifié"} : ${p.title}`,
          time: p.updated_at,
          icon: BookOpen,
          status: isNew ? "new" : "update",
        });
      });

      publications.data?.forEach(p => {
        const isNew = p.created_at === p.updated_at;
        items.push({
          text: `${isNew ? "Publication ajoutée" : "Publication modifiée"} : ${p.title}`,
          time: p.updated_at,
          icon: FileText,
          status: isNew ? "success" : "update",
        });
      });

      events.data?.forEach(e => {
        const isNew = e.created_at === e.updated_at;
        items.push({
          text: `${isNew ? "Événement créé" : "Événement modifié"} : ${e.title}`,
          time: e.updated_at,
          icon: Calendar,
          status: isNew ? "new" : "update",
        });
      });

      items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

      return items.slice(0, 8).map(i => ({
        ...i,
        time: formatRelativeTime(i.time),
      }));
    },
  });
};

const formatRelativeTime = (dateStr: string) => {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  if (days < 30) return `Il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString("fr-FR");
};

const getStats = (data: ReturnType<typeof useStats>["data"]) => [
  {
    label: "Programmes",
    value: String(data?.programs.total ?? "—"),
    icon: BookOpen,
    change: data?.programs.change ?? "",
    trend: "up" as const,
    gradient: "from-primary/10 to-primary/5",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
  {
    label: "Publications",
    value: String(data?.publications.total ?? "—"),
    icon: FileText,
    change: data?.publications.change ?? "",
    trend: "up" as const,
    gradient: "from-accent/10 to-accent/5",
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
    borderColor: "border-accent/20",
  },
  {
    label: "Événements",
    value: String(data?.events.total ?? "—"),
    icon: Calendar,
    change: data?.events.change ?? "",
    trend: "neutral" as const,
    gradient: "from-destructive/10 to-destructive/5",
    iconBg: "bg-destructive/15",
    iconColor: "text-destructive",
    borderColor: "border-destructive/20",
  },
  {
    label: "Utilisateurs",
    value: String(data?.users.total ?? "—"),
    icon: Users,
    change: "Actifs",
    trend: "neutral" as const,
    gradient: "from-secondary/40 to-secondary/20",
    iconBg: "bg-secondary",
    iconColor: "text-secondary-foreground",
    borderColor: "border-border",
  },
];

const quickActions = [
  { label: "Ajouter un programme", desc: "Créer un nouveau programme", icon: BookOpen, href: "/admin/programs", color: "group-hover:bg-primary/10 group-hover:text-primary" },
  { label: "Nouvelle publication", desc: "Publier un document", icon: FileText, href: "/admin/publications", color: "group-hover:bg-accent/10 group-hover:text-accent" },
  { label: "Créer un événement", desc: "Ajouter au calendrier", icon: Calendar, href: "/admin/calendar", color: "group-hover:bg-destructive/10 group-hover:text-destructive" },
  { label: "Voir le site", desc: "Ouvrir le portail public", icon: Eye, href: "/", external: true, color: "group-hover:bg-secondary group-hover:text-secondary-foreground" },
];

const statusIcon = (status: string) => {
  switch (status) {
    case "success": return <CheckCircle2 className="h-3.5 w-3.5 text-accent" />;
    case "new": return <Sparkles className="h-3.5 w-3.5 text-primary" />;
    default: return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
  }
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
} as const;

const Dashboard = () => {
  const { profile, roles } = useAuth();
  const { data: statsData } = useStats();
  const { data: recentActivities = [] } = useRecentActivity();
  const stats = getStats(statsData);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <AdminLayout>
      <motion.div
        className="space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Welcome Banner */}
        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent p-6 md:p-8 text-primary-foreground"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 opacity-80" />
              <span className="text-xs font-medium opacity-80 uppercase tracking-wider">Tableau de bord</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {greeting()}, {profile?.full_name || "Administrateur"} 👋
            </h1>
            <p className="text-sm opacity-80 mt-2 max-w-lg">
              Bienvenue sur votre espace d'administration du Portail Santé France – Djibouti. Gérez vos contenus en toute simplicité.
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} variants={item}>
              <Card className={`relative overflow-hidden border ${stat.borderColor} hover:shadow-lg transition-all duration-300 group cursor-default`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardContent className="p-5 relative">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                    </div>
                    <div className={`p-2.5 rounded-xl ${stat.iconBg} ${stat.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    {stat.trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-accent" />}
                    {stat.trend === "neutral" && <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />}
                    <span className={`text-xs font-medium ${stat.trend === "up" ? "text-accent" : "text-muted-foreground"}`}>
                      {stat.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      Activité récente
                    </CardTitle>
                    <CardDescription className="mt-1">Les dernières modifications sur le portail</CardDescription>
                  </div>
                  <Link to="/admin/settings" className="text-xs text-primary hover:underline flex items-center gap-1">
                    Tout voir <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {recentActivities.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Aucune activité récente</p>
                  ) : recentActivities.map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors group/item"
                    >
                      <div className="relative">
                        <div className="p-2 rounded-xl bg-muted group-hover/item:bg-background transition-colors">
                          <activity.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5">
                          {statusIcon(activity.status)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground font-medium truncate">{activity.text}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-accent/10">
                    <Sparkles className="h-4 w-4 text-accent" />
                  </div>
                  Actions rapides
                </CardTitle>
                <CardDescription className="mt-1">Accès direct aux fonctions clés</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action) => {
                  const content = (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-border hover:shadow-sm transition-all group cursor-pointer">
                      <div className={`p-2.5 rounded-xl bg-muted transition-all duration-300 ${action.color}`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-foreground block">{action.label}</span>
                        <span className="text-xs text-muted-foreground">{action.desc}</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                    </div>
                  );

                  return action.external ? (
                    <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer">
                      {content}
                    </a>
                  ) : (
                    <Link key={action.label} to={action.href}>
                      {content}
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default Dashboard;
