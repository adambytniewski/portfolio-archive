'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force'
import workData from '../../content/work.json'

type Category =
  | 'app'
  | 'website'
  | 'automation'
  | 'video'
  | 'photo'
  | 'music'
  | 'skill'
  | 'tag'

interface Node extends SimulationNodeDatum {
  id: string
  label: string
  category: Category
  size: number
  type: 'project' | 'category' | 'skill' | 'tag'
  description?: string
  /** Custom dragged flag */
  dragging?: boolean
}

type Link = SimulationLinkDatum<Node> & { strength?: number }

// Category metadata
const CAT_META: Record<Category, { color: string; label: string }> = {
  app: { color: '#0e0e0c', label: 'Aplikacja' },
  website: { color: '#5b7a96', label: 'Strona' },
  automation: { color: '#5a6b3b', label: 'Automatyzacja' },
  video: { color: '#c8331f', label: 'Video' },
  photo: { color: '#c79a3a', label: 'Foto' },
  music: { color: '#7a766c', label: 'Muzyka' },
  skill: { color: '#0e0e0c', label: 'Skill' },
  tag: { color: '#7a766c', label: 'Tag' },
}

const SKILL_NODES: { id: string; label: string }[] = [
  { id: 'skill-claude', label: 'Claude' },
  { id: 'skill-mcp', label: 'MCP' },
  { id: 'skill-nextjs', label: 'Next.js' },
  { id: 'skill-three', label: 'Three.js' },
  { id: 'skill-gsap', label: 'GSAP' },
  { id: 'skill-n8n', label: 'n8n' },
  { id: 'skill-higgsfield', label: 'Higgsfield' },
  { id: 'skill-suno', label: 'Suno' },
  { id: 'skill-rag', label: 'RAG' },
  { id: 'skill-ollama', label: 'Ollama' },
]

// Map projects to skills they use
const PROJECT_SKILLS: Record<string, string[]> = {
  'second-brain': ['skill-claude', 'skill-mcp', 'skill-rag'],
  'studio-elements': ['skill-nextjs', 'skill-three', 'skill-gsap'],
  'n8n-invoices': ['skill-n8n', 'skill-claude'],
  'higgsfield-reel': ['skill-higgsfield'],
  'ollama-jarvis': ['skill-ollama', 'skill-claude'],
  'ai-photo-set': ['skill-higgsfield'],
  'ambient-track-01': ['skill-suno'],
  'claude-control': ['skill-claude', 'skill-mcp'],
}

