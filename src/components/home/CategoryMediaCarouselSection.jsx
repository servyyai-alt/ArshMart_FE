import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api.js";
import Carousel from "./carousel/Carousel.jsx";
import toast from "react-hot-toast";

export default function CategoryMediaCarouselSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const timeoutId = setTimeout(() => {
      if (mounted) setFailed(true);
    }, 8000);

    api
      .get("/settings")
      .then((res) => {
        if (!mounted) return;
        const arr = res.data.settings?.homepage?.heroCards || [];
        setItems(Array.isArray(arr) ? arr.slice(0, 14) : []);
        setFailed(false);
      })
      .catch(() => {
        if (!mounted) return;
        setItems([]);
        setFailed(true);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const slides = useMemo(
    () =>
      (items || [])
        .filter((c) => Boolean(c?.url))
        .map((c, i) => ({
          _id: c?.publicId || `${i}`,
          name: c?.title || "",
          media: { kind: c?.kind || "image", url: c?.url || "" },
        })),
    [items],
  );

  if (loading) {
    return (
      <section className="pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[220px] sm:h-[260px] lg:h-[320px] rounded-2xl bg-white/50 animate-pulse overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-br from-white/40 via-white/10 to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!slides.length) {
    return (
      <section className="pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="h-5 w-52 rounded-full bg-white/40 animate-pulse" />
                <div className="h-3 w-72 rounded-full bg-white/30 animate-pulse mt-3" />
              </div>
              <div className="hidden sm:flex gap-2">
                <div className="h-10 w-10 rounded-xl bg-white/30 animate-pulse" />
                <div className="h-10 w-10 rounded-xl bg-white/30 animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[220px] sm:h-[260px] lg:h-[320px] rounded-2xl bg-white/50 animate-pulse" />
              ))}
            </div>
            <p className="text-slate-500 text-sm mt-4">
              {failed ? 'Content is temporarily unavailable. Please try again in a moment.' : 'Loading featured media...'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-20 sm:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          items={slides}
          intervalMs={3000}
          onSlideClick={(card) => toast(card?.name || "Clicked")}
        />
      </div>
    </section>
  );
}
