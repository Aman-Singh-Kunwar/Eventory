import { useEffect, useMemo } from "react";
import { X, Film } from "lucide-react";

const toEmbedUrl = (url) => {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.searchParams.get("v") || parsed.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    return url;
  } catch {
    return url;
  }
};

export default function TrailerModal({ url, onClose }) {
  const embedUrl = useMemo(() => toEmbedUrl(url), [url]);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl px-4" onClick={onClose}>
      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,0.45)] bg-[#0d1117]/95" onClick={(e) => e.stopPropagation()}>
        <div className="absolute inset-0 pointer-events-none bg-linear-to-r from-white/5 via-transparent to-white/5" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 rounded-full bg-white/10"><Film className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-white/70">Now Playing</p>
              <p className="text-sm font-semibold">Trailer</p>
            </div>
          </div>
          <button
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="aspect-video bg-black">
          <iframe
            src={embedUrl}
            title="Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
