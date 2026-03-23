import { Loader2, MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Timeline = () => {
  const { ref, isVisible } = useScrollAnimation();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .order("event_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <section id="calendrier" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="text-center mb-14">
          <p className="text-djibouti-green font-semibold text-sm uppercase tracking-widest mb-2">Jalons Clés</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Calendrier</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Les étapes majeures de notre coopération sanitaire bilatérale.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucun événement publié pour le moment.</p>
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-px" />

            {events.map((event, i) => {
              const isLeft = i % 2 === 0;
              const card = (
                <div className="bg-card rounded-lg border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-semibold text-djibouti-green">{formatDate(event.event_date)}</span>
                  <h3 className="text-base font-semibold text-foreground mt-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  {event.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <MapPin className="h-3 w-3" /> {event.location}
                    </div>
                  )}
                </div>
              );

              return (
                <div
                  key={event.id}
                  className={`relative flex items-start mb-10 last:mb-0 ${
                    isVisible ? (isLeft ? "animate-slide-in-left" : "animate-slide-in-right") : "opacity-0"
                  }`}
                  style={{ animationDelay: isVisible ? `${i * 200}ms` : "0ms" }}
                >
                  {/* Mobile */}
                  <div className="md:hidden flex gap-4 w-full">
                    <div className="relative z-10 w-8 h-8 rounded-full bg-djibouti-green flex items-center justify-center flex-shrink-0 shadow-md">
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                    <div className="flex-1">{card}</div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:flex items-center w-full">
                    {isLeft ? (
                      <>
                        <div className="w-1/2 pr-8 text-right">
                          <div className="inline-block text-left">{card}</div>
                        </div>
                        <div className="relative z-10 w-8 h-8 rounded-full bg-djibouti-green flex items-center justify-center flex-shrink-0 shadow-md -ml-4">
                          <div className="w-3 h-3 rounded-full bg-white" />
                        </div>
                        <div className="w-1/2" />
                      </>
                    ) : (
                      <>
                        <div className="w-1/2" />
                        <div className="relative z-10 w-8 h-8 rounded-full bg-djibouti-green flex items-center justify-center flex-shrink-0 shadow-md -mr-4">
                          <div className="w-3 h-3 rounded-full bg-white" />
                        </div>
                        <div className="w-1/2 pl-8">{card}</div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Timeline;
