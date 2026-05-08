import { useEffect, useRef, useState } from 'react'

export default function CountUpStat({
  value = 0,
  durationMs = 1200,
  suffix = '',
  prefix = '',
  className = '',
}) {
  const [display, setDisplay] = useState(0)
  const startedRef = useRef(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        if (startedRef.current) return
        startedRef.current = true

        const start = performance.now()
        const target = Number(value) || 0
        const step = (now) => {
          const t = Math.min(1, (now - start) / durationMs)
          const next = Math.round(target * t)
          setDisplay(next)
          if (t < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.35 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, durationMs])

  return (
    <div ref={rootRef} className={className}>
      {prefix}
      {display.toLocaleString('en-IN')}
      {suffix}
    </div>
  )
}

