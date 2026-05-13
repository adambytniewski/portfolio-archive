'use client'

import { useRef } from 'react'
import profile from '../../content/profile.json'

export default function Colophon() {
  const emailRef = useRef<HTMLAnchorElement>(null)

  const onCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(profile.email)
      const el = emailRef.current
      if (el) {
        const orig = el.dataset.label || el.textContent || profile.email
        el.dataset.label = orig
        el.textContent = '✓ Copied to clipboard'
        setTimeout(() => {
          if (el && el.dataset.label) el.textContent = el.dataset.label
        }, 1800)
      }
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const year = new Date().getFullYear()

  return (
    <section
      id="colophon"
      className="relative bg-ink text-bone px-6 md:px-10 pt-32 md:pt-40 pb-12 overflow-hidden"
    >
      {/* Section header */}
      <div className="grid grid-cols-12 gap-x-4 mb-20 md:mb-24">
        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40">№ 07</div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/85 mt-1">
            Colophon
          </div>
          <div className="dotted-line my-4 border-bone/30" />
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/40 leading-[1.7]">
            Contact · imprint
            <br />
            credits · end matter
          </div>
        </div>
        <div className="col-span-12 md:col-span-9 mt-6 md:mt-0" data-reveal>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-rust mb-6">
            ❡ Get in touch
          </div>
          <h2 className="font-display font-light text-[clamp(2.6rem,9vw,9rem)] leading-[0.86] tracking-tightest optical">
            <span className="word-mask word-mask-block">
              <span>Działajmy</span>
            </span>
            <span className="word-mask word-mask-block">
              <span>
                <span className="italic font-light" style={{ fontFamily: 'var(--font-serif)' }}>
                  razem.
                </span>
              </span>
            </span>
          </h2>
        </div>
      </div>

      {/* Big email — direct line */}
      <div className="mb-24 md:mb-32" data-fade-up data-revealed="true">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-4">
          // Direct line
        </div>
        <a
          ref={emailRef}
          href={`mailto:${profile.email}`}
          onClick={onCopy}
          data-cursor="copy"
          className="font-display font-light text-[clamp(1.6rem,5vw,4.5rem)] leading-[1.1] tracking-tight break-all hover:text-rust transition-colors duration-500"
        >
          {profile.email}
        </a>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/35 mt-4">
          Click to copy · or send a message directly
        </div>
      </div>

      {/* Imprint grid */}
      <div
        className="grid grid-cols-12 gap-x-4 gap-y-12 border-y border-bone/15 py-12 mb-12"
        data-stagger
        data-reveal
      >
        <div className="col-span-6 md:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-4">
            Editor
          </div>
          <div className="font-display text-[22px] leading-tight font-light">{profile.name}</div>
          <div className="font-mono text-[11px] mt-2 text-bone/55">@{profile.handle}</div>
          <div className="font-mono text-[11px] mt-1 text-bone/55">
            {profile.location} · CET +01
          </div>
        </div>

        <div className="col-span-6 md:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-4">
            Status
          </div>
          <div className="flex items-center gap-2.5 font-display text-[22px] leading-tight font-light">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rust animate-blink" />
            {profile.available ? 'Open' : 'Booked'}
          </div>
          <div
            className="font-display italic text-[14px] mt-2 text-bone/55"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            for commissions in cinematic web,
            <br />
            n8n, MCP &amp; AI media
          </div>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-4">
            Channels
          </div>
          <ul className="font-display text-[22px] leading-[1.5] font-light space-y-0.5">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="open"
                  className="link-line text-bone hover:text-rust transition-colors"
                >
                  {s.label}{' '}
                  <span
                    className="italic text-[18px] text-bone/55"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-4">
            Issue
          </div>
          <div className="font-display text-[22px] leading-tight font-light">Vol. 01 · MMXXVI</div>
          <div className="font-mono text-[11px] mt-2 text-bone/55">Personal Archive</div>
          <div className="font-mono text-[11px] mt-1 text-bone/55 italic">
            Updated continuously
          </div>
        </div>
      </div>

      {/* Credits / Stack — refined */}
      <div className="grid grid-cols-12 gap-x-4 gap-y-10 mb-20" data-stagger data-reveal>
        <div className="col-span-12 md:col-span-6">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-4">
            Crafted with
          </div>
          <p className="font-mono text-[12px] leading-[1.85] text-bone/75 max-w-[60ch]">
            Next.js 15 · React 19 · TypeScript · Tailwind · GSAP + ScrollTrigger · Lenis · d3-force ·
            Space Grotesk · Fraunces · JetBrains Mono.{' '}
            <span
              className="italic text-bone/55"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              No tracking, no cookies, no analytics theatre.
            </span>
          </p>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-4">
            Worked with the AI
          </div>
          <p className="font-mono text-[12px] leading-[1.85] text-bone/75 max-w-[60ch]">
            Claude Code · MCP servers · Ollama (qwen3:8b, local) · Higgsfield · Suno · CapCut ·
            Photoshop · n8n.{' '}
            <span
              className="italic text-bone/55"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              The model writes alongside me — never in place of me.
            </span>
          </p>
        </div>
      </div>

      {/* Big footer wordmark — quiet, monumental */}
      <div className="relative">
        <div className="font-display font-light text-bone leading-[0.84] tracking-tightest optical text-[clamp(4rem,18vw,18rem)] select-none">
          ADAM B.
        </div>
        {/* Hairline underneath */}
        <div className="h-px bg-bone/20 mt-8" />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40">
        <span>© {year} Adam Bytniewski · Made in Polska</span>
        <span className="md:text-center italic font-light" style={{ fontFamily: 'var(--font-serif)' }}>
          End of issue
        </span>
        <span className="md:text-right">Set in Space Grotesk · Fraunces · JetBrains Mono</span>
      </div>
    </section>
  )
}
