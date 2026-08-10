import { Link } from "react-router-dom";
import logoIcon from "../assets/images/SandhaiKart_logo.jpeg";
import logoText from "../assets/Text_logo.png";

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
      <span className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl">
        <img
          src={logoIcon}
          alt=""
          aria-hidden="true"
          className="h-10 w-10 object-cover lg:mt-1"
        />
      </span>
      {!compact && (
        <img
          src={logoText}
          alt="Arsh Mart"
          className={`h-10 w-28 mt-2 lg:mt-3 object-contain ${light ? "brightness-110" : ""}`}
          draggable="false"
        />
      )}
    </Link>
  );
}
