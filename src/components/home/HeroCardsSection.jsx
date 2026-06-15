import { useEffect, useState } from "react";
import Carousel from "./heroCards/Carousel.jsx";
import api from "../../utils/api.js";
import toast from "react-hot-toast";

export default function HeroCardsSection() {
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

  if (loading || !items.length) {
    return (
      <section className="pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-44 sm:h-56 lg:h-64 rounded-2xl bg-white/50 animate-pulse overflow-hidden border border-white/10">
                  <div className="h-full w-full bg-gradient-to-br from-white/40 via-white/10 to-transparent" />
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-sm mt-4">
              {failed ? 'Hero cards are temporarily unavailable.' : 'Loading hero cards...'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          items={items}
          intervalMs={3000}
          onCardClick={(item) => {
            toast(item?.title || "Clicked");
          }}
        />
      </div>
    </section>
  );
}
