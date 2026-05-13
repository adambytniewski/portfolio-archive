'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import profile from '../../content/profile.json'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const COVER_WORDS = ['BUILDS', 'WITH', 'AI']

export default function IssueCover() {
  const root = useRef<HTMLElement>(null)
  const portrait = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Warsaw',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      setTime(f.format(now))
      const d = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Warsaw',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(now)
      setDate(d.replace(/\//g, '.'))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!root.current) return
    const tweens: gsap.core.Tween[] = []

    // Word-mask reveal — pure CSS animation triggered by class
    // (sidesteps strict-mode tween-revert race in dev)
    const wordMasks = root.current.querySelectorAll<HTMLElement>('.cover-word')
    wordMasks.forEach((m) => m.classList.add('auto-reveal'))

    // Cover frame fade-in
    const metas = root.current.querySelectorAll<HTMLElement>('.cover-meta')
    gsap.set(metas, { opacity: 0, y: 8 })
    tweens.push(
      gsap.to(metas, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.2,
        stagger: 0.04,
      }),
    )

    // Portrait + headline scroll parallax
    if (portrait.current) {
      tweens.push(
        gsap.to(portrait.current, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        }),
      )
    }
    tweens.push(
      gsap.to(root.current.querySelector('.cover-headline'), {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      }),
    )

    return () => {
      tweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill()
        t.kill()
      })
      gsap.set(metas, { clearProps: 'all' })
    }
  }, [])

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden">
      {/* Top issue masthead */}
      <div className="absolute top-0 inset-x-0 z-20 px-6 md:px-10 pt-5 flex items-start justify-between text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-mono cover-meta">
        <div>
          <div className="text-ink/55">Personal Archive</div>
          <div className="text-ink font-medium">Vol. 01 — MMXXVI</div>
        </div>
        <div className="hidden md:flex flex-col items-center text-center">
          <div className="text-ink/55">Editor & Subject</div>
          <div className="text-ink font-medium">A. Bytniewski</div>
        </div>
        <div className="text-right">
          <div className="text-ink/55">{date}</div>
          <div className="text-ink font-medium tabular-nums">{time} CET</div>
        </div>
      </div>

      {/* Top rule */}
      <div className="absolute top-[68px] inset-x-6 md:inset-x-10 h-px bg-ink/30 z-20 cover-meta" />

      {/* Side issue numbers */}
      <div className="absolute top-1/2 -translate-y-1/2 left-3 md:left-5 z-20 hidden sm:flex flex-col gap-3 cover-meta">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase rotate-180" style={{ writingMode: 'vertical-rl' }}>
          Issue 01 · Page A
        </div>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-3 md:right-5 z-20 hidden sm:flex flex-col gap-3 cover-meta">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ writingMode: 'vertical-rl' }}>
          {profile.location.toUpperCase()} · CET +01
        </div>
      </div>

      {/* Background grid */}
      <div className="absolute inset-0 grid-lines opacity-60" />

      {/* Main grid */}
      <div className="relative z-10 grid grid-cols-12 gap-x-4 px-6 md:px-10 pt-24 md:pt-28 pb-32">
        {/* Left meta column — quiet, generous */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-8 md:gap-10 cover-meta">
          <div>
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45 mb-3">№ 01 — Cover</div>
            <p className="text-[13px] leading-[1.6] text-ink/80 max-w-[30ch] font-mono">
              A personal archive. Cinematic web, n8n automations, second brain,
              and AI-generated video, photo &amp; sound. Updated continuously —
              this issue is a living document.
            </p>
          </div>

          <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.22em]">
            <div className="flex items-center gap-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rust animate-blink" />
              <span>Open for commissions</span>
            </div>
            <div className="text-ink/45 text-[10px] tracking-[0.25em]">Cinematic web · n8n · MCP · AI media</div>
          </div>

          {/* From the editor — letterpress quote */}
          <div className="hidden md:block relative pl-4 border-l border-rust">
            <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-rust mb-2">From the editor</div>
            <p
              className="font-display italic text-[16px] leading-[1.5] text-ink/85"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              “Każde wydanie to migawka. Tu jest stan rzeczy z dziś — jutro zmieni się, bo coś nowego się zdarzy.”
            </p>
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45 mt-3">— A. Bytniewski</div>
          </div>
        </div>

        {/* Center portrait — quiet, premium, no clutter */}
        <div className="col-span-12 md:col-span-5 mt-10 md:mt-0 cover-meta relative">
          <div ref={portrait} className="relative">
            <PortraitFrame />

            {/* One subtle annotation — author at age 22 */}
            <div className="hidden md:flex absolute top-[14%] -left-[24%] w-[22%] items-center pointer-events-none">
              <div
                className="font-display italic text-[13px] leading-[1.25] text-ink/55 text-right pr-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                The author,<br />age 22
              </div>
              <svg width="42" height="20" viewBox="0 0 42 20" className="flex-shrink-0">
                <path d="M 0 10 Q 22 4 36 10" stroke="#0e0e0c" strokeWidth="0.6" fill="none" opacity="0.35" />
                <path d="M 31 6 L 37 10 L 31 14" stroke="#0e0e0c" strokeWidth="0.6" fill="none" opacity="0.35" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45">
            <span>Fig. 01 — Self-portrait</span>
            <span className="tabular-nums">Roll #04 · Frame 12</span>
          </div>

          {/* Floating circular stamp — refined */}
          <CircularStamp />
        </div>

        {/* Right column with credits + index */}
        <div className="col-span-12 md:col-span-4 mt-10 md:mt-0 flex flex-col gap-8 md:items-end cover-meta">
          <div className="md:text-right">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45 mb-3">Featured in this issue</div>
            <ul className="font-display text-[16px] md:text-[18px] leading-[1.4] tracking-tight font-light max-w-[28ch] md:ml-auto space-y-0.5">
              <li className="text-ink">Second Brain — <span className="italic font-light" style={{ fontFamily: 'var(--font-serif)' }}>samorozszerzająca się baza wiedzy</span></li>
              <li className="text-ink/55">Studio Elements — <span className="italic" style={{ fontFamily: 'var(--font-serif)' }}>cinematic dance school</span></li>
              <li className="text-ink/55">Faktury → Excel — <span className="italic" style={{ fontFamily: 'var(--font-serif)' }}>n8n + Claude API</span></li>
              <li className="text-ink/55">Higgsfield Reel — <span className="italic" style={{ fontFamily: 'var(--font-serif)' }}>AI cinema</span></li>
            </ul>
          </div>
          <div className="md:text-right">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45 mb-2">Stack</div>
            <div className="font-mono text-[11px] leading-[1.8] text-ink/75">
              Claude · MCP · Next.js · Three · GSAP · n8n · Higgsfield · Suno
            </div>
          </div>

          {/* Inventory — quiet stats row */}
          <div className="md:text-right border-t border-ink/15 pt-4 w-full max-w-[280px] md:ml-auto">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45 mb-3">Inventory</div>
            <div className="grid grid-cols-2 gap-y-3 font-mono text-[11px] tabular-nums">
              <div className="text-left md:text-right">
                <div className="text-ink/45 text-[9px] tracking-[0.25em] uppercase">Projects</div>
                <div className="font-display text-[26px] font-light leading-none mt-1.5">08</div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-ink/45 text-[9px] tracking-[0.25em] uppercase">Tools</div>
                <div className="font-display text-[26px] font-light leading-none mt-1.5">30+</div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-ink/45 text-[9px] tracking-[0.25em] uppercase">Loops/day</div>
                <div className="font-display text-[26px] font-light leading-none mt-1.5">∞</div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-ink/45 text-[9px] tracking-[0.25em] uppercase">Coffee</div>
                <div className="font-display text-[26px] font-light leading-none mt-1.5">003</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Big headline — premium editorial display */}
      <div className="cover-headline relative z-10 px-6 md:px-10 -mt-8 md:-mt-12 pointer-events-none">
        <div className="font-display font-light text-ink leading-[0.88] tracking-tightest optical text-[clamp(3rem,10.5vw,9.5rem)] pb-20">
          {COVER_WORDS.map((w, i) => (
            <div key={w} className="word-mask word-mask-block cover-word">
              <span
                className={i === 1 ? 'italic font-light' : ''}
                style={i === 1 ? { fontFamily: 'var(--font-serif)' } : undefined}
              >
                {w}
              </span>
            </div>
          ))}
        </div>
        {/* Subtitle hairline beneath headline */}
        <div className="absolute bottom-10 left-6 md:left-10 right-6 md:right-10 flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] uppercase text-ink/45">
          <span className="h-px bg-ink/25 flex-1" />
          <span>An archive of the practice — by Adam Bytniewski</span>
          <span className="h-px bg-ink/25 flex-1" />
        </div>
      </div>

      {/* Bottom barcode + price strip */}
      <div className="absolute bottom-0 inset-x-0 px-6 md:px-10 pb-5 z-20 flex items-end justify-between font-mono text-[10px] tracking-[0.2em] uppercase cover-meta">
        <div className="flex items-end gap-4">
          <Barcode />
          <div className="hidden sm:block">
            <div className="text-ink/55">Print run</div>
            <div className="font-medium">∞ digital · 1 of 1 in spirit</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-ink/55">Scroll to begin</div>
          <div className="font-medium flex items-center gap-1">
            ↓ <span className="font-display font-light italic text-[14px] -translate-y-[1px]">turn the page</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Stylised SVG portrait frame — works without a real photo file. */
