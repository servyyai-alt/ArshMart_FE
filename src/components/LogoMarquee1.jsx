import { useMemo } from 'react'

export default function LogoMarquee({ items = [], className = '', repeat = true }) {
  const trackItems = useMemo(() => {
    const clean = items.filter(Boolean)
    if (!repeat) return clean
    // Duplicate to make the loop seamless
    return [...clean, ...clean]
  }, [items, repeat])

  if (!items?.length) return null

  return (
    <div className={`marquee ${className}`}>
      <div className="marquee__fade marquee__fade--left" />
      <div className="marquee__fade marquee__fade--right" />
      <div className="marquee__track" aria-hidden="true">
        {trackItems.map((label, idx) => (
          <div key={`${label}-${idx}`} className="marquee__item glass">
            <span className="marquee__text">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
