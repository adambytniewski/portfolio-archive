'use client'

import workData from '../../content/work.json'

const FOLIO_IDS = ['second-brain', 'studio-elements', 'higgsfield-reel', 'n8n-invoices']
const ROTATIONS = [-1.4, 1.2, -0.8, 1.6]
const COL_SPANS = [
  'md:col-span-7 md:col-start-1',
  'md:col-span-5 md:col-start-8',
  'md:col-span-6 md:col-start-2',
  'md:col-span-7 md:col-start-6',
]

const ANNOTATIONS = [
  { text: 'flagship — żyje cały czas', side: 'right' as const, offsetY: 28 },
  { text: 'pierwszy duży scroll-driven build', side: 'left' as const, offsetY: -8 },
  { text: 'test 5s shotów', side: 'left' as const, offsetY: 28 },
  { text: '3 min ręcznie → 8 sek.', side: 'right' as const, offsetY: -8 },
]

export default function Folio() {
  const items = FOLIO_IDS
    .map((id) => workData.items.find((i) => i.id === id))
    .filter(Boolean) as typeof workData.items

  return (
    <section
      id="folio"
      className="relative bg-paper px-6 md:px-10 py-28 md:py-40 overflow-hidden"
    >
      {/* Section header */}
      <div className="grid grid-cols-12 gap-x-4 mb-16 md:mb-20">
        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/45">№ 05</div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/85 mt-1">Folio</div>
          <div className="dotted-line my-4" />
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45 leading-[1.7]">
            Selected pieces
            <br />
            from the archive.
            <br />
            <span className="text-ink/30">— curated by editor</span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-9 mt-6 md:mt-0" data-reveal>
          <h2 className="font-display font-light text-[clamp(2.4rem,7vw,7rem)] leading-[0.92] tracking-tightest optical">
            <span className="word-mask word-mask-block">
              <span>Wybór</span>
            </span>
            <span className="word-mask word-mask-block">
              <span>
                <span className="italic" style={{ fontFamily: 'var(--font-serif)' }}>
                  prac
                </span>
                {' '}z archiwum.
              </span>
            </span>
          </h2>
          <p className="mt-7 font-mono text-[12px] leading-[1.8] text-ink/55 max-w-[52ch]">
            Cztery pozycje wyróżnione w tym wydaniu — każda reprezentuje inny obszar
            praktyki. Pełny katalog dostępny w sekcji <span className="italic" style={{ fontFamily: 'var(--font-serif)' }}>Archive Index</span>.
          </p>
        </div>
      </div>

      {/* Photo plates — quiet polaroid grid */}
      <div
        className="relative grid grid-cols-1 md:grid-cols-12 gap-y-20 md:gap-y-28 gap-x-6 min-h-[800px]"
        data-stagger
        data-reveal
      >
        {items.map((item, i) => {
          const ann = ANNOTATIONS[i]
          return (
            <article
              key={item.id}
              data-cursor="open"
              className={`relative ${COL_SPANS[i]} group`}
            >
              <div
                className="folio-plate relative transition-transform duration-700 ease-out group-hover:!rotate-0 group-hover:scale-[1.015]"
                style={{ transform: `rotate(${ROTATIONS[i]}deg)` }}
              >
                {/* Plate body — quieter, no tape */}
                <div className="relative bg-bone p-[10px] md:p-3 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_18px_40px_-22px_rgba(14,14,12,0.28),0_2px_4px_rgba(14,14,12,0.08)]">
                  <div className="aspect-[4/3] bg-paper overflow-hidden relative">
                    <img
                      src={item.cover}
                      alt=""
                      className="w-full h-full object-cover film-photo transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    />
                    {/* Catalog number — tiny, top-left, refined */}
                    <div className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.3em] uppercase text-ink/85 bg-paper/90 backdrop-blur-[1px] px-2 py-1 border border-ink/15">
                      Cat. № {String(i + 1).padStart(3, '0')}
                    </div>
                    {/* Featured ribbon for index 0 */}
                    {i === 0 && (
                      <div className="absolute bottom-3 right-3 font-mono text-[9px] tracking-[0.3em] uppercase text-bone bg-rust px-2 py-1">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Caption strip below image */}
                  <div className="px-1 pt-3 pb-1">
                    <div className="flex items-baseline justify-between font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45 mb-2">
                      <span>
                        {new Date(item.date)
                          .toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                          .toUpperCase()}
                      </span>
                      <span>{item.category.toUpperCase()}</span>
                    </div>
                    <h3 className="font-display text-[22px] md:text-[28px] leading-[1.05] tracking-tight font-light text-ink">
                      {item.title}
                    </h3>
                    <p
                      className="mt-1.5 font-display italic text-[14px] md:text-[15px] leading-[1.4] text-ink/55"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {item.subtitle}
                    </p>
                    {/* Tag row */}
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      {item.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink/55 px-2 py-0.5 border border-ink/15"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hairline frame on hover */}
                  <div className="pointer-events-none absolute inset-0 border border-rust/0 group-hover:border-rust/40 transition-colors duration-500" />
                </div>

                {/* Margin annotation — handwritten editorial */}
                {ann && (
                  <div
                    className={[
                      'hidden lg:flex absolute items-center gap-2 font-display italic text-[14px] leading-tight text-ink/55 max-w-[220px] pointer-events-none',
                      ann.side === 'right' ? 'left-full pl-6' : 'right-full pr-6 flex-row-reverse',
                    ].join(' ')}
                    style={{
                      top: `calc(50% + ${ann.offsetY}px)`,
                      fontFamily: 'var(--font-serif)',
                    }}
                  >
                    <span
                      className="block w-12 h-px"
                      style={{ background: 'currentColor', opacity: 0.3 }}
                    />
                    <span className={ann.side === 'right' ? '' : 'text-right'}>{ann.text}</span>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {/* Footer rule — refined */}
      <div className="mt-28 pt-6 border-t border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[10px] tracking-[0.3em] uppercase text-ink/45">
        <span>Selected by editor · {items.length} of {workData.items.length}</span>
        <span className="hidden sm:inline">— continued in Field Notes →</span>
        <span className="text-ink/30">P. 12 / 24</span>
      </div>
    </section>
  )
}
