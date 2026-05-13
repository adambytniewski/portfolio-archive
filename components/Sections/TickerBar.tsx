'use client'

const TICKER_ITEMS = [
  { tag: 'Status', val: 'Open for commissions' },
  { tag: 'Now', val: 'Building cinematic web stack' },
  { tag: 'Stack', val: 'Claude · MCP · n8n' },
  { tag: 'Latest', val: 'Issue №01 · Vol. 2026' },
  { tag: 'Location', val: 'Polska · CET +01' },
  { tag: 'Languages', val: 'PL · EN · TS · PY · GLSL' },
  { tag: 'Focus', val: 'AI media + automation pipelines' },
  { tag: 'Method', val: 'embeddings, not fine-tuning' },
  { tag: 'Working on', val: 'Second Brain · v0.4' },
  { tag: 'Listening', val: 'Suno generative ambient' },
  { tag: 'Building with', val: 'Higgsfield · CapCut' },
  { tag: 'Coffee count', val: '003' },
]

export default function TickerBar() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <section className="relative bg-ink text-bone border-y border-ink/30 overflow-hidden">
      <div className="flex items-stretch">
        <div className="marquee-mask flex-1 overflow-hidden py-4">
          <div className="flex w-max animate-ticker hover:[animation-play-state:paused]">
            {items.map((item, i) => (
              <div
                key={`a-${i}`}
                className="flex items-baseline gap-3 px-7 font-mono text-[11px] tracking-[0.25em] uppercase whitespace-nowrap"
              >
                <span className="text-rust text-[8px]">●</span>
                <span className="text-bone/45 text-[10px]">{item.tag}</span>
                <span
                  className="italic text-[14px] text-bone -translate-y-[1px] font-light"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {item.val}
                </span>
                <span className="text-bone/20 ml-3">/</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom rule with metadata */}
      <div className="border-t border-bone/10 px-6 md:px-10 py-2.5 flex items-center justify-between font-mono text-[9px] tracking-[0.3em] uppercase text-bone/45">
        <div className="flex items-center gap-5">
          <span>Frequency 24/7</span>
          <span className="hidden sm:inline text-bone/30">·</span>
          <span className="hidden sm:inline">Signal · AI · Web · Automation · Media</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-1 h-1 rounded-full bg-rust animate-blink" />
          <span>Live broadcast</span>
        </div>
      </div>
    </section>
  )
}
