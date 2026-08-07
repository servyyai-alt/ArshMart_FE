export default function CardItem({ item, onClick }) {
  const kind = item?.kind || "image";
  const url = item?.url || "";
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative h-44 sm:h-56 lg:h-64 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow"
      aria-label={item?.title ? `Open ${item.title}` : "Open media"}
    >
      {kind === "video" ? (
        <video
          src={url}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
        />
      ) : (
        <img
          src={url}
          alt={item?.title || ""}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-950/60 via-amber-900/15 to-transparent opacity-90" />
      {item?.title && (
        <div className="absolute left-4 right-4 bottom-4 text-left">
          <div className="text-white font-extrabold text-sm sm:text-base line-clamp-2 drop-shadow">
            {item.title}
          </div>
        </div>
      )}
    </button>
  );
}

