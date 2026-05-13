'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * CrosshairCursor — brutalist crosshair + label cursor.
 * Inspired by editorial-archive aesthetic. Shows context-aware labels:
 * "drag" on graph nodes, "open" on links, coordinates on idle.
 */
export default function CrosshairCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const xRef = useRef<HTMLDivElement>(null)
  const yRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    setEnabled(fine.matches && !reduced.matches)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    const lbl = labelRef.current
    const xLine = xRef.current
    const yLine = yRef.current
    const dot = dotRef.current
    if (!el || !lbl || !xLine || !yLine || !dot) return

    let mx = 0, my = 0
    let lx = 0, ly = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      setCoords({ x: Math.round(mx), y: Math.round(my) })

      const target = e.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest('[data-cursor]')
      if (interactive) {
        setLabel(interactive.getAttribute('data-cursor') || '')
        el.dataset.state = 'active'
      } else {
        setLabel('')
        el.dataset.state = 'idle'
      }
    }

    const tick = () => {
      lx += (mx - lx) * 0.22
      ly += (my - ly) * 0.22
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`
      xLine.style.transform = `translate3d(0, ${my}px, 0)`
      yLine.style.transform = `translate3d(${mx}px, 0, 0)`
      lbl.style.transform = `translate3d(${lx + 18}px, ${ly + 18}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={ref} data-state="idle" className="pointer-events-none fixed inset-0 z-[70]">
      {/* Horizontal hairline */}
      <div
        ref={xRef}
        className="absolute left-0 right-0 h-px bg-ink/25 mix-blend-multiply"
        style={{ willChange: 'transform' }}
      />
      {/* Vertical hairline */}
      <div
        ref={yRef}
        className="absolute top-0 bottom-0 w-px bg-ink/25 mix-blend-multiply"
        style={{ willChange: 'transform' }}
      />
      {/* Center dot */}
      <div
        ref={dotRef}
        className="absolute -top-[3px] -left-[3px] w-[6px] h-[6px] bg-rust"
        style={{ willChange: 'transform' }}
      />
      {/* Label */}
      <div
        ref={labelRef}
        className="absolute top-0 left-0 font-mono text-[10px] tracking-[0.18em] uppercase text-ink/80 bg-paper/85 px-1.5 py-0.5 border border-ink/30 whitespace-nowrap"
        style={{ willChange: 'transform' }}
      >
        {label || `${String(coords.x).padStart(4, '0')} · ${String(coords.y).padStart(4, '0')}`}
      </div>
    </div>
  )
}
