'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * IssuePreloader — magazine-issue cover preloader.
 * Shows ISSUE NO + masthead + counter, then splits horizontally to reveal page.
 */
export default function IssuePreloader() {
  const root = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const bot = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLDivElement>(null)
  const masthead = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done || typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDone(true)
      return
    }

    const c = { v: 0 }
    const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } })

    tl.to(c, {
      v: 100,
      duration: 1.7,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counter.current) {
          counter.current.textContent = String(Math.round(c.v)).padStart(3, '0')
        }
      },
    })
      .to(masthead.current, { opacity: 0, y: -10, duration: 0.4 }, '+=0.05')
      .to(counter.current, { opacity: 0, y: 10, duration: 0.4 }, '<')
      .to(top.current, { yPercent: -100, duration: 1.0 }, '-=0.1')
      .to(bot.current, { yPercent: 100, duration: 1.0 }, '<')
      .add(() => setDone(true))
  }, [done])

  if (done) return null

  return (
    <div ref={root} className="fixed inset-0 z-[100] pointer-events-none">
      <div ref={top} className="absolute inset-x-0 top-0 h-1/2 bg-ink text-bone overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 px-6 sm:px-10 pb-4 flex items-end justify-between">
          <div ref={masthead} className="font-display text-[clamp(2rem,8vw,5rem)] leading-none tracking-tightest font-light">
            ARCHIVE
          </div>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/70 hidden sm:block">
            ISSUE No 01 · MMXXVI
          </div>
        </div>
      </div>
      <div ref={bot} className="absolute inset-x-0 bottom-0 h-1/2 bg-ink text-bone overflow-hidden">
        <div className="absolute inset-x-0 top-0 px-6 sm:px-10 pt-4 flex items-start justify-between">
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/70">
            Adam Bytniewski · Personal Archive
          </div>
          <div ref={counter} className="font-mono text-[10px] tracking-[0.2em] tabular-nums">
            000
          </div>
        </div>
      </div>
    </div>
  )
}
