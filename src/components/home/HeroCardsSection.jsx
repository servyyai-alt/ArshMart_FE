import { useEffect, useState } from "react";
import Carousel from "./heroCards/Carousel.jsx";
import api from "../../utils/api.js";
import toast from "react-hot-toast";

export default function HeroCardsSection() {
  const [items, setItems] = useState([]);

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
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!items.length) return null;

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
