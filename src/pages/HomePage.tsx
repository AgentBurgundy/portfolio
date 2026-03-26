import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, type MouseEvent as ReactMouse } from 'react'
import { profile } from '../content/profile'
import { WebsitePreview } from '../components/projects/WebsitePreview'

/* ── animation ── */

const ease = [0.22, 1, 0.36, 1] as const

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

/* ── page ── */

export function HomePage() {
  return (
    <div className="pb-16">
      <Hero />
      <Reveal>
        <Projects />
      </Reveal>
      <Reveal>
        <Stack />
      </Reveal>
      <Reveal>
        <CTA />
      </Reveal>
    </div>
  )
}

/* ════════════════════════════════════════
   HERO
   ════════════════════════════════════════ */

function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col justify-center py-20">
      {/* static orb — no mouse tracking, no overflow clip */}
      <div className="pointer-events-none fixed right-[-5vw] top-[5vh] hidden h-[600px] w-[600px] lg:block">
        <div className="absolute inset-0 animate-[spin_25s_linear_infinite] rounded-full bg-gradient-conic from-[#00c8ff] via-[#7c3aed] via-50% to-[#ff3278] opacity-20 blur-[100px]" />
        <div className="absolute inset-[15%] animate-[spin_18s_linear_infinite_reverse] rounded-full bg-gradient-conic from-[#ff3278] via-[#00c8ff] via-50% to-[#7c3aed] opacity-25 blur-[80px]" />
        <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-[#00c8ff]/25 to-[#7c3aed]/25 blur-[60px]" />
      </div>

      {/* slow orbiting rings — fixed so no clipping */}
      <div className="pointer-events-none fixed right-[2vw] top-[10vh] hidden lg:block">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="h-[450px] w-[450px] rounded-full border border-white/[0.04]"
        />
      </div>
      <div className="pointer-events-none fixed right-[6vw] top-[14vh] hidden lg:block">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
          className="h-[350px] w-[350px] rounded-full border border-dashed border-white/[0.03]"
        />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="relative z-10 max-w-2xl"
      >
        {/* eyebrow */}
        <motion.div variants={fadeUp} className="mb-8 flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-sm font-medium text-white/50">Available for new projects</span>
        </motion.div>

        {/* name */}
        <motion.h1
          variants={fadeUp}
          className="text-[clamp(3.5rem,10vw,8rem)] font-extrabold leading-[0.9] tracking-tighter"
        >
          <span className="block text-white">Ronald</span>
          <span className="block animate-gradient bg-gradient-to-r from-[#00c8ff] via-[#7c3aed] via-50% to-[#ff3278] bg-[length:200%_auto] bg-clip-text text-transparent">
            Barnhart
          </span>
        </motion.h1>

        {/* subtitle */}
        <motion.p
          variants={fadeUp}
          className="mt-8 max-w-lg text-lg leading-relaxed text-white/50 sm:text-xl"
        >
          Software engineer & founder. I build and ship full-stack
          products — AI, SaaS, games, mobile. From first commit to production.
        </motion.p>

        {/* actions */}
        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
          <Link to="/projects" className="group relative rounded-full p-[1px]">
            <div className="absolute inset-0 animate-gradient rounded-full bg-gradient-to-r from-[#00c8ff] via-[#7c3aed] to-[#ff3278] bg-[length:200%_auto] opacity-80 transition group-hover:opacity-100" />
            <div className="relative rounded-full bg-[#0a0a1a] px-8 py-3.5 text-sm font-semibold text-white transition group-hover:bg-[#0a0a1a]/80">
              View projects
            </div>
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-white/15 px-8 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Contact me
          </Link>
        </motion.div>

        {/* social links */}
        <motion.div
          variants={fadeUp}
          className="mt-16 flex items-center gap-6 text-sm"
        >
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="text-white/30 transition hover:text-white/70">GitHub</a>
          <a href="https://linkedin.com/in/ronaldbarnhart" target="_blank" rel="noreferrer" className="text-white/30 transition hover:text-white/70">LinkedIn</a>
          <a href="mailto:ronald@aibaker.io" className="text-white/30 transition hover:text-white/70">Email</a>
          <a href={profile.links.resume} download className="text-white/30 transition hover:text-white/70">Resume</a>
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">Scroll</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ════════════════════════════════════════
   PROJECTS
   ════════════════════════════════════════ */

function Projects() {
  const items = profile.featuredProjects

  return (
    <section className="py-24">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-sm font-medium text-[#00c8ff]/60">Work</span>
          <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            Selected projects
          </h2>
        </div>
        <Link
          to="/projects"
          className="hidden text-sm text-white/30 transition hover:text-white/60 sm:block"
        >
          View all {'\u2192'}
        </Link>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        variants={stagger}
        className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
      </motion.div>

      <Link
        to="/projects"
        className="mt-8 block text-center text-sm text-white/30 transition hover:text-white/60 sm:hidden"
      >
        View all projects {'\u2192'}
      </Link>
    </section>
  )
}

type Project = (typeof profile.featuredProjects)[number]

function ProjectCard({ project: p }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null)
  const [glow, setGlow] = useState({ x: 0, y: 0 })

  function onMove(e: ReactMouse) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setGlow({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      onMouseMove={onMove}
      className="group relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06] transition-all duration-500 hover:bg-white/[0.05] hover:ring-white/[0.15] hover:shadow-[0_0_60px_-12px_rgba(0,200,255,0.15)]"
    >
      {/* cursor glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px at ${glow.x}px ${glow.y}px, rgba(0,200,255,0.08), rgba(124,58,237,0.04) 40%, transparent 70%)`,
        }}
      />

      {/* preview */}
      <a href={p.url} target="_blank" rel="noreferrer" className="relative block overflow-hidden">
        <div className="transition-transform duration-700 group-hover:scale-[1.06]">
          <WebsitePreview url={p.url} previewSrc={p.previewImage} heightClassName="h-52" />
        </div>
        {/* color bar at bottom of preview */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00c8ff] via-[#7c3aed] to-[#ff3278] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </a>

      {/* info */}
      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white/90">{p.name}</h3>
          <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-medium text-white/30">
            {p.kind}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/35">{p.tagline}</p>
        <a
          href={p.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs text-white/25 transition hover:text-[#00c8ff]"
        >
          View project {'\u2197'}
        </a>
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════
   STACK
   ════════════════════════════════════════ */

const tech = [
  'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis',
  'React Native', 'Tailwind CSS', 'Docker', 'OpenAI', 'LangChain',
  'Prisma', 'Vercel', 'GCP', 'Framer Motion', 'Figma',
]

function Stack() {
  return (
    <section className="py-24">
      <span className="text-sm font-medium text-[#7c3aed]/60">Technologies</span>
      <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">Stack</h2>
      <div className="mt-10 flex flex-wrap gap-3">
        {tech.map((t, i) => (
          <motion.span
            key={t}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03, duration: 0.4, ease }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 text-sm text-white/50 transition-all hover:border-white/[0.2] hover:text-white/80 hover:shadow-[0_0_20px_-4px_rgba(0,200,255,0.15)]"
          >
            {t}
          </motion.span>
        ))}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   CTA
   ════════════════════════════════════════ */

function CTA() {
  return (
    <section className="py-24">
      <div className="relative overflow-hidden rounded-3xl p-[1px]">
        {/* animated gradient border */}
        <div className="absolute inset-0 animate-gradient rounded-3xl bg-gradient-to-r from-[#00c8ff] via-[#7c3aed] to-[#ff3278] bg-[length:200%_auto] opacity-30" />

        <div className="relative rounded-3xl bg-[#0a0a1a] px-8 py-16 sm:px-16">
          {/* inner glows */}
          <div className="pointer-events-none absolute -top-20 left-1/4 h-40 w-80 rounded-full bg-[#00c8ff]/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 right-1/4 h-40 w-80 rounded-full bg-[#ff3278]/10 blur-[80px]" />

          <div className="relative text-center">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Let{"'"}s build something.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg text-white/40">
              Looking for a technical co-founder, early engineer,
              or someone who can own a product end-to-end.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="group relative rounded-full p-[1px]">
                <div className="absolute inset-0 animate-gradient rounded-full bg-gradient-to-r from-[#00c8ff] via-[#7c3aed] to-[#ff3278] bg-[length:200%_auto] opacity-80 transition group-hover:opacity-100" />
                <div className="relative rounded-full bg-[#0a0a1a] px-8 py-3.5 text-sm font-semibold text-white transition group-hover:bg-transparent">
                  Get in touch
                </div>
              </Link>
              <a
                href={profile.links.resume}
                download
                className="rounded-full border border-white/15 px-8 py-3.5 text-sm text-white/50 transition hover:border-white/30 hover:text-white"
              >
                Download resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
