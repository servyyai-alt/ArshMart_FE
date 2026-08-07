import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselArrows({ onPrev, onNext }) {
  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </>
  );
}

