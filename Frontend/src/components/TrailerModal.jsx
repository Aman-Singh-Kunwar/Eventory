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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-2xl px-4 py-8 opacity-100 transition-opacity duration-300" onClick={onClose}>
      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden border border-white/20 shadow-[0_25px_100px_rgba(0,0,0,0.5)] bg-[#0d1117]/98 transform scale-100 transition-transform duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="absolute inset-0 pointer-events-none bg-linear-to-r from-white/5 via-transparent to-white/5" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/15 bg-linear-to-r from-white/5 to-white/0 backdrop-blur-lg">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 rounded-full bg-linear-to-br from-[rgb(var(--primary))] to-red-600 shadow-lg"><Film className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-white/60 font-medium">NOW PLAYING</p>
              <p className="text-sm font-bold">Trailer</p>
            </div>
          </div>
          <button
            className="p-2 rounded-full bg-white/10 hover:bg-[rgb(var(--primary))]/30 text-white transition-all duration-300 hover:shadow-[0_10px_25px_rgba(229,9,20,0.2)]"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="aspect-video bg-black/80">
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
