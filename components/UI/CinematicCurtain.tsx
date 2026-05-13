'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface CurtainProps {
  /** Chapter number shown briefly during the wipe (e.g. "03"). */
  number?: string
  /** Chapter title shown briefly during the wipe (e.g. "The Network"). */
  title?: string
  /** Optional kicker line shown above the title (e.g. "Drag any node"). */
  kicker?: string
  /** From-section background. Tailwind bg-* class. */
  fromBg?: string
  /** To-section background. Tailwind bg-* class. The new bg sweeps in behind the avatar. */
  toBg?: string
  /** Pin distance (relative to viewport) — controls how long the scrolljack lasts. */
  distance?: string
  /** Whether the avatar is the dark "ink" silhouette or the light "bone" silhouette. */
  silhouette?: 'ink' | 'bone'
}

/**
 * CinematicCurtain — scroll-jacked transition between two sections.
 *
 * Behavior: as the user scrolls into the curtain, the section pins for one
 * scroll-distance worth of input. During that pin, a giant silhouette of the
 * author's avatar walks across the viewport from right to left. As it crosses
 * the centre, a tightly-tracked chapter title flashes. As the silhouette
 * exits the left edge, the next-section background sweeps into place behind
 * it, revealing the new chapter.
 *
 * The transition is fully scrubbed to scroll position — scroll back and the
 * avatar walks back too. No skipped frames, no broken pin states, the user
 * is always in control.
 */
