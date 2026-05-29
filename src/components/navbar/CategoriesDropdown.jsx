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
      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="listbox"
      aria-label="Categories"
    >
      <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
        Categories
      </div>
      <div className="max-h-72 overflow-auto">
        {categories.length ? (
          categories.map((c) => (
            <button
              key={c._id || c.name}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onPick(c)}
              className="w-full text-left px-3 py-2 text-sm text-blue-900 hover:text-blue-700 hover:bg-slate-50 transition-colors"
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

