import { Link } from "react-router-dom";

export default function Logo({
  to = "/",
  light = false,
  className = "",
  compact = false,
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2.5 select-none group ${className}`}
      aria-label="Arsh Mart - Home"
    >
      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/40 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
        <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden="true">
          <path
            d="M16 34 24 14l8 20"
            fill="none"
            stroke="white"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.5 27h9"
            fill="none"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M37.6 10.8l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z"
            fill="#ffffff"
          />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display font-bold text-[22px] tracking-tight ${
              light ? "text-white" : "text-slate-900"
            }`}
          >
            Arsh
          </span>
          <span
            className={`text-[10px] font-bold tracking-[0.42em] uppercase ${
              light ? "text-amber-200" : "text-amber-600"
            }`}
          >
            Mart
          </span>
        </span>
      )}
    </Link>
  );
}
