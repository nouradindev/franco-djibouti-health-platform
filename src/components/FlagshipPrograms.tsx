import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PaginationControls from "@/components/PaginationControls";

const ITEMS_PER_PAGE = 6;

const accentColors = [
  { color: "bg-djibouti-blue/10 text-djibouti-blue border-djibouti-blue/20", accent: "bg-djibouti-blue" },
  { color: "bg-djibouti-green/10 text-djibouti-green border-djibouti-green/20", accent: "bg-djibouti-green" },
  { color: "bg-djibouti-red/10 text-djibouti-red border-djibouti-red/20", accent: "bg-djibouti-red" },
];

const FlagshipPrograms = () => {
  const [active, setActive] = useState("Tous");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { ref, isVisible } = useScrollAnimation();

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ["public-programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const categories = ["Tous", ...Array.from(new Set(programs.map((p) => p.category).filter(Boolean)))];
  const searchLower = search.toLowerCase();
  const filtered = programs
    .filter((p) => active === "Tous" || p.category === active)
    .filter((p) => !search || p.title.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (cat: string) => { setActive(cat); setPage(1); };
  const handleSearchChange = (val: string) => { setSearch(val); setPage(1); };

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucun programme publié pour le moment.</p>
          </div>
        ) : (
          <>
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Rechercher un programme…"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    active === cat
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                  {active === cat && <ChevronRight className="inline w-3 h-3 ml-1" />}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Aucun résultat pour « {search} »</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginated.map((prog, i) => {
                    const style = accentColors[i % accentColors.length];
                    return (
                      <div
                        key={prog.id}
                        className={`group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                          isVisible ? "animate-fade-in-up" : "opacity-0"
                        }`}
                        style={{ animationDelay: isVisible ? `${i * 120}ms` : "0ms" }}
                      >
                        {prog.image_url ? (
                          <div className="aspect-[16/9] overflow-hidden">
                            <img src={prog.image_url} alt={prog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        ) : (
                          <div className={`h-1.5 ${style.accent}`} />
                        )}
                        <div className="p-6">
                          {prog.category && (
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 border ${style.color}`}>
                              {prog.category}
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-foreground mb-2">{prog.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">{prog.description}</p>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-djibouti-green p-0 h-auto font-semibold" asChild>
                            <Link to={`/programmes/${prog.id}`}>
                              En Savoir Plus <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <PaginationControls page={currentPage} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FlagshipPrograms;
