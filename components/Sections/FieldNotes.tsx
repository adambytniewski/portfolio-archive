'use client'

import nowData from '../../content/now.json'

const TAG_GLYPH: Record<string, string> = {
  skill: '※',
  tooling: '✚',
  automation: '⟁',
  music: '♪',
  'ai-video': '◐',
  build: '◯',
  research: '◇',
  experiment: '✦',
}

const TAG_LABEL: Record<string, string> = {
  skill: 'Skill',
  tooling: 'Tooling',
  automation: 'Automation',
  music: 'Music',
  'ai-video': 'AI · Video',
  build: 'Build',
  research: 'Research',
  experiment: 'Experiment',
}

export default function FieldNotes() {
  const fmtDate = (s: string) => {
    const d = new Date(s)
    return {
      day: d.toLocaleDateString('en-GB', { day: '2-digit' }),
      mon: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
      year: d.toLocaleDateString('en-GB', { year: 'numeric' }),
      full: d
        .toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long' })
        .toUpperCase(),
    }
  }
  const latest = fmtDate(nowData.items[0].date)

  return (
    <section
      id="notes"
      className="relative bg-bone px-6 md:px-10 py-28 md:py-36 border-t border-ink/8"
    >
      {/* Section header */}
      <div className="grid grid-cols-12 gap-x-4 mb-14 md:mb-16">
        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/45">№ 06</div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/85 mt-1">
            Field Notes
          </div>
          <div className="dotted-line my-4" />
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45 leading-[1.7]">
            Updated continuously.
            <br />
            From the workshop.
          </div>
          <div className="hidden md:flex items-center gap-2.5 mt-5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rust animate-blink" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/65">
              Live broadcast
            </span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-9 mt-6 md:mt-0" data-reveal>
          <h2 className="font-display font-light text-[clamp(2.4rem,7vw,7rem)] leading-[0.92] tracking-tightest optical">
            <span className="word-mask word-mask-block">
              <span>Notatki</span>
            </span>
            <span className="word-mask word-mask-block">
              <span>
                <span className="italic font-light" style={{ fontFamily: 'var(--font-serif)' }}>
                  z pracowni.
                </span>
              </span>
            </span>
          </h2>
          <p className="mt-7 font-mono text-[12px] leading-[1.85] text-ink/55 max-w-[58ch]">
            Dziennik tego co teraz buduję, czego się uczę, co odkrywam. Najnowsza notatka u góry.
            Aktualizowane regularnie — sekcja żyje pod palcami.
          </p>
        </div>
      </div>

      {/* Notes — refined journal layout */}
      <div className="relative" data-stagger data-reveal>
        {/* Vertical hairline left margin */}
        <div className="absolute top-0 bottom-0 left-[60px] md:left-[140px] w-px bg-rust/30 hidden sm:block pointer-events-none" />

        {nowData.items.map((n, i) => {
          const d = fmtDate(n.date)
          const isLatest = i === 0
          return (
            <article
              key={n.date}
              className="relative grid grid-cols-[60px_1fr] md:grid-cols-[140px_1fr] gap-x-8 md:gap-x-12 py-10 md:py-14 border-b border-ink/8 group"
            >
              {/* Date stack — left margin, refined */}
              <div className="flex flex-col leading-none pt-1">
                <span className="font-display text-[44px] md:text-[72px] font-extralight tracking-tightest tabular-nums text-ink leading-[0.9]">
                  {d.day}
                </span>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/45 mt-2">
                  {d.mon} · {d.year}
                </span>
                {isLatest && (
                  <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.3em] uppercase text-rust border border-rust/50 px-2 py-1 w-fit">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-rust animate-blink" />
                    Latest
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-ink/40 tabular-nums">
                    Entry / {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="h-px w-6 bg-ink/15" />
                  <span className="text-rust text-base leading-none">
                    {TAG_GLYPH[n.tag] || '·'}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-ink/65">
                    {TAG_LABEL[n.tag] || n.tag}
                  </span>
                </div>
                <h3 className="font-display text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.1] tracking-tight font-light max-w-[44ch] text-ink">
                  {n.title}
                </h3>
                <p
                  className="mt-4 font-display italic text-[16px] md:text-[18px] leading-[1.55] text-ink/65 max-w-[64ch]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {n.body}
                </p>
              </div>
            </article>
          )
        })}
      </div>

      {/* Footer rule */}
      <div className="mt-16 pt-6 border-t border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[10px] tracking-[0.3em] uppercase text-ink/45">
        <span>
          Last updated · {latest.day} {latest.mon} {latest.year}
        </span>
        <span className="hidden sm:inline italic font-light" style={{ fontFamily: 'var(--font-serif)' }}>
          page intentionally left living
        </span>
        <span className="text-ink/30">P. 18 / 24</span>
      </div>
    </section>
  )
}