function PortraitFrame() {
  return (
    <div className="cover-frame relative aspect-[3/4] w-full max-w-[420px] mx-auto bg-bone overflow-hidden">
      <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b7a96" />
            <stop offset="50%" stopColor="#8aa6c0" />
            <stop offset="100%" stopColor="#c9b78f" />
          </linearGradient>
          <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a82516" />
            <stop offset="100%" stopColor="#7a1a0e" />
          </linearGradient>
          <pattern id="grain-pattern" patternUnits="userSpaceOnUse" width="3" height="3">
            <rect width="3" height="3" fill="transparent" />
            <circle cx="1" cy="1" r="0.4" fill="#000" opacity="0.04" />
          </pattern>
        </defs>

        {/* Sky */}
        <rect width="300" height="220" fill="url(#sky)" />
        {/* Distant horizon line */}
        <rect y="200" width="300" height="20" fill="#a8967c" />
        {/* Houses */}
        <rect x="0" y="170" width="60" height="50" fill="#d6c5a8" />
        <rect x="0" y="170" width="60" height="20" fill="#e8d8b9" />
        <polygon points="0,170 30,150 60,170" fill="#9a8567" />
        <rect x="245" y="180" width="55" height="40" fill="#c0aa84" />

        {/* Wires */}
        <line x1="0" y1="60" x2="300" y2="40" stroke="#2a2a28" strokeWidth="0.6" />
        <line x1="0" y1="80" x2="300" y2="55" stroke="#2a2a28" strokeWidth="0.6" />
        <line x1="200" y1="0" x2="220" y2="170" stroke="#2a2a28" strokeWidth="0.8" />

        {/* Sidewalk */}
        <rect y="220" width="300" height="180" fill="#cfc1a6" />
        <line x1="0" y1="220" x2="300" y2="220" stroke="#7a6a4f" strokeWidth="0.6" />
        <line x1="100" y1="220" x2="100" y2="400" stroke="#7a6a4f" strokeWidth="0.4" opacity="0.4" />
        <line x1="200" y1="220" x2="200" y2="400" stroke="#7a6a4f" strokeWidth="0.4" opacity="0.4" />

        {/* Shadow on ground */}
        <ellipse cx="150" cy="395" rx="70" ry="6" fill="#000" opacity="0.18" />

        {/* Pants / jeans */}
        <path d="M 120 320 L 110 400 L 190 400 L 180 320 Z" fill="#9caebd" />
        <path d="M 150 320 L 150 400" stroke="#6b7e8e" strokeWidth="0.5" />
        <line x1="118" y1="335" x2="182" y2="335" stroke="#7d8fa0" strokeWidth="0.5" opacity="0.4" />

        {/* Belt */}
        <rect x="115" y="312" width="70" height="6" fill="#1a1a1a" />
        <rect x="148" y="313" width="4" height="4" fill="#c5a857" />

        {/* Shirt */}
        <path d="M 95 200 Q 100 195 120 192 L 180 192 Q 200 195 205 200 L 210 320 L 90 320 Z" fill="url(#shirt)" />

        {/* Shirt graphic block */}
        <rect x="120" y="220" width="60" height="60" fill="#e6dccc" stroke="#1a1a1a" strokeWidth="0.4" opacity="0.85" />
        <text x="150" y="216" textAnchor="middle" fontSize="9" fontFamily="Georgia, serif" fontStyle="italic" fill="#f0e6d2">Adam Sunt</text>
        <text x="150" y="296" textAnchor="middle" fontSize="9" fontFamily="Georgia, serif" fontStyle="italic" fill="#f0e6d2">Rony Bany</text>

        {/* Necklace */}
        <path d="M 140 198 Q 150 210 160 198" stroke="#cfc7b8" strokeWidth="1.2" fill="none" />

        {/* Neck */}
        <rect x="140" y="178" width="20" height="22" fill="#dcb9a0" />
        <ellipse cx="150" cy="200" rx="12" ry="3" fill="#000" opacity="0.18" />

        {/* Face */}
        <ellipse cx="150" cy="155" rx="32" ry="38" fill="#e8c4a8" />
        {/* Hair */}
        <path d="M 118 130 Q 125 100 150 96 Q 180 100 184 132 Q 180 116 168 112 Q 160 122 148 116 Q 136 122 130 116 Q 120 120 118 130 Z" fill="#8c4a1f" />
        {/* Bangs flick */}
        <path d="M 130 122 Q 128 108 142 104 L 144 116 Z" fill="#a85a26" />

        {/* Sunglasses */}
        <rect x="124" y="146" width="22" height="10" rx="2" fill="#1a1a1a" />
        <rect x="154" y="146" width="22" height="10" rx="2" fill="#1a1a1a" />
        <line x1="146" y1="151" x2="154" y2="151" stroke="#1a1a1a" strokeWidth="1" />

        {/* Mustache */}
        <path d="M 138 173 Q 150 178 162 173 Q 158 175 150 175 Q 142 175 138 173 Z" fill="#6b3818" />

        {/* Lips */}
        <path d="M 144 180 Q 150 183 156 180" stroke="#9a4a3a" strokeWidth="0.8" fill="none" />

        {/* Ears */}
        <ellipse cx="118" cy="156" rx="3" ry="6" fill="#dcb9a0" />
        <ellipse cx="182" cy="156" rx="3" ry="6" fill="#dcb9a0" />

        {/* Grain overlay */}
        <rect width="300" height="400" fill="url(#grain-pattern)" />
        {/* Vignette */}
        <radialGradient id="vig" cx="0.5" cy="0.5" r="0.7">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
        <rect width="300" height="400" fill="url(#vig)" />
      </svg>
    </div>
  )
}

