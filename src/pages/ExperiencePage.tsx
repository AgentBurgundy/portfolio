import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { resumeData } from '../content/profile'

const ease = [0.22, 1, 0.36, 1] as const

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export function ExperiencePage() {
  return (
    <div className="pb-16 pt-4">
      {/* header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white">Experience</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/40">
          {resumeData.summary}
        </p>
      </motion.header>

      {/* work history */}
      <Reveal>
        <section className="mt-16">
          <SectionLabel>Work history</SectionLabel>

          <div className="mt-8 space-y-0">
            {resumeData.experience.map((job, i) => (
              <Reveal key={job.company} delay={i * 0.05}>
                <div className="group relative grid gap-4 border-l border-white/[0.06] py-8 pl-8 transition hover:border-white/[0.12] sm:grid-cols-[200px_1fr]">
                  {/* timeline dot */}
                  <div className="absolute -left-[5px] top-10 h-[9px] w-[9px] rounded-full border-2 border-[#0a0a1a] bg-white/30 transition group-hover:bg-[#00c8ff] group-hover:shadow-[0_0_12px_rgba(0,200,255,0.4)]" />

                  {/* left — dates */}
                  <div className="text-sm">
                    <div className="text-white/25">{job.when}</div>
                    <div className="mt-0.5 text-white/15">{job.location}</div>
                  </div>

                  {/* right — details */}
                  <div>
                    <h3 className="text-base font-semibold text-white/90">{job.title}</h3>
                    <div className="mt-0.5 text-sm text-[#00c8ff]/50">{job.company}</div>
                    <ul className="mt-4 space-y-2.5">
                      {job.bullets.map((b) => (
                        <li key={b} className="flex gap-2.5 text-[13px] leading-relaxed text-white/35">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white/20" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* featured products */}
      <Reveal>
        <section className="mt-20">
          <SectionLabel>Products shipped</SectionLabel>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {resumeData.featuredShipments.map((ship, i) => (
              <Reveal key={ship.name} delay={i * 0.05}>
                <div className="group rounded-2xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.04] hover:ring-white/[0.12]">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-white/90">{ship.name}</h3>
                    <span className="shrink-0 text-xs text-white/20">{ship.role}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-[#00c8ff]/40">{ship.mission}</p>
                  <ul className="mt-4 space-y-2">
                    {ship.bullets.map((b) => (
                      <li key={b} className="flex gap-2.5 text-[13px] leading-relaxed text-white/30">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white/15" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* skills */}
      <Reveal>
        <section className="mt-20">
          <SectionLabel>Skills</SectionLabel>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(resumeData.skills).map(([category, items], i) => (
              <Reveal key={category} delay={i * 0.04}>
                <div className="rounded-2xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06]">
                  <h3 className="text-sm font-medium text-white/60">{category}</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg bg-white/[0.04] px-2.5 py-1 text-xs text-white/30"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-white/50">{children}</span>
      <div className="h-px flex-1 bg-white/[0.06]" />
    </div>
  )
}