export default function CinematicCurtain({
  number = '',
  title = '',
  kicker = '',
  fromBg = 'bg-paper',
  toBg = 'bg-bone',
  distance = '+=200%',
  silhouette = 'ink',
}: CurtainProps) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const avatar = el.querySelector<HTMLElement>('.curtain-avatar')
    const labelWrap = el.querySelector<HTMLElement>('.curtain-label')
    const labelTitle = el.querySelector<HTMLElement>('.curtain-title')
    const labelKickers = el.querySelectorAll<HTMLElement>('.curtain-kicker')
    const nextBg = el.querySelector<HTMLElement>('.curtain-next-bg')
    const fromContent = el.querySelector<HTMLElement>('.curtain-from-content')
    const horizon = el.querySelector<HTMLElement>('.curtain-horizon')

    if (!avatar || !labelWrap || !nextBg) return

    // Set initial states
    gsap.set(avatar, { xPercent: 130, scale: 1 })
    gsap.set(nextBg, { xPercent: 110 })
    gsap.set(labelWrap, { opacity: 0 })
    if (labelTitle) gsap.set(labelTitle, { opacity: 0, y: 24 })
    if (labelKickers.length) gsap.set(labelKickers, { opacity: 0, y: 18 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: () => `+=${window.innerHeight * 2}`,
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    // Force a refresh after a tick so layout settles before ScrollTrigger measures
    const id = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 80)

    // Phase 1 (0 → 0.30): Avatar enters from right, fromContent slowly pulls left
    tl.to(avatar, { xPercent: 60, ease: 'none' }, 0)
    if (fromContent) tl.to(fromContent, { xPercent: -10, opacity: 0.6, ease: 'none' }, 0)
    if (horizon) tl.to(horizon, { scaleX: 1, ease: 'none' }, 0)

    // Phase 2 (0.30 → 0.45): Avatar near centre — chapter card fades in
    tl.to(labelWrap, { opacity: 1, ease: 'none', duration: 0.12 }, 0.30)
    if (labelKickers.length)
      tl.to(labelKickers, { opacity: 1, y: 0, ease: 'none', duration: 0.10, stagger: 0.02 }, 0.32)
    if (labelTitle)
      tl.to(labelTitle, { opacity: 1, y: 0, ease: 'none', duration: 0.10 }, 0.36)

    // Phase 3 (0.55 → 0.67): Title fades as avatar continues moving
    tl.to(labelWrap, { opacity: 0, ease: 'none', duration: 0.12 }, 0.55)

    // Phase 4 (0.30 → 1.00): Avatar continues to left, nextBg sweeps in behind from right
    tl.to(avatar, { xPercent: -120, ease: 'none' }, 0.30)
    tl.to(nextBg, { xPercent: 0, ease: 'none' }, 0.30)

    // Phase 5: fromContent fully gone
    if (fromContent) tl.to(fromContent, { opacity: 0, ease: 'none', duration: 0.2 }, 0.55)

    return () => {
      clearTimeout(id)
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [distance])

  const inkColor = silhouette === 'ink' ? '#0e0e0c' : '#f5f1e6'
  const accentColor = silhouette === 'ink' ? '#c8331f' : '#c8331f'

  return (
    <section
      ref={root}
      className={`relative h-screen overflow-hidden ${fromBg}`}
      aria-hidden="true"
    >
      {/* Subtle horizon hairline drawn across centre */}
      <div className="absolute inset-x-0 top-1/2 h-px curtain-horizon origin-right pointer-events-none">
        <div className="w-full h-full bg-ink/10" />
      </div>

      {/* From-section ghost content (this is where you can repeat the previous label) */}
      <div className="curtain-from-content absolute inset-0 flex flex-col px-6 md:px-10 pt-24 pb-10 z-10 pointer-events-none">
        <div className="flex items-center gap-6 font-mono text-[10px] tracking-[0.25em] uppercase text-ink/40">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rust animate-blink" />
          <span>End of {number ? Number(number) - 1 : 0}</span>
          <span className="flex-1 h-px bg-ink/15" />
          <span>Continue ↓</span>
        </div>
      </div>

      {/* Next-section background — slides in from the right behind the avatar */}
      <div
        className={`curtain-next-bg absolute inset-0 ${toBg} z-20`}
        style={{ transform: 'translateX(110%)' }}
      >
        {/* Subtle texture on the next bg */}
        <div className="absolute inset-0 grid-lines opacity-40" />
      </div>

      {/* Chapter label — flashes at peak of the wipe */}
      <div className="curtain-label absolute inset-0 z-30 flex flex-col items-center justify-center text-center pointer-events-none px-6">
        {/* Mini ornament — refined */}
        <div className="curtain-kicker mb-8 flex items-center gap-3">
          <span className="h-px w-10 md:w-16" style={{ background: accentColor, opacity: 0.7 }} />
          <span
            className="font-mono text-[10px] md:text-[11px] tracking-[0.45em] uppercase font-medium"
            style={{ color: accentColor }}
          >
            ❡ Chapter {number}
          </span>
          <span className="h-px w-10 md:w-16" style={{ background: accentColor, opacity: 0.7 }} />
        </div>

        {kicker && (
          <div
            className="curtain-kicker font-mono text-[10px] md:text-[11px] tracking-[0.35em] uppercase mb-10 opacity-60"
            style={{ color: inkColor }}
          >
            {kicker}
          </div>
        )}

        <div
          className="curtain-title font-display font-light italic text-[clamp(3rem,10vw,10rem)] leading-[0.9] tracking-tightest max-w-[18ch]"
          style={{ color: inkColor, fontFamily: 'var(--font-serif)' }}
        >
          {title}
        </div>

        {/* Bottom hairline accent */}
        <div className="curtain-kicker mt-10 flex items-center gap-3 font-mono text-[10px] tracking-[0.35em] uppercase opacity-40" style={{ color: inkColor }}>
          <span className="h-px w-8" style={{ background: 'currentColor' }} />
          <span>continue ↓</span>
          <span className="h-px w-8" style={{ background: 'currentColor' }} />
        </div>
      </div>

      {/* Giant walking avatar — silhouette mode, full viewport tall */}
      <div
        className="curtain-avatar absolute top-0 right-0 z-40 h-full pointer-events-none will-change-transform"
        style={{ transform: 'translateX(130%)', width: 'min(85vh, 60vw)' }}
      >
        <GiantAvatar color={inkColor} accent={accentColor} />
      </div>

      {/* Top + bottom letterboxing hairlines for cinematic feel */}
      <div className="absolute inset-x-0 top-0 h-px bg-ink/20 z-50" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-ink/20 z-50" />

      {/* Corner crops — minimal cinema markers */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-ink/30 z-50 pointer-events-none" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-ink/30 z-50 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-ink/30 z-50 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-ink/30 z-50 pointer-events-none" />

      {/* Page corner: small CH/N marker bottom-right */}
      <div className="absolute bottom-4 right-4 z-50 font-mono text-[10px] tracking-[0.3em] uppercase text-ink/40 pointer-events-none">
        CH.{number} · {title}
      </div>
    </section>
  )
}

/**
 * GiantAvatar — full-viewport-tall walking silhouette of the author.
 * Same red shirt, mustache, sunglasses character as the wandering mini avatar
 * and the cover portrait. Walking pose; not animated (the wipe IS the motion).
 */
function GiantAvatar({ color, accent }: { color: string; accent: string }) {
  return (
    <svg
      viewBox="0 0 200 700"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="avatarShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="60%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Walking ground shadow */}
      <ellipse cx="100" cy="690" rx="60" ry="6" fill={color} opacity="0.18" />

      {/* Legs in walking pose — left forward, right back */}
      <g>
        <path
          d="M 75 420 L 60 685 L 88 685 L 100 430 Z"
          fill="url(#avatarShade)"
        />
        <path
          d="M 105 420 L 118 685 L 142 685 L 130 430 Z"
          fill="url(#avatarShade)"
        />
      </g>

      {/* Belt (tiny accent hairline) */}
      <rect x="58" y="395" width="88" height="8" fill={color} opacity="0.95" />
      <rect x="98" y="397" width="4" height="4" fill={accent} />

      {/* Torso — red shirt silhouette with subtle gradient */}
      <path
        d="M 50 195 Q 55 180 80 175 L 122 175 Q 148 180 152 195 L 156 400 L 46 400 Z"
        fill="url(#avatarShade)"
      />
      {/* Shirt graphic — small white square on chest with editorial italic */}
      <rect x="78" y="240" width="48" height="55" fill={color} opacity="0.4" />

      {/* Necklace */}
      <path d="M 80 178 Q 100 195 120 178" stroke={color} strokeWidth="2" fill="none" opacity="0.8" />

      {/* Neck */}
      <rect x="86" y="155" width="28" height="22" fill="url(#avatarShade)" />

      {/* Head */}
      <ellipse cx="100" cy="115" rx="42" ry="50" fill="url(#avatarShade)" />

      {/* Hair — messy crown */}
      <path
        d="M 58 95 Q 62 50 100 42 Q 138 50 142 95 Q 134 70 122 64 Q 112 78 100 70 Q 88 78 78 64 Q 66 70 58 95 Z"
        fill={color}
      />
      {/* Bangs flick */}
      <path d="M 80 88 Q 78 60 96 54 L 100 76 Z" fill={color} opacity="0.85" />

      {/* Sunglasses — two lenses */}
      <rect x="68" y="100" width="26" height="14" rx="2" fill={color} />
      <rect x="106" y="100" width="26" height="14" rx="2" fill={color} />
      <line x1="94" y1="107" x2="106" y2="107" stroke={color} strokeWidth="2" />
      {/* Tiny reflection highlights */}
      <ellipse cx="76" cy="103" rx="3" ry="1.5" fill="#ffffff" opacity="0.18" />
      <ellipse cx="114" cy="103" rx="3" ry="1.5" fill="#ffffff" opacity="0.18" />

      {/* Mustache */}
      <path
        d="M 78 138 Q 100 146 122 138 Q 116 142 100 142 Q 84 142 78 138 Z"
        fill={color}
      />

      {/* Mouth */}
      <path d="M 88 152 Q 100 156 112 152" stroke={color} strokeWidth="1.5" fill="none" opacity="0.8" />

      {/* Editorial blood-drip / accent — small rust tag-line vertical at the side of the torso */}
      <rect x="46" y="200" width="2" height="50" fill={accent} opacity="0.8" />
    </svg>
  )
}
