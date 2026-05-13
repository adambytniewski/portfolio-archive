'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import workData from '../../content/work.json'

const CAT_DOT: Record<string, string> = {
  app: 'bg-ink',
  website: 'bg-sky',
  automation: 'bg-moss',
  video: 'bg-rust',
  photo: 'bg-ochre',
  music: 'bg-ash',
}

const CAT_LABEL: Record<string, string> = {
  app: 'APP',
  website: 'WEB',
  automation: 'AUTO',
  video: 'VIDEO',
  photo: 'PHOTO',
  music: 'MUSIC',
}

type SortKey = 'date' | 'title' | 'category'

export default function ArchiveIndex() {
  const root = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [hoverItem, setHoverItem] = useState<typeof workData.items[number] | null>(null)
  const [sortBy, setSortBy] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const items = useMemo(() => {
    const arr = [...workData.items]
    arr.sort((a, b) => {
      if (sortBy === 'date') {
        return sortDir === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
      }
      if (sortBy === 'title') {
        return sortDir === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      }
      return sortDir === 'asc' ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category)
    })
    return arr
  }, [sortBy, sortDir])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (previewRef.current && hoverItem) {
        const offset = 28
        previewRef.current.style.transform = `translate3d(${e.clientX + offset}px, ${e.clientY - 100}px, 0)`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [hoverItem])

  const toggleSort = (k: SortKey) => {
    if (sortBy === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortBy(k)
      setSortDir('desc')
    }
  }

  const fmtDate = (s: string) => {
    const d = new Date(s)
    return d
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .toUpperCase()
  }

  return (
    <section
      ref={root}
      id="archive"
      className="relative bg-bone px-6 md:px-10 py-28 md:py-36 border-y border-ink/8"
    >
      {/* Section header */}
      <div className="grid grid-cols-12 gap-x-4 mb-14 md:mb-16">
        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/45">№ 04</div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/85 mt-1">
            Archive Index
          </div>
          <div className="dotted-line my-4" />
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45 leading-[1.7]">
            {workData.items.length} entries
            <br />
            sortable · hover for preview
          </div>
        </div>
        <div className="col-span-12 md:col-span-9 mt-6 md:mt-0">
          <h2 className="font-display font-light text-[clamp(2.4rem,7vw,7rem)] leading-[0.92] tracking-tightest optical">
            Complete{' '}
            <span className="italic font-light" style={{ fontFamily: 'var(--font-serif)' }}>
              catalog.
            </span>
          </h2>
          <p className="mt-7 font-mono text-[12px] leading-[1.85] text-ink/55 max-w-[58ch]">
            Każdy projekt z archiwum w jednej tabeli. Sortowalna po dacie, tytule lub kategorii.
            Najedź na wpis aby zobaczyć podgląd okładki.
          </p>
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/40 mr-3">
          Sort by
        </span>
        {(['date', 'title', 'category'] as SortKey[]).map((k) => (
          <button
            key={k}
            data-cursor="sort"
            onClick={() => toggleSort(k)}
            className={[
              'font-mono text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 border transition-all duration-300',
              sortBy === k
                ? 'bg-ink text-bone border-ink'
                : 'border-ink/15 text-ink/65 hover:border-ink/40 hover:text-ink',
            ].join(' ')}
          >
            {k}
            {sortBy === k && <span className="ml-2 opacity-70">{sortDir === 'asc' ? '↑' : '↓'}</span>}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="archive-table relative" data-stagger data-reveal>
        {/* Header row */}
        <div className="hidden md:grid grid-cols-[60px_140px_110px_1.5fr_1.4fr_140px_50px] items-center gap-6 py-4 border-t border-b border-ink font-mono text-[9px] tracking-[0.3em] uppercase text-ink/55">
          <div>№</div>
          <div>Date</div>
          <div>Cat.</div>
          <div>Title</div>
          <div>Subject</div>
          <div>Stack</div>
          <div className="text-right">↗</div>
        </div>

        {items.map((item, i) => (
          <div
            key={item.id}
            data-cursor="open"
            className="archive-row group relative grid grid-cols-[40px_1fr] md:grid-cols-[60px_140px_110px_1.5fr_1.4fr_140px_50px] items-start md:items-center gap-x-4 md:gap-6 gap-y-2 py-6 md:py-7 border-b border-ink/10 transition-colors duration-300 hover:bg-ink/[0.03] cursor-pointer"
            onMouseEnter={() => setHoverItem(item)}
            onMouseLeave={() => setHoverItem(null)}
          >
            <div className="font-mono text-[11px] tabular-nums text-ink/40">
              {String(i + 1).padStart(3, '0')}
            </div>
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/55 tabular-nums">
              {fmtDate(item.date)}
            </div>
            <div className="md:col-start-3 col-span-2 md:col-span-1">
              <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase text-ink/65">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${CAT_DOT[item.category]}`}
                />
                {CAT_LABEL[item.category]}
              </span>
              {item.featured && (
                <span className="ml-2 inline-block font-mono text-[8px] tracking-[0.3em] uppercase text-rust border border-rust/60 px-1.5 py-0.5">
                  Featured
                </span>
              )}
            </div>
            <div className="md:col-start-4 col-span-2 md:col-span-1 font-display text-[22px] md:text-[28px] leading-[1.05] tracking-tight font-light text-ink">
              {item.title}
            </div>
            <div
              className="md:col-start-5 col-span-2 md:col-span-1 font-display italic text-[14px] md:text-[15px] leading-[1.45] text-ink/60 max-w-[44ch]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {item.subtitle}
            </div>
            <div className="md:col-start-6 col-span-2 md:col-span-1 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/45 leading-[1.5]">
              {item.stack.slice(0, 3).join(' · ')}
            </div>
            <div className="hidden md:flex justify-end">
              <span
                className="font-display italic text-[26px] leading-none text-ink/50 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-rust"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                ↗
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer rule */}
      <div className="mt-12 pt-6 border-t border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[10px] tracking-[0.3em] uppercase text-ink/45">
        <span>End of catalog · {items.length} entries</span>
        <span className="hidden sm:inline">— continued in Folio →</span>
        <span className="text-ink/30">P. 07 / 24</span>
      </div>

      {/* Floating preview — refined */}
      {hoverItem && (
        <div
          ref={previewRef}
          className="fixed top-0 left-0 z-40 pointer-events-none transition-opacity duration-300"
        >
          <div className="bg-bone p-3 -rotate-1 shadow-[0_24px_48px_-16px_rgba(14,14,12,0.32),0_2px_6px_rgba(14,14,12,0.12)] w-[280px]">
            <div className="aspect-[4/3] bg-paper overflow-hidden">
              <img src={hoverItem.cover} alt="" className="w-full h-full object-cover film-photo" />
            </div>
            <div className="mt-3 flex items-baseline justify-between font-mono text-[9px] tracking-[0.3em] uppercase text-ink/50">
              <span>{fmtDate(hoverItem.date)}</span>
              <span>{CAT_LABEL[hoverItem.category]}</span>
            </div>
            <div className="mt-1 font-display text-[15px] leading-tight tracking-tight font-light text-ink">
              {hoverItem.title}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
