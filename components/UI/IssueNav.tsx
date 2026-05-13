'use client'

import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { id: 'manifest', label: 'Manifest', no: '02' },
  { id: 'network', label: 'Network', no: '03' },
  { id: 'archive', label: 'Archive', no: '04' },
  { id: 'folio', label: 'Folio', no: '05' },
  { id: 'notes', label: 'Notes', no: '06' },
  { id: 'colophon', label: 'Contact', no: '07' },
]

export default function IssueNav() {
  const [progress, setProgress] = useState(0)
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const p = total > 0 ? window.scrollY / total : 0
      setProgress(Math.max(0, Math.min(1, p)))

      const y = window.scrollY
      const diff = y - lastY
      if (y > window.innerHeight && diff > 4) setHidden(true)
      else if (diff < -4) setHidden(false)
      if (y < 200) setHidden(false)
      lastY = y

      const sections = NAV_ITEMS.map((n) => ({ id: n.id, el: document.getElementById(n.id) })).filter((s) => s.el)
      const mid = window.scrollY + window.innerHeight / 3
      let curr = ''
      for (const s of sections) {
        if (s.el && s.el.offsetTop <= mid) curr = s.id
      }
      setActive(curr)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={[
        'fixed top-0 left-0 right-0 z-[80] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
        hidden ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <div className="bg-paper/80 backdrop-blur-md border-b border-ink/10 px-6 md:px-10 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#top"
          className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink hover:text-rust transition-colors flex items-baseline gap-2"
        >
          <span className="font-medium">Adam B.</span>
          <span className="text-ink/35">/</span>
          <span
            className="italic text-[12px] text-ink/65 -translate-y-[1px]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Archive 01
          </span>
        </a>

        {/* Items */}
        <ul className="hidden md:flex items-center gap-7 font-mono text-[10px] tracking-[0.3em] uppercase">
          {NAV_ITEMS.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                data-cursor="jump"
                className={[
                  'relative transition-colors duration-300 flex items-center gap-2 group',
                  active === n.id ? 'text-ink' : 'text-ink/45 hover:text-ink',
                ].join(' ')}
              >
                <span className="text-ink/30 tabular-nums">{n.no}</span>
                <span>{n.label}</span>
                {/* Underline indicator */}
                <span
                  className={[
                    'absolute -bottom-1.5 left-0 right-0 h-px bg-rust transition-transform duration-500 origin-left',
                    active === n.id ? 'scale-x-100' : 'scale-x-0',
                  ].join(' ')}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#colophon"
          className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink hover:text-rust transition-colors flex items-center gap-2 group"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rust animate-blink" />
          <span className="hidden sm:inline">Open commissions</span>
          <span className="sm:hidden">Hire</span>
          <span
            className="italic text-[12px] -translate-y-[1px] transition-transform duration-300 group-hover:translate-x-0.5"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            ↗
          </span>
        </a>
      </div>
      {/* Progress hairline */}
      <div className="h-[1.5px] bg-ink/8">
        <div
          className="h-full bg-rust transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </nav>
  )
}
