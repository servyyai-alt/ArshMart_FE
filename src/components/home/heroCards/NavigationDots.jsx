export default function NavigationDots({ count = 3, active, onPick }) {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to group ${i + 1}`}
          onClick={() => onPick(i)}
          className={`h-2.5 rounded-full transition-all ${
            i === active ? "w-8 bg-primary-900" : "w-2.5 bg-slate-300 hover:bg-slate-400"
          }`}
        />
      ))}
    </div>
  );
}
