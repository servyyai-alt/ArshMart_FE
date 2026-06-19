import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getTransformedUrl } from "../utils/cloudinary.js";

export default function CategoryCard({ category }) {
  const imageUrl = category.image
    ? getTransformedUrl(category.image, { width: 300, height: 200 })
    : null;

  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="group relative overflow-hidden rounded-2xl aspect-[5/3] min-h-[160px] sm:min-h-[180px] md:min-h-[210px] block"
    >
      {/* Background */}
      <div className="absolute inset-0 group-hover:bg-dark-900/30 transition-colors duration-300">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-fit bg-white/5 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-900/50 to-dark-800" />
        )}
      </div>

      {/* Gradient overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/30 to-transparent" /> */}

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full right-0 p-3 sm:p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
          <div className="bg-black/35 backdrop-blur-sm w-fit max-w-[90%] sm:max-w-[70%] p-3 sm:p-2.5 rounded-xl">
            <h3 className="text-white font-display font-semibold leading-tight text-sm sm:text-base md:text-lg line-clamp-2 break-words">
              {category.name}
            </h3>
          </div>
          <div className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg bg-green-500 flex items-center justify-center whitespace-nowrap transform translate-y-1 sm:translate-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all w-fit duration-300 shrink-0 text-xs sm:text-sm">
            <span>Shop now</span>
            <ArrowRight className="w-4 h-4 ml-2 text-white" />
          </div>
        </div>
      </div>

      {/* Border glow */}
      <div className="absolute border-2 inset-0 rounded-2xl border-white/10 group-hover:border-primary-500/30 transition-colors duration-300" />
    </Link>
  );
}
