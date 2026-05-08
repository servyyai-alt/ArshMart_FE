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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {group.map((t) => (
                  <div key={t.name + t.title} className="glass-card p-6">
                    <p className="text-slate-200 leading-relaxed">“{t.quote}”</p>
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-white font-semibold">{t.name}</div>
                        <div className="text-slate-500 text-xs">{t.title}</div>
                      </div>
                      <div className="text-slate-400 text-xs font-semibold tracking-wider">
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
              className={`h-2 w-2 rounded-full transition-colors ${
                i === index ? 'bg-white/80' : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to testimonial slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

