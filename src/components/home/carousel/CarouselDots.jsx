export default function CarouselDots({ count, active, onPick }) {
  if (count <= 1) return null;
  return (
    <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onPick(i)}
          className={`h-2.5 rounded-full transition-all ${
            i === active ? "w-8 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80"
          }`}
        />
      ))}
    </div>
  );
}

