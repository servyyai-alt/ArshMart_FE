import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CategoriesDropdown from "./CategoriesDropdown.jsx";
import Overlay from "./Overlay.jsx";

export default function SearchInputBox({
  value,
  onChange,
  onSubmit,
  categories,
  onPickCategory,
  placeholder = "Search…",
}) {
  const rootRef = useRef(null);
  const closeTimer = useRef(null);
  const [open, setOpen] = useState(false);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openNow = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const closeSoon = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e) => {
      const el = rootRef.current;
      if (!el) return;
      if (el.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  return (
    <>
      <Overlay open={open} onClose={() => setOpen(false)} />

      <div ref={rootRef} className="relative z-50 w-full">
        <form
          onSubmit={(e) => {
            onSubmit(e);
            setOpen(false);
          }}
          className="hidden md:flex items-center relative min-w-0"
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
        >
          <Search className="absolute left-3.5 w-4 h-4 text-amber-400 pointer-events-none" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={openNow}
            onBlur={closeSoon}
            placeholder={placeholder}
            className="rounded-xl bg-white border border-amber-200 text-slate-800 placeholder:text-slate-400 w-40 lg:w-full pl-10 py-2.5 text-sm min-w-0 shadow-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
            aria-label="Search products"
          />

          <CategoriesDropdown
            open={open}
            categories={categories}
            onPick={(c) => {
              onPickCategory(c);
              setOpen(false);
            }}
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
          />
        </form>
      </div>
    </>
  );
}

