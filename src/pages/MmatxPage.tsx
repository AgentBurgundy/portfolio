import { useEffect, useState, type ReactNode } from 'react'
import { MotionConfig, motion, useReducedMotion } from 'framer-motion'
import notes from '../content/mmatx-summary.json'
import './mmatx.css'

function Arrow({ external = false }: { external?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={external ? 'mx-arrow mx-external' : 'mx-arrow'}><path d="M4 12h15M13 5l7 7-7 7" /></svg>
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { y: 12 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: .5, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
}

function Mountain() {
  const reduced = useReducedMotion()
  return <svg className="mx-mountain" viewBox="0 0 540 300" fill="none" aria-hidden="true">
    <circle cx="365" cy="82" r="39" fill="#f4a17d" opacity=".07" />
    <circle cx="365" cy="82" r="26" stroke="#f4a17d" strokeOpacity=".4" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${10 - i * 7} ${280 + i * 4} 200 ${48 + i * 16} 280 ${168 + i * 10} 356 ${106 + i * 15} ${535 + i * 8} ${280 + i * 4}`} stroke="#f4a17d" strokeWidth={i === 0 ? 1.5 : .8} strokeOpacity={i === 0 ? .7 : .11 + i * .01} />)}
    <motion.path d="M70 275C145 270 170 159 249 180S365 240 441 190" stroke="#f4a17d" strokeWidth="2" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: .2 }} />
    <circle cx="249" cy="180" r="4" fill="#f4a17d" /><circle cx="441" cy="190" r="4" fill="#f4a17d" />
  </svg>
}

function useMetadata() {
  useEffect(() => {
    const oldTitle = document.title
    const originals: { node: Element; attr: string; value: string | null; created: boolean }[] = []
    const set = (selector: string, tag: string, key: string, attr: string, value: string) => {
      let node = document.head.querySelector(selector)
      const created = !node
      if (!node) { node = document.createElement(tag); node.setAttribute(tag === 'link' ? 'rel' : 'name', key); document.head.append(node) }
      originals.push({ node, attr, value: node.getAttribute(attr), created })
      node.setAttribute(attr, value)
    }
    document.title = 'Mountain Movers Austin | A few public observations | AI Baker'
    set('meta[name="robots"]', 'meta', 'robots', 'content', 'noindex, nofollow')
    set('meta[name="description"]', 'meta', 'description', 'content', 'A brief look at public reputation, a few practical website improvements, and a conversation about internal workflows. October 13, 2026 snapshot.')
    set('link[rel="canonical"]', 'link', 'canonical', 'href', 'https://aibaker.io/mmatx')
    return () => {
      document.title = oldTitle
      originals.forEach(({ node, attr, value, created }) => { if (created) node.remove(); else if (value === null) node.removeAttribute(attr); else node.setAttribute(attr, value) })
    }
  }, [])
}

export default function MmatxPage() {
  useMetadata()
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const reduced = useReducedMotion()

  function openSource(id: string) {
    setSourcesOpen(true)
    window.requestAnimationFrame(() => document.getElementById(`source-${id}`)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' }))
  }

  return <MotionConfig reducedMotion="user"><div className="mmatx">
    <a className="mx-skip" href="#presentation">Skip to notes</a>
    <header className="mx-header">
      <a href="/" className="mx-brand" aria-label="AI Baker home"><span className="mx-brand-mark">a</span>ai baker<span className="mx-brand-dot">.</span></a>
      <nav aria-label="Call page"><a href="#public-picture">Public picture</a><a href="#observations">What I noticed</a><a href="#together">Explore together <Arrow /></a></nav>
    </header>
    <main id="presentation" tabIndex={-1}>
      <section className="mx-hero" aria-labelledby="mx-title">
        <div className="mx-container mx-hero-inner">
          <Reveal><span className="mx-eyebrow">MOUNTAIN MOVERS / AUSTIN</span><h1 id="mx-title">What I noticed<br /><em>from the outside.</em></h1><p>A strong public reputation, a few practical improvements,<br className="mx-desktop-break" /> and a starting point for our conversation.</p><a className="mx-hero-link" href="#observations">A few places I’d start <Arrow /></a></Reveal>
          <Mountain />
          <span className="mx-hero-date">PUBLIC SNAPSHOT · OCTOBER 13, 2026</span>
        </div>
      </section>

      <section id="public-picture" className="mx-container mx-public" aria-label="Public picture">
        <div className="mx-metrics">
          {notes.branches.map(branch => <Reveal className="mx-metric" key={branch.name}>
            <span className="mx-label">{branch.shortName.toUpperCase()} · GOOGLE</span>
            <div className="mx-metric-value" aria-label={`${branch.rating?.toFixed(1) ?? 'Unknown'} stars`}>{branch.rating?.toFixed(1) ?? 'Unknown'}<span aria-hidden="true">★</span></div>
            <p><strong>{branch.reviews?.toLocaleString() ?? 'Unknown'}</strong> reviews on this branch</p>
            <a href={branch.url} target="_blank" rel="noopener noreferrer">Branch profile <Arrow external /><span className="sr-only"> (opens in a new tab)</span></a>
          </Reveal>)}
          <Reveal className="mx-metric"><span className="mx-label">ACTIVITY IN THE INSPECTED SAMPLE</span><div className="mx-metric-value">5<span className="mx-denominator">/ 5</span></div><p>Selected review cards with owner replies, <strong>per branch</strong>. Recent Google posts observed on both.</p><span className="mx-metric-note">Not newest reviews or an overall response rate / speed.</span></Reveal>
          <Reveal className="mx-metric"><span className="mx-label">EXISTING WEBSITE FOUNDATION</span><div className="mx-metric-value">{notes.contentUrls}</div><p>Sitemap URLs, plus service content, crew information, structured data and rendered canonicals.</p><span className="mx-metric-note">I’d improve useful proof and accuracy before adding volume.</span></Reveal>
        </div>
        <ReviewComparison />
      </section>

      <section id="observations" className="mx-observation-section">
        <div className="mx-container">
          <Reveal className="mx-section-heading"><span className="mx-eyebrow">A FEW PLACES I’D START</span><h2>Small, useful improvements.</h2><p>These are observations from the public-facing presence. I’d confirm the details with you before making changes.</p></Reveal>
          <div className="mx-observations">
            {notes.observations.map((item, i) => <Reveal className="mx-observation" key={item.id}>
              <span className="mx-observation-number">0{i + 1}</span>
              <div><div className="mx-observation-label"><span>{item.kind}</span><span>{item.scope}</span></div><h3>{item.title}</h3><p>{item.body}</p></div>
              <button className="mx-source-button" onClick={() => openSource(item.sourceIds[0])} aria-label={`View source and context for ${item.title}`}>Source <Arrow external /></button>
            </Reveal>)}
          </div>
        </div>
      </section>

      <section id="together" className="mx-container mx-together">
        <Reveal><span className="mx-eyebrow">WHAT WE CAN EXPLORE TOGETHER</span><h2>The inside picture<br /><em>comes from your team.</em></h2><p>I’d first learn how inquiries, estimates, scheduling and follow-up actually work. Then we can choose where a process change or AI assistance could be useful.</p></Reveal>
        <Reveal className="mx-conversation"><span className="mx-label">THREE QUESTIONS TO START</span><ol><li>Where does the team repeat the same work?</li><li>Where do handoffs or follow-ups get difficult?</li><li>What tools and data are already working well?</li></ol><p>No backend assumptions. One useful pilot after we understand the workflow.</p></Reveal>
      </section>

      <div className="mx-container mx-reference-wrap">
        <details className="mx-references" open={sourcesOpen} onToggle={e => setSourcesOpen(e.currentTarget.open)}>
          <summary>Sources & short context <span aria-hidden="true">+</span></summary>
          <p className="mx-reference-intro">Public observations from October 13, 2026. Targeted samples, not a complete census or a measure of revenue, traffic, conversion, rankings or market share.</p>
          <div className="mx-reference-grid">{notes.references.map(ref => <div id={`source-${ref.id}`} className="mx-reference" key={ref.id}><h3>{ref.label}</h3><p>{ref.note}</p><div>{ref.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} <Arrow external /><span className="sr-only"> (opens in a new tab)</span></a>)}</div></div>)}</div>
        </details>
      </div>
    </main>
    <footer className="mx-container mx-footer"><span>Prepared by Ronald / AI Baker</span><span>Unlisted · publicly accessible</span></footer>
  </div></MotionConfig>
}

function ReviewComparison() {
  const [all, setAll] = useState(false)
  const rows = notes.chart.filter(p => all || p.selected).sort((a, b) => (b.reviews ?? -1) - (a.reviews ?? -1))
  const maximum = Math.max(...rows.map(p => p.reviews ?? 0))
  return <Reveal className="mx-comparison">
    <div className="mx-chart-intro"><span className="mx-eyebrow">BRANCH-SPECIFIC GOOGLE REVIEWS</span><h2>A solid base<br />{' '}to build on.</h2><p>Austin’s profile beside {all ? 'twelve' : 'six selected'} Greater Austin comparator branches.</p><button aria-expanded={all} onClick={() => setAll(!all)}>{all ? 'Return to selected branches' : 'See all 12 comparator branches'} <span aria-hidden="true">{all ? '−' : '+'}</span></button></div>
    <div className="mx-chart"><div className="mx-chart-date"><span>PUBLIC REVIEW COUNTS</span><span>OCT 13, 2026</span></div><div className="mx-chart-rows">{rows.map(p => <div className={`mx-chart-row ${p.target ? 'mx-target' : ''}`} key={p.name}>
      <a href={p.url} target="_blank" rel="noopener noreferrer">{p.label}<span className="sr-only"> Google profile (opens in a new tab)</span></a>
      <div className="mx-bar-track" aria-hidden="true"><div className="mx-bar" style={{ width: `${(p.reviews ?? 0) / maximum * 100}%` }} /></div>
      <strong>{p.reviews?.toLocaleString() ?? 'Unknown'}</strong>
    </div>)}</div><p className="mx-chart-note">Exact sampled branches, never combined. Counts do not establish ranking or market share. Closed profiles excluded. Round Rock is separate above.</p></div>
  </Reveal>
}