export default function KnowledgeNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const simRef = useRef<Simulation<Node, Link> | null>(null)
  const [hover, setHover] = useState<Node | null>(null)
  const [active, setActive] = useState<Node | null>(null)
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [size, setSize] = useState({ w: 1000, h: 700 })

  // Build nodes + links once
  const { nodes, links } = useMemo(() => {
    const projectNodes: Node[] = workData.items.map((w) => ({
      id: w.id,
      label: w.title,
      category: w.category as Category,
      size: w.featured ? 18 : 12,
      type: 'project',
      description: w.subtitle,
    }))
    const skillNodes: Node[] = SKILL_NODES.map((s) => ({
      id: s.id,
      label: s.label,
      category: 'skill',
      size: 7,
      type: 'skill',
    }))
    // Hub nodes per category
    const cats: Category[] = ['app', 'website', 'automation', 'video', 'photo', 'music']
    const catNodes: Node[] = cats.map((c) => ({
      id: `cat-${c}`,
      label: CAT_META[c].label.toUpperCase(),
      category: c,
      size: 22,
      type: 'category',
    }))

    const allNodes: Node[] = [...catNodes, ...projectNodes, ...skillNodes]

    const links: Link[] = []
    // Connect projects to their category hub
    workData.items.forEach((w) => {
      links.push({
        source: w.id,
        target: `cat-${w.category}`,
        strength: 1.2,
      })
    })
    // Connect projects to skills
    Object.entries(PROJECT_SKILLS).forEach(([projectId, skillIds]) => {
      skillIds.forEach((s) => {
        links.push({ source: projectId, target: s, strength: 0.5 })
      })
    })
    // Connect related projects (cross edges for visual interest)
    const crossPairs: [string, string][] = [
      ['second-brain', 'claude-control'],
      ['ollama-jarvis', 'second-brain'],
      ['studio-elements', 'higgsfield-reel'],
      ['n8n-invoices', 'claude-control'],
      ['ai-photo-set', 'higgsfield-reel'],
    ]
    crossPairs.forEach(([a, b]) => links.push({ source: a, target: b, strength: 0.2 }))

    return { nodes: allNodes, links }
  }, [])

  // Resize observer
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const ro = new ResizeObserver(() => {
      const r = wrap.getBoundingClientRect()
      setSize({ w: Math.round(r.width), h: Math.round(r.height) })
    })
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  // Setup d3-force simulation
  useEffect(() => {
    const sim = forceSimulation<Node, Link>(nodes)
      .force(
        'link',
        forceLink<Node, Link>(links)
          .id((d) => d.id)
          .distance((d) => (typeof d.strength === 'number' && d.strength > 1 ? 60 : 110))
          .strength((d) => (d.strength ?? 0.5) * 0.6),
      )
      .force('charge', forceManyBody<Node>().strength((d) => (d.type === 'category' ? -380 : d.type === 'project' ? -180 : -90)))
      .force('collide', forceCollide<Node>().radius((d) => d.size + 8))
      .force('center', forceCenter(size.w / 2, size.h / 2))
      .force('x', forceX(size.w / 2).strength(0.04))
      .force('y', forceY(size.h / 2).strength(0.04))
      .alphaDecay(0.015)

    simRef.current = sim
    sim.on('tick', () => draw())
    return () => {
      sim.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links, size.w, size.h])

  // Reheat sim when filter changes
  useEffect(() => {
    simRef.current?.alpha(0.6).restart()
  }, [filter])

  // Draw on canvas
  const draw = () => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const w = size.w
    const h = size.h
    if (c.width !== w * dpr) {
      c.width = w * dpr
      c.height = h * dpr
      c.style.width = `${w}px`
      c.style.height = `${h}px`
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    // Background dotted grid
    ctx.fillStyle = 'rgba(14, 14, 12, 0.18)'
    for (let x = 0; x < w; x += 40) {
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath()
        ctx.arc(x, y, 0.7, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const inFilter = (n: Node) => filter === 'all' || n.category === filter || n.type === 'category'
    const dim = (n: Node) => filter !== 'all' && !inFilter(n)
    const isHighlighted = (n: Node) => {
      if (!hover && !active) return false
      const ref = active || hover
      if (!ref) return false
      if (n.id === ref.id) return true
      return links.some((l) => {
        const s = (l.source as Node).id ?? (l.source as unknown as string)
        const t = (l.target as Node).id ?? (l.target as unknown as string)
        return (s === ref.id && t === n.id) || (t === ref.id && s === n.id)
      })
    }

    // Draw links
    ctx.lineWidth = 1
    links.forEach((l) => {
      const s = l.source as Node
      const t = l.target as Node
      if (typeof s.x !== 'number' || typeof t.x !== 'number') return
      const dimmed = dim(s) && dim(t)
      const ref = active || hover
      const highlighted = ref ? (s.id === ref.id || t.id === ref.id) : false
      ctx.strokeStyle = highlighted
        ? 'rgba(200, 51, 31, 0.85)'
        : dimmed
        ? 'rgba(14, 14, 12, 0.05)'
        : 'rgba(14, 14, 12, 0.18)'
      ctx.lineWidth = highlighted ? 1.4 : 1
      ctx.beginPath()
      ctx.moveTo(s.x!, s.y!)
      ctx.lineTo(t.x!, t.y!)
      ctx.stroke()
    })

    // Draw nodes
    nodes.forEach((n) => {
      if (typeof n.x !== 'number') return
      const dimmed = dim(n)
      const highlighted = isHighlighted(n)
      ctx.globalAlpha = dimmed ? 0.18 : highlighted ? 1 : 0.92
      // Halo for category and active
      if (n.type === 'category' || (active && active.id === n.id)) {
        ctx.beginPath()
        ctx.arc(n.x!, n.y!, n.size + 6, 0, Math.PI * 2)
        ctx.fillStyle = `${CAT_META[n.category].color}14`
        ctx.fill()
      }
      // Body
      ctx.beginPath()
      ctx.arc(n.x!, n.y!, n.size, 0, Math.PI * 2)
      if (n.type === 'project') {
        ctx.fillStyle = CAT_META[n.category].color
      } else if (n.type === 'category') {
        ctx.fillStyle = '#ece8de'
      } else {
        ctx.fillStyle = '#ece8de'
      }
      ctx.fill()
      // Stroke
      ctx.strokeStyle = highlighted ? '#c8331f' : CAT_META[n.category].color
      ctx.lineWidth = n.type === 'category' ? 2 : highlighted ? 2 : 1
      ctx.stroke()

      // Inner dot for category to suggest "hub"
      if (n.type === 'category') {
        ctx.beginPath()
        ctx.arc(n.x!, n.y!, 3, 0, Math.PI * 2)
        ctx.fillStyle = CAT_META[n.category].color
        ctx.fill()
      }

      // Label for category nodes always; project labels on hover/highlight
      if (n.type === 'category' || highlighted || (n.type === 'project' && n.size > 14)) {
        ctx.globalAlpha = dimmed ? 0.4 : 1
        ctx.font = '500 10px JetBrains Mono, ui-monospace, monospace'
        ctx.fillStyle = '#0e0e0c'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const lbl = n.label.toUpperCase()
        const padX = 6
        const txtW = ctx.measureText(lbl).width
        // Background chip
        ctx.fillStyle = '#ece8de'
        ctx.fillRect(n.x! - txtW / 2 - padX, n.y! + n.size + 6, txtW + padX * 2, 14)
        ctx.strokeStyle = 'rgba(14, 14, 12, 0.25)'
        ctx.strokeRect(n.x! - txtW / 2 - padX, n.y! + n.size + 6, txtW + padX * 2, 14)
        ctx.fillStyle = '#0e0e0c'
        ctx.fillText(lbl, n.x!, n.y! + n.size + 13)
      }
    })
    ctx.globalAlpha = 1
  }

  // Mouse interaction
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    let dragNode: Node | null = null
    const findNode = (mx: number, my: number) => {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i]
        if (typeof n.x !== 'number') continue
        const dx = mx - n.x
        const dy = my - (n.y ?? 0)
        if (dx * dx + dy * dy <= (n.size + 4) ** 2) return n
      }
      return null
    }
    const getXY = (e: MouseEvent | TouchEvent) => {
      const rect = c.getBoundingClientRect()
      const t = 'touches' in e ? e.touches[0] : e
      return { x: (t as MouseEvent).clientX - rect.left, y: (t as MouseEvent).clientY - rect.top }
    }
    const onMove = (e: MouseEvent) => {
      const { x, y } = getXY(e)
      if (dragNode) {
        dragNode.fx = x
        dragNode.fy = y
        simRef.current?.alpha(0.4).restart()
        return
      }
      const n = findNode(x, y)
      setHover(n)
      c.style.cursor = n ? 'grab' : 'default'
    }
    const onDown = (e: MouseEvent) => {
      const { x, y } = getXY(e)
      const n = findNode(x, y)
      if (n) {
        dragNode = n
        n.fx = x
        n.fy = y
        c.style.cursor = 'grabbing'
        simRef.current?.alphaTarget(0.3).restart()
      }
    }
    const onUp = () => {
      if (dragNode) {
        simRef.current?.alphaTarget(0)
        dragNode.fx = null
        dragNode.fy = null
        dragNode = null
        c.style.cursor = 'default'
      }
    }
    const onClick = (e: MouseEvent) => {
      const { x, y } = getXY(e)
      const n = findNode(x, y)
      setActive((prev) => (prev?.id === n?.id ? null : n))
    }

    c.addEventListener('mousemove', onMove)
    c.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    c.addEventListener('click', onClick)
    return () => {
      c.removeEventListener('mousemove', onMove)
      c.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      c.removeEventListener('click', onClick)
    }
  }, [nodes])

  const cats: Array<{ key: Category | 'all'; label: string; color: string }> = [
    { key: 'all', label: 'Wszystko', color: '#0e0e0c' },
    { key: 'app', label: 'Aplikacja', color: CAT_META.app.color },
    { key: 'website', label: 'Strona', color: CAT_META.website.color },
    { key: 'automation', label: 'Automatyzacja', color: CAT_META.automation.color },
    { key: 'video', label: 'Video', color: CAT_META.video.color },
    { key: 'photo', label: 'Foto', color: CAT_META.photo.color },
    { key: 'music', label: 'Muzyka', color: CAT_META.music.color },
  ]

  return (
    <section id="network" className="relative bg-paper px-6 md:px-10 py-28 md:py-36">
      {/* Section header */}
      <div className="grid grid-cols-12 gap-x-4 mb-14 md:mb-16">
        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/45">
            № 03
          </div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/85 mt-1">
            The Network
          </div>
          <div className="dotted-line my-4" />
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45 leading-[1.7]">
            Living map.
            <br />
            Drag any node.
          </div>
        </div>
        <div className="col-span-12 md:col-span-9 mt-6 md:mt-0">
          <h2 className="font-display font-light text-[clamp(2.4rem,7vw,7rem)] leading-[0.92] tracking-tightest optical">
            Praktyka{' '}
            <span className="italic font-light" style={{ fontFamily: 'var(--font-serif)' }}>
              jako sieć.
            </span>
          </h2>
          <p className="mt-7 font-mono text-[12px] leading-[1.85] text-ink/55 max-w-[58ch]">
            Każdy projekt jest węzłem. Połączenia pokazują wspólny stack i kategorie.
            Złap dowolny node i go przesuń — fizyka jest prawdziwa, sieć żyje pod palcami.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/40 mr-3 hidden sm:inline">
          Filter / view:
        </span>
        {cats.map((c) => {
          const isActive = filter === c.key
          return (
            <button
              key={c.key}
              data-cursor="filter"
              onClick={() => setFilter(c.key)}
              className={[
                'group relative font-mono text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 border transition-all duration-300',
                isActive
                  ? 'bg-ink text-bone border-ink'
                  : 'bg-transparent text-ink/65 border-ink/15 hover:border-ink/40 hover:text-ink',
              ].join(' ')}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
                style={{ background: isActive && c.key !== 'all' ? '#fff' : c.color }}
              />
              {c.label}
            </button>
          )
        })}
        <span className="ml-auto font-mono text-[10px] tracking-[0.3em] uppercase text-ink/40 tabular-nums">
          {nodes.filter((n) => n.type === 'project').length} projects · {nodes.filter((n) => n.type === 'skill').length} skills · {links.length} edges
        </span>
      </div>

      {/* Canvas */}
      <div
        ref={wrapRef}
        className="relative bg-bone border border-ink/25 aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden"
        data-cursor="drag"
      >
        <canvas ref={canvasRef} className="block" />

        {/* Corner crops */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-ink/60 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-ink/60 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-ink/60 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-ink/60 pointer-events-none" />

        {/* Coordinates HUD */}
        <div className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.18em] uppercase text-ink/60 pointer-events-none">
          fig. 02 / map of the practice
        </div>
        <div className="absolute top-3 right-3 font-mono text-[10px] tracking-[0.18em] uppercase text-ink/60 pointer-events-none flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rust animate-blink" />
          live simulation
        </div>

        {/* Hover/active panel — quieter, refined */}
        {(active || hover) && (
          <div
            className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-[440px] bg-paper/95 backdrop-blur-sm border border-ink/20 p-5 pointer-events-none shadow-[0_18px_40px_-22px_rgba(14,14,12,0.25)]"
          >
            <div className="flex items-baseline justify-between mb-2">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/45">
                {(active || hover)!.type === 'category'
                  ? 'Category hub'
                  : (active || hover)!.type === 'skill'
                  ? 'Skill node'
                  : 'Project node'}
              </div>
              <div
                className="font-mono text-[10px] tracking-[0.3em] uppercase flex items-center gap-1.5"
                style={{ color: CAT_META[(active || hover)!.category].color }}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
                {CAT_META[(active || hover)!.category].label}
              </div>
            </div>
            <div className="font-display text-[22px] leading-tight tracking-tight font-light">
              {(active || hover)!.label}
            </div>
            {(active || hover)!.description && (
              <div
                className="font-display italic text-[14px] leading-[1.55] text-ink/65 mt-2 max-w-[42ch]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {(active || hover)!.description}
              </div>
            )}
            <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-ink/35 mt-3 pt-3 border-t border-ink/10">
              {active ? '↺ Click again to release' : '◐ Click to pin · drag to move'}
            </div>
          </div>
        )}
      </div>

      {/* Legend below — refined */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-x-6 gap-y-3 mt-8 font-mono text-[10px]">
        {(['app', 'website', 'automation', 'video', 'photo', 'music'] as Category[]).map((c) => (
          <div key={c} className="flex items-center gap-2.5 tracking-[0.25em] uppercase text-ink/55">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: CAT_META[c].color }} />
            <span>{CAT_META[c].label}</span>
          </div>
        ))}
      </div>

      {/* Footer rule */}
      <div className="mt-12 pt-6 border-t border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[10px] tracking-[0.3em] uppercase text-ink/45">
        <span>Continued in Archive Index ↓</span>
        <span className="text-ink/30">P. 04 / 24</span>
      </div>
    </section>
  )
}
