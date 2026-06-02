import { useEffect, useMemo, useRef, useState } from "react";
import CarouselArrows from "./CarouselArrows.jsx";
import CarouselDots from "./CarouselDots.jsx";
import SlideItem from "./SlideItem.jsx";

export default function Carousel({ items, onSlideClick, intervalMs = 3000 }) {
  const [index, setIndex] = useState(0);
  const itemsCount = items?.length || 0;
  const timerRef = useRef(null);

  const safeIndex = useMemo(() => {
    if (!itemsCount) return 0;
    return Math.min(index, itemsCount - 1);
  }, [index, itemsCount]);

  useEffect(() => setIndex(0), [itemsCount]);

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const start = () => {
    stop();
    if (itemsCount <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % itemsCount);
    }, intervalMs);
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsCount, intervalMs]);

  const goPrev = () =>
    setIndex((i) => (itemsCount ? (i - 1 + itemsCount) % itemsCount : 0));
  const goNext = () =>
    setIndex((i) => (itemsCount ? (i + 1) % itemsCount : 0));

  if (!itemsCount) return null;

  return (
    <div
      className="relative w-full h-[220px] sm:h-[320px] lg:h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      onMouseEnter={stop}
      onMouseLeave={start}
    >
      <div
        className="h-full w-full flex transition-transform duration-700 ease-in-out will-change-transform"
        style={{ transform: `translateX(-${safeIndex * 100}%)` }}
      >
        {items.map((item, i) => (
          <SlideItem
            key={item._id || item.slug || item.name || i}
            item={item}
            active={i === safeIndex}
            onClick={() => onSlideClick?.(item)}
          />
        ))}
      </div>

      <CarouselArrows onPrev={goPrev} onNext={goNext} />
      <CarouselDots count={itemsCount} active={safeIndex} onPick={setIndex} />
    </div>
  );
}

