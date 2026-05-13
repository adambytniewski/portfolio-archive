'use client'

const PARAGRAPH = `Buduję rzeczy które do niedawna wymagały zespołu — sam, z AI jako współpracownikiem. Cinematic strony internetowe, automatyzacje n8n, system second brain, generowanie wideo, foto i muzyki. Nie wierzę w fine-tuning. Wierzę w embeddings, prompt engineering i krótkie pętle iteracji.`

const PRINCIPLES = [
  {
    no: '01',
    title: 'AI to współpracownik, nie zabawka',
    body: 'Każda rzecz która powstaje w tym studio przechodzi przez Claude albo lokalnego Ollamę zanim trafi do Ciebie. To nie skrót — to nowy sposób pracy.',
  },
  {
    no: '02',
    title: 'Embeddings nad fine-tuning',
    body: 'RAG, vector DB, MCP. Model nie musi pamiętać — musi umieć szukać. Tańsze, szybsze, znacznie bardziej elastyczne.',
  },
  {
    no: '03',
    title: 'Cinematic by default',
    body: 'Brak płaskich landingów. Każda strona ma głębokość — Three.js, GSAP, Lenis, własne shadery. Standardem jest 60 fps.',
  },
  {
    no: '04',
    title: 'Living archive',
    body: 'Ta strona to nie portfolio z jednego wieczoru. Aktualizuję ją co dwa dni — nowy projekt, nowe odkrycie, nowa myśl.',
  },
]

export default function Manifest() {
  const words = PARAGRAPH.split(' ')
  const firstLetter = words[0][0]
  const restOfFirst = words[0].slice(1)

  return (
    <section
      id="manifest"
      className="relative bg-paper px-6 md:px-10 py-28 md:py-40 border-t border-ink/8"
    >
      {/* Section header */}
      <div className="grid grid-cols-12 gap-x-4 mb-20 md:mb-24">
        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/45">
            № 02
          </div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/85 mt-1">
            Manifest
          </div>
          <div className="dotted-line my-4" />
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45 leading-[1.7]">
            What I believe.
            <br />
            How I build.
          </div>

          {/* Editor's note */}
          <div className="hidden md:block mt-16 pl-4 border-l border-ink/15">
            <div
              className="font-display italic font-light text-[18px] leading-[1.5] text-ink/70"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              “The model is a collaborator,
              <br />
              not a vending machine.”
            </div>
            <div className="mt-4 font-mono text-[10px] tracking-[0.25em] uppercase text-ink/40">
              — A.B., May 2026
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-9 mt-8 md:mt-0">
          {/* Editorial paragraph with refined drop cap */}
          <div className="relative max-w-[64ch]" data-fade-up data-reveal>
            <span
              className="font-display font-light text-rust float-left text-[160px] leading-[0.82] mr-4 -mt-2 italic"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {firstLetter}
            </span>
            <p className="font-display text-[clamp(1.4rem,2.4vw,2.2rem)] leading-[1.32] tracking-tight text-ink/95 font-light">
              {restOfFirst} {words.slice(1).join(' ')}
            </p>
          </div>

          {/* Pull quote */}
          <div className="my-20 md:my-24 max-w-[44ch]" data-fade-up data-reveal>
            <div className="text-rust mb-4 font-mono text-[10px] tracking-[0.3em] uppercase">
              ❡ The thesis
            </div>
            <div
              className="border-l border-rust pl-6 font-display italic font-light text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1.25] text-ink"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Strona, automatyzacja, track muzyczny — wszystko zaczyna się od jednego promptu i kończy w produkcji.
            </div>
          </div>

          {/* Principles grid — refined editorial */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14"
            data-stagger
            data-reveal
          >
            {PRINCIPLES.map((p) => (
              <div key={p.no} className="relative pt-7 border-t border-ink/15">
                <div className="absolute top-3 right-0 font-mono text-[10px] tracking-[0.3em] uppercase text-ink/35">
                  Principle / {p.no}
                </div>
                <div className="font-display text-[24px] md:text-[28px] font-light leading-[1.15] tracking-tight max-w-[22ch] text-ink">
                  {p.title.split(' ').map((w, i) => (
                    <span key={i} className={i === p.title.split(' ').length - 1 ? '' : ''}>
                      {w}{i < p.title.split(' ').length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </div>
                <div className="mt-4 font-mono text-[12px] leading-[1.85] text-ink/65 max-w-[44ch]">
                  {p.body}
                </div>
              </div>
            ))}
          </div>

          {/* Closing rule */}
          <div className="mt-20 flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] uppercase text-ink/35">
            <span className="h-px bg-ink/15 flex-1" />
            <span>End of manifest</span>
            <span>—</span>
            <span>Continue ↓</span>
          </div>
        </div>
      </div>
    </section>
  )
}
