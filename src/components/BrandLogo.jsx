import { Link } from "react-router-dom";
import logoIcon from "../assets/Logo.png";
import logoText from "../assets/Text_logo.png";

export default function BrandLogo({ to = "/", className = "", compact = false }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center select-none group ${className}`}
      aria-label="Arsh Mart - Home"
    >
      <span className="inline-flex items-center justify-center shrink-0">
        <img
          src={logoIcon}
          alt=""
          aria-hidden="true"
          className={compact ? "h-10 w-10 rounded-xl object-cover" : "h-11 w-11 rounded-xl object-cover"}
        />
      </span>
      {!compact && (
        <img
          src={logoText}
          alt="Arsh Mart"
          className="ml-2 h-10 w-auto object-contain"
          draggable="false"
        />
      )}
    </Link>
  );
}
