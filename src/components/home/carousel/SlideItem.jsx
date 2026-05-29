import { useEffect, useRef } from "react";

export default function SlideItem({ item, active, onClick }) {
  const media = item?.media || {};
  const url = media.url || item.image || "";
  const kind = media.kind || (item.image ? "image" : "");
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    if (active) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
    }
  }, [active, url]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-full flex-shrink-0 relative"
      aria-label={`Open ${item?.name || "category"}`}
    >
      {kind === "video" ? (
        <video
          ref={videoRef}
          src={url}
          className="w-full h-full object-fill"
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
        />
      ) : (
        <img
          src={url}
          alt={item?.name || ""}
          className="w-full h-full object-fit"
          loading={active ? "eager" : "lazy"}
          decoding="async"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
      <div className="absolute left-5 bottom-5 text-left">
        <div className="text-white text-xl sm:text-2xl font-extrabold drop-shadow">
          {item?.name}
        </div>
        {item?.description && (
          <div className="mt-1 text-white/85 text-sm max-w-md line-clamp-2">
            {item.description}
          </div>
        )}
      </div>
    </button>
  );
}
