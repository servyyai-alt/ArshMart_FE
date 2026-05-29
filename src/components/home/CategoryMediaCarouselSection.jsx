import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api.js";
import Carousel from "./carousel/Carousel.jsx";
import toast from "react-hot-toast";

export default function CategoryMediaCarouselSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get("/settings")
      .then((res) => {
        if (!mounted) return;
        const arr = res.data.settings?.homepage?.heroCards || [];
        setItems(Array.isArray(arr) ? arr.slice(0, 14) : []);
      })
      .catch(() => {
        if (!mounted) return;
        setItems([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
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
          <div className="h-[220px] sm:h-[320px] lg:h-[420px] glass-card animate-pulse rounded-3xl" />
        </div>
      </section>
    );
  }

  if (!slides.length) return null;

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
