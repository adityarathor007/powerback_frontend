import { useMemo, useState } from "react";
import Modal from "./Modal";

function extractYouTubeId(urlOrId) {
  if (!urlOrId) return "";
  // If it's already an id-like string
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
  try {
    const url = new URL(urlOrId);
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v") || "";
    }
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "");
    }
  } catch {
    // not a URL, fallback
  }
  return "";
}

export default function VideoEmbed({ url, title = "Video demo" }) {
  const [open, setOpen] = useState(false);
  const videoId = useMemo(() => extractYouTubeId(url), [url]);
  const thumbnail = useMemo(
    () => (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : ""),
    [videoId]
  );
  const embedSrc = useMemo(
    () =>
      videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
        : "",
    [videoId]
  );

  return (
    <>
      <div
        className="group relative w-full overflow-hidden rounded-lg border border-slate-200 elevated-hover cursor-pointer"
        style={{ aspectRatio: "16 / 9" }}
        onClick={() => setOpen(true)}
        role="button"
        aria-label="Play product demo video"
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-slate-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="inline-flex items-center justify-center rounded-full h-16 w-16 bg-white/90 shadow group-hover:scale-105 transition-transform">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="inline-flex text-xs font-semibold px-2 py-1 rounded-full bg-white/90 text-slate-800 border border-slate-200">
            Watch demo
          </div>
        </div>
      </div>
      {open && (
        <Modal title={title} onClose={() => setOpen(false)} footer={null}>
          <div className="relative w-full overflow-hidden rounded-lg border border-slate-200" style={{ paddingTop: "56.25%" }}>
            {embedSrc && (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={embedSrc}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

