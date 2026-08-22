import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Arrows({ onPrev, onNext }) {
  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous"
        className="absolute -left-3 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md text-primary-900 hover:text-primary-700 flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next"
        className="absolute -right-3 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md text-primary-900 hover:text-primary-700 flex items-center justify-center"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </>
  );
}
