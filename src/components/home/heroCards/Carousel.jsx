import { useEffect, useMemo, useRef, useState } from "react";
import Arrows from "./Arrows.jsx";
import NavigationDots from "./NavigationDots.jsx";
import CardItem from "./CardItem.jsx";

export default function Carousel({ items, onCardClick, intervalMs = 3000 }) {
  const pageSize = 3;
  const pages = useMemo(() => {
    const arr = items || [];
    const groups = [];
    for (let i = 0; i < arr.length; i += pageSize) groups.push(arr.slice(i, i + pageSize));
    return groups;
  }, [items]);

  const pageCount = pages.length || 0;
  const [page, setPage] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => setPage(0), [pageCount]);

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };
  const start = () => {
    stop();
    if (pageCount <= 1) return;
    timerRef.current = setInterval(() => {
      setPage((p) => (p + 1) % pageCount);
    }, intervalMs);
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount, intervalMs]);

  const goPrev = () => setPage((p) => (pageCount ? (p - 1 + pageCount) % pageCount : 0));
  const goNext = () => setPage((p) => (pageCount ? (p + 1) % pageCount : 0));

  const dotsCount = Math.min(3, pageCount || 1);
  const activeDot = pageCount ? page % dotsCount : 0;

  const pickDot = (dotIndex) => {
    if (!pageCount) return;
    const currentBlock = Math.floor(page / dotsCount);
    let candidate = currentBlock * dotsCount + dotIndex;
    if (candidate >= pageCount) candidate = dotIndex % pageCount;
    setPage(candidate);
  };

  if (!pageCount) return null;

  return (
    <div className="relative">
      <div
        className="overflow-hidden"
        onMouseEnter={stop}
        onMouseLeave={start}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out will-change-transform"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((group, idx) => (
            <div key={idx} className="w-full flex-shrink-0 px-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {group.map((item, i) => (
                  <CardItem key={item.publicId || item.url || i} item={item} onClick={() => onCardClick?.(item)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {pageCount > 1 && <Arrows onPrev={goPrev} onNext={goNext} />}
      {pageCount > 1 && <NavigationDots count={dotsCount} active={activeDot} onPick={pickDot} />}
    </div>
  );
}

