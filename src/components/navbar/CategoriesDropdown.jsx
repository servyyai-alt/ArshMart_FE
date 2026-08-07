export default function CategoriesDropdown({
  open,
  categories,
  onPick,
  onMouseEnter,
  onMouseLeave,
}) {
  if (!open) return null;

  return (
    <div
      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl shadow-amber-900/10 border border-amber-100 overflow-hidden z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="listbox"
      aria-label="Categories"
    >
      <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-amber-600 font-semibold border-b border-slate-100">
        Categories
      </div>
      <div className="max-h-72 overflow-auto p-1.5">
        {categories.length ? (
          categories.map((c) => (
            <button
              key={c._id || c.name}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onPick(c)}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
            >
              {c.name}
            </button>
          ))
        ) : (
          <div className="px-3 py-3 text-sm text-slate-500">No categories</div>
        )}
      </div>
    </div>
  );
}

