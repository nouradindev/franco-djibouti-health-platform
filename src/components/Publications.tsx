import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Calendar, Download, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PaginationControls from "@/components/PaginationControls";

const ITEMS_PER_PAGE = 6;

const Publications = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { ref, isVisible } = useScrollAnimation();

  const { data: publications = [], isLoading } = useQuery({
    queryKey: ["public-publications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .eq("status", "published")
        .order("published_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const searchLower = search.toLowerCase();
  const filtered = publications.filter((p) =>
    !search || p.title.toLowerCase().includes(searchLower) || p.description?.toLowerCase().includes(searchLower) || p.category?.toLowerCase().includes(searchLower)
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearchChange = (val: string) => { setSearch(val); setPage(1); };

  return (
    <section id="publications" className="py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="text-center mb-14">
          <p className="text-djibouti-green font-semibold text-sm uppercase tracking-widest mb-2">Ressources</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Publications Récentes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Rapports, communiqués et études issus de notre coopération bilatérale.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Rechercher une publication…"
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : publications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucune publication pour le moment.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucun résultat pour « {search} »</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((pub, i) => (
                <Link
                  to={`/publications/${pub.id}`}
                  key={pub.id}
                  className={`group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: isVisible ? `${i * 100}ms` : "0ms" }}
                >
                  {pub.image_url ? (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={pub.image_url} alt={pub.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-muted/50 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {pub.category && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                          {pub.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                      {pub.title}
                    </h3>
                    {pub.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{pub.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {pub.published_date
                          ? new Date(pub.published_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                          : new Date(pub.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      {pub.file_url && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                          <Download className="w-3 h-3" /> PDF
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <PaginationControls page={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </section>
  );
};

export default Publications;