function Barcode() {
  const bars = [3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 3, 2, 1, 1, 2, 1, 3, 1, 2, 3]
  return (
    <div className="flex items-end gap-[1px] h-10">
      {bars.map((w, i) => (
        <div
          key={i}
          className="bg-ink"
          style={{ width: `${w}px`, height: '100%' }}
        />
      ))}
      <div className="ml-2 font-mono text-[9px] tracking-[0.15em] tabular-nums text-ink/70">
        77 0001 26 05 08
      </div>
    </div>
  )
}

/** Slowly-rotating circular stamp — subtle, refined, premium */
function CircularStamp() {
  const text = '·  VOL.01  ·  MMXXVI  ·  PERSONAL  ARCHIVE  ·  OPEN  COMMISSIONS  '
  return (
    <div className="hidden md:block absolute -bottom-10 -left-14 w-[110px] h-[110px] pointer-events-none cover-meta opacity-65">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{ animation: 'spin 42s linear infinite' }}
      >
        <defs>
          <path id="circ" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="89" fill="none" stroke="#0e0e0c" strokeWidth="0.5" opacity="0.6" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#0e0e0c" strokeWidth="0.5" opacity="0.6" />
        <text fontSize="11" fontFamily="JetBrains Mono, ui-monospace, monospace" letterSpacing="2.2" fill="#0e0e0c" fontWeight="400">
          <textPath href="#circ" startOffset="0%">{text + text}</textPath>
        </text>
        {/* Center accent — small ink dot with rust ring */}
        <circle cx="100" cy="100" r="3.5" fill="#0e0e0c" />
        <circle cx="100" cy="100" r="6" fill="none" stroke="#c8331f" strokeWidth="0.8" opacity="0.7" />
      </svg>
    </div>
  )
}
