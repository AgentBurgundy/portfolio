import { useRef, useState, type MouseEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { profile } from '../content/profile'
import { WebsitePreview } from '../components/projects/WebsitePreview'

export function ProjectsPage() {
  const projects = profile.featuredProjects

  return (
    <div className="pb-16 pt-4">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <p className="mt-2 max-w-lg text-sm text-white/40">
          A selection of products I{"'"}ve built and shipped.
          Each one owned end-to-end -- architecture, UI, deployment.
        </p>
      </motion.header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} />
        ))}
      </div>
    </div>
  )
}

type Project = (typeof profile.featuredProjects)[number]

function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 })
  const repoUrl = (p as unknown as { repoUrl?: string }).repoUrl

  function handleMouse(e: MouseEvent) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouse}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06] transition-all duration-500 hover:bg-white/[0.04] hover:ring-white/[0.14] hover:shadow-[0_0_60px_-12px_rgba(0,200,255,0.12)]"
    >
      {/* cursor glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px at ${glowPos.x}px ${glowPos.y}px, rgba(0,200,255,0.06), transparent 60%)`,
        }}
      />

      {/* preview on top */}
      <a href={p.url} target="_blank" rel="noreferrer" className="relative block overflow-hidden">
        <div className="transition-transform duration-700 group-hover:scale-[1.04]">
          <WebsitePreview url={p.url} previewSrc={p.previewImage} heightClassName="h-52" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00c8ff] via-[#7c3aed] to-[#ff3278] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </a>

      {/* info below */}
      <div className="relative flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold text-white/90">{p.name}</h2>
          <span className="shrink-0 rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-medium text-white/30">
            {p.kind}
          </span>
        </div>

        <p className="mt-1.5 text-sm text-white/35">{p.tagline}</p>

        <p className="mt-3 flex-1 text-[13px] leading-relaxed text-white/25">
          {p.note}
        </p>

        {/* stack */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span
              key={s}
              className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/25"
            >
              {s}
            </span>
          ))}
        </div>

        {/* links */}
        <div className="mt-4 flex gap-3 text-xs">
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="text-white/25 transition hover:text-[#00c8ff]"
          >
            Live {'\u2197'}
          </a>
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-white/25 transition hover:text-[#00c8ff]"
            >
              Source {'\u2197'}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
