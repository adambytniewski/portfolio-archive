'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * WanderingAvatar — mini self-portrait that walks naturally across the
 * viewport. The crosshair cursor can "shoot" it: hover it (label flips to
 * SHOOT?) and click — the avatar gets knocked off screen with a bullet
 * impact, blood splatter, ragdoll spin, and respawns 4 seconds later from
 * a random edge. Stays inside the viewport while wandering. Wandering
 * pauses on hover so the player has a fair chance to land the click.
 *
 * Position is `fixed`, so the avatar follows the viewport even when the
 * user scrolls. It's hidden inside the colophon (dark) section to avoid
 * contrast issues against ink-black.
 */

type Phase = 'walking' | 'hit' | 'gone'

interface Splat {
  id: number
  x: number
  y: number
  size: number
  rot: number
}

const AVATAR_SIZE = 64
const PADDING = 16

export default function WanderingAvatar() {
  const [enabled, setEnabled] = useState(false)
  const [phase, setPhase] = useState<Phase>('walking')
  const [pos, setPos] = useState({ x: 200, y: 200 })
  const [vel, setVel] = useState({ x: 1.1, y: 0 })
  const [facing, setFacing] = useState<1 | -1>(1)
  const [bobT, setBobT] = useState(0)
  const [stepT, setStepT] = useState(0)
  const [hitDir, setHitDir] = useState<{ vx: number; vy: number; rot: number }>({ vx: 0, vy: 0, rot: 0 })
  const [splats, setSplats] = useState<Splat[]>([])
  const [hovered, setHovered] = useState(false)

  const phaseRef = useRef<Phase>('walking')
  const posRef = useRef(pos)
  const velRef = useRef(vel)
  const hitRef = useRef(hitDir)
  const hoveredRef = useRef(false)
  const splatIdRef = useRef(0)
  const hideOverDarkRef = useRef(false)

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])
  useEffect(() => {
    posRef.current = pos
  }, [pos])
  useEffect(() => {
    velRef.current = vel
  }, [vel])
  useEffect(() => {
    hitRef.current = hitDir
  }, [hitDir])
  useEffect(() => {
    hoveredRef.current = hovered
  }, [hovered])

  // Enable only on desktop with motion preference allowed
  useEffect(() => {
    if (typeof window === 'undefined') return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    setEnabled(fine.matches && !reduced.matches)
  }, [])

  // Initial spawn — middle bottom of viewport
  useEffect(() => {
    if (!enabled) return
    const w = window.innerWidth
    const h = window.innerHeight
    setPos({ x: Math.random() * (w - AVATAR_SIZE - 2 * PADDING) + PADDING, y: h - AVATAR_SIZE - 80 })
    setVel({ x: 1.1, y: 0 })
  }, [enabled])

  // Hide when colophon (dark) section is in view to avoid contrast clash
  useEffect(() => {
    if (!enabled) return
    const onScroll = () => {
      const colo = document.getElementById('colophon')
      if (!colo) return
      const r = colo.getBoundingClientRect()
      const vh = window.innerHeight
      const overlapTop = Math.max(r.top, 0)
      const overlapBottom = Math.min(r.bottom, vh)
      const overlap = Math.max(0, overlapBottom - overlapTop)
      hideOverDarkRef.current = overlap > vh * 0.4
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])

  // Animation tick — walking + hit physics
  useEffect(() => {
    if (!enabled) return
    let raf = 0
    let dirChangeT = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(33, now - last) / 16.6 // normalise to 60fps frames
      last = now

      const w = window.innerWidth
      const h = window.innerHeight
      const cur = phaseRef.current

      if (cur === 'walking') {
        let { x, y } = posRef.current
        let { x: vx, y: vy } = velRef.current

        if (hoveredRef.current) {
          // Pause walking when hovered — gives player time to aim
          vx = 0
          vy = 0
        } else {
          // Random direction tweaks every ~80 frames
          dirChangeT += dt
          if (dirChangeT > 70 + Math.random() * 90) {
            dirChangeT = 0
            const speed = 0.7 + Math.random() * 0.9
            const angle = Math.random() * Math.PI * 2
            vx = Math.cos(angle) * speed
            vy = Math.sin(angle) * speed * 0.5
          }
        }

        x += vx * dt
        y += vy * dt

        // Bounce off viewport edges
        const minX = PADDING
        const maxX = w - AVATAR_SIZE - PADDING
        const minY = PADDING + 60 // leave room under the top nav
        const maxY = h - AVATAR_SIZE - PADDING
        if (x < minX) {
          x = minX
          vx = Math.abs(vx)
        }
        if (x > maxX) {
          x = maxX
          vx = -Math.abs(vx)
        }
        if (y < minY) {
          y = minY
          vy = Math.abs(vy)
        }
        if (y > maxY) {
          y = maxY
          vy = -Math.abs(vy)
        }

        if (Math.abs(vx) > 0.05) setFacing(vx > 0 ? 1 : -1)

        setPos({ x, y })
        setVel({ x: vx, y: vy })
        setBobT((t) => t + dt * 0.18)
        setStepT((t) => (Math.abs(vx) > 0.05 ? t + dt * 0.25 : 0))
      } else if (cur === 'hit') {
        // Ragdoll: avatar flies off in hit direction with gravity, spinning
        let { x, y } = posRef.current
        const hd = hitRef.current
        const newVx = hd.vx
        const newVy = hd.vy + 0.8 * dt // gravity
        x += newVx * dt
        y += newVy * dt
        setPos({ x, y })
        setHitDir({ vx: newVx, vy: newVy, rot: hd.rot + 12 * dt })

        // Once way off-screen, switch to gone, schedule respawn
        if (y > window.innerHeight + 120 || x < -200 || x > window.innerWidth + 200) {
          phaseRef.current = 'gone'
          setPhase('gone')
          setTimeout(() => {
            // Respawn at a random edge
            const side = Math.floor(Math.random() * 4)
            const w2 = window.innerWidth
            const h2 = window.innerHeight
            let nx = 100,
              ny = 100,
              nvx = 1,
              nvy = 0
            if (side === 0) {
              nx = -AVATAR_SIZE
              ny = Math.random() * (h2 - 240) + 120
              nvx = 1.2
            } else if (side === 1) {
              nx = w2 + AVATAR_SIZE
              ny = Math.random() * (h2 - 240) + 120
              nvx = -1.2
            } else if (side === 2) {
              nx = Math.random() * (w2 - 200) + 100
              ny = h2 + 60
              nvy = -1.2
            } else {
              nx = Math.random() * (w2 - 200) + 100
              ny = -AVATAR_SIZE
              nvy = 1.2
            }
            setSplats([])
            setPos({ x: nx, y: ny })
            setVel({ x: nvx, y: nvy })
            setHitDir({ vx: 0, vy: 0, rot: 0 })
            phaseRef.current = 'walking'
            setPhase('walking')
          }, 3500)
        }
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [enabled])

  const onShot = (e: React.MouseEvent) => {
    if (phaseRef.current !== 'walking') return
    e.stopPropagation()
    e.preventDefault()
    // Determine impact direction from click position relative to avatar center
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const d = Math.hypot(dx, dy) || 1
    const speed = 14
    const vx = -(dx / d) * speed
    const vy = -(dy / d) * speed - 6 // pop up
    setHitDir({ vx, vy, rot: 0 })

    // Generate impact mark — quieter, fewer splatters, more cinematic
    const sp: Splat[] = []
    for (let i = 0; i < 4; i++) {
      sp.push({
        id: splatIdRef.current++,
        x: 32 + (Math.random() - 0.5) * 22,
        y: 32 + (Math.random() - 0.5) * 22,
        size: 2 + Math.random() * 5,
        rot: Math.random() * 360,
      })
    }
    setSplats(sp)
    phaseRef.current = 'hit'
    setPhase('hit')
  }

  if (!enabled) return null
  if (phase === 'gone') return null

  const bob = phase === 'walking' ? Math.sin(bobT) * 1.6 : 0
  const stepBend = phase === 'walking' ? Math.sin(stepT) * 6 : 0

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={onShot}
      data-cursor={phase === 'walking' ? 'shoot ?' : 'KO'}
      className="fixed z-[55] select-none transition-opacity duration-500"
      style={{
        left: pos.x,
        top: pos.y + bob,
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        cursor: 'crosshair',
        transform: `rotate(${phase === 'hit' ? hitDir.rot : 0}deg)`,
        opacity: hideOverDarkRef.current ? 0 : 1,
        pointerEvents: hideOverDarkRef.current ? 'none' : 'auto',
      }}
    >
      {/* Drop shadow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-ink/20 blur-[2px]"
        style={{
          bottom: -2,
          width: AVATAR_SIZE * 0.55,
          height: 5,
          transform: `translateX(-50%) scaleX(${1 - Math.abs(bob) * 0.04})`,
        }}
      />

      {/* The avatar — same character as the cover portrait, but full body */}
      <svg
        viewBox="0 0 64 80"
        width={AVATAR_SIZE}
        height={AVATAR_SIZE * 1.25}
        className="absolute left-0 top-0 overflow-visible"
        style={{ transform: `scaleX(${facing})` }}
      >
        {/* Legs (with step bending) */}
        <g>
          <rect x="22" y="50" width="8" height="22" rx="1" fill="#9caebd" transform={`rotate(${stepBend} 26 52)`} />
          <rect x="34" y="50" width="8" height="22" rx="1" fill="#9caebd" transform={`rotate(${-stepBend} 38 52)`} />
        </g>
        {/* Belt */}
        <rect x="20" y="46" width="24" height="3" fill="#1a1a1a" />
        {/* Torso (red shirt) */}
        <path d="M 18 28 Q 20 24 28 22 L 36 22 Q 44 24 46 28 L 46 50 L 18 50 Z" fill="#a82516" />
        {/* Shirt graphic */}
        <rect x="26" y="32" width="12" height="11" fill="#e6dccc" stroke="#1a1a1a" strokeWidth="0.4" />
        {/* Necklace */}
        <path d="M 28 23 Q 32 26 36 23" stroke="#cfc7b8" strokeWidth="0.6" fill="none" />
        {/* Neck */}
        <rect x="28" y="20" width="8" height="4" fill="#dcb9a0" />
        {/* Head */}
        <ellipse cx="32" cy="14" rx="9" ry="10" fill="#e8c4a8" />
        {/* Hair */}
        <path d="M 23 12 Q 24 6 32 5 Q 40 6 41 12 Q 39 8 36 7 Q 34 9 32 8 Q 30 9 28 8 Q 25 9 23 12 Z" fill="#8c4a1f" />
        {/* Sunglasses */}
        <rect x="25" y="11" width="6" height="3" rx="0.6" fill="#1a1a1a" />
        <rect x="33" y="11" width="6" height="3" rx="0.6" fill="#1a1a1a" />
        <line x1="31" y1="12.5" x2="33" y2="12.5" stroke="#1a1a1a" strokeWidth="0.5" />
        {/* Mustache */}
        <path d="M 28 17 Q 32 18.5 36 17 Q 35 18 32 18 Q 29 18 28 17" fill="#6b3818" />
        {/* Mouth */}
        <path d="M 30 19.5 Q 32 20.5 34 19.5" stroke="#9a4a3a" strokeWidth="0.4" fill="none" />
      </svg>

      {/* Impact marks — refined, smaller, less tacky */}
      {splats.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            background: '#c8331f',
            transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
            opacity: 0.85,
          }}
        />
      ))}

      {/* Hit flash — quieter */}
      {phase === 'hit' && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(200,51,31,0.3) 40%, transparent 70%)',
            animation: 'hitflash 0.45s ease-out forwards',
          }}
        />
      )}

      {/* Refined target indicator — crosshair frame around avatar on hover */}
      {phase === 'walking' && hovered && (
        <>
          <div
            className="absolute -top-2 -left-2 -right-2 -bottom-2 pointer-events-none"
            style={{ animation: 'fadein 0.25s ease-out forwards' }}
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-rust" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-rust" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-rust" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-rust" />
          </div>
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.3em] uppercase whitespace-nowrap text-rust"
            style={{ animation: 'fadein 0.25s ease-out forwards' }}
          >
            <span className="inline-block animate-blink">●</span> target acquired
          </div>
        </>
      )}
    </div>
  )
}
