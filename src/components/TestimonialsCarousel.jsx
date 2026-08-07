import { useEffect, useMemo, useState } from 'react'

export default function TestimonialsCarousel({
  testimonials = [],
  intervalMs = 3000,
  cardsPerSlide = 3,
  className = '',
}) {
  const slides = useMemo(() => {
    const items = testimonials.filter(Boolean)
    const per = Math.max(1, Number(cardsPerSlide) || 3)
    const result = []
    for (let i = 0; i < items.length; i += per) result.push(items.slice(i, i + per))
    return result.length ? result : [[]]
  }, [testimonials, cardsPerSlide])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [slides.length, intervalMs])

  return (
    <div className={`testimonial-carousel ${className}`}>
      <div className="testimonial-carousel__viewport">
        <div
          className="testimonial-carousel__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((group, i) => (
            <div key={i} className="testimonial-carousel__slide">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 rounded-lg p-4">
                {group.map((t) => (
                  <div key={t.name + t.title} className="relative rounded-2xl bg-white p-6 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-amber-200">
                    <div className="flex text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm">“{t.quote}”</p>
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-slate-900 font-semibold text-sm">{t.name}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{t.title}</div>
                      </div>
                      <div className="rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-100 px-3 py-1 text-[11px] font-semibold tracking-wide">
                        {t.badge}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-amber-600' : 'bg-slate-200 hover:bg-slate-300'
              }`}
              aria-label={`Go to testimonial slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

