import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { ArrowLeft, Loader2, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProgrammeDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: program, isLoading, error } = useQuery({
    queryKey: ["public-program", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("id", id!)
        .eq("status", "published")
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (error || !program) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Programme introuvable</h1>
          <p className="text-muted-foreground mb-8">Ce programme n'existe pas ou n'est plus disponible.</p>
          <Button asChild>
            <Link to="/programmes"><ArrowLeft className="w-4 h-4 mr-2" /> Retour aux programmes</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero image */}
      {program.image_url ? (
        <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden bg-muted">
          <img
            src={program.image_url}
            alt={program.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      ) : (
        <div className="h-2 bg-gradient-to-r from-djibouti-blue via-djibouti-green to-djibouti-blue" />
      )}

      <div className="container mx-auto px-4">
        <div className={`max-w-3xl mx-auto ${program.image_url ? "-mt-32 relative z-10" : "pt-16"}`}>
          {/* Back link */}
          <Link
            to="/programmes"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux programmes
          </Link>

          {/* Content card */}
          <div className="bg-card rounded-2xl border border-border shadow-lg p-8 md:p-12">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {program.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  <Tag className="w-3 h-3" /> {program.category}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(program.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              {program.title}
            </h1>

            {/* Description */}
            <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-base md:text-lg">
              {program.description}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-20" />
    </Layout>
  );
};

export default ProgrammeDetail;
