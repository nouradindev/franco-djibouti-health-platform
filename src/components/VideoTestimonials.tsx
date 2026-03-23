import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Play, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  created_at: string;
}

const getYouTubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] || null;
};

const getEmbedUrl = (url: string): { type: "youtube" | "direct" | "invalid"; src: string } => {
  const ytId = getYouTubeId(url);
  if (ytId) return { type: "youtube", src: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0` };
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return { type: "direct", src: url };
  // Try as direct video anyway if it's a valid URL
  try {
    new URL(url);
    return { type: "direct", src: url };
  } catch {
    return { type: "invalid", src: "" };
  }
};

const getThumbnail = (video: Video): string | null => {
  if (video.thumbnail_url) return video.thumbnail_url;
  const ytId = getYouTubeId(video.video_url);
  return ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
};

/* ── Video Player Modal ── */
const VideoPlayerModal = ({
  video,
  onClose,
}: {
  video: Video;
  onClose: () => void;
}) => {
  const embed = getEmbedUrl(video.video_url);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {embed.type === "youtube" ? (
          <iframe
            src={embed.src}
            className="w-full h-full"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title={video.title}
          />
        ) : embed.type === "direct" ? (
          <video
            src={embed.src}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white gap-3">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <p className="text-lg font-medium">URL vidéo invalide</p>
            <p className="text-sm text-muted-foreground">{video.video_url}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

/* ── Video Card ── */
const VideoCard = ({
  video,
  onPlay,
}: {
  video: Video;
  onPlay: (v: Video) => void;
}) => {
  const thumbnail = getThumbnail(video);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onPlay(video)}
    >
      <div className="relative aspect-video bg-muted overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
            <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {video.description}
        </p>
      </div>
    </motion.div>
  );
};

/* ── Main Section ── */
const VideoTestimonials = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  useEffect(() => {
    supabase
      .from("testimonial_videos")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setVideos((data as Video[]) || []);
        setLoading(false);
      });
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeVideo]);

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
      </section>
    );
  }

  if (videos.length === 0) return null;

  return (
    <>
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              Témoignages
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Témoignages Vidéo
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez les témoignages des acteurs de la coopération sanitaire
              franco-djiboutienne.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} onPlay={setActiveVideo} />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeVideo && (
          <VideoPlayerModal
            video={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default VideoTestimonials;
