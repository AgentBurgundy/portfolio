import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import { site, type CaseStudy } from '../content/site'
import { OpsFeed } from '../components/demo/OpsFeed'
import { PhoneIcon } from '../components/site/SiteHeader'
import { sendContactMessage, validateContactForm, type ContactFormData } from '../lib/contact'

/* ───────────────── helpers ───────────────── */

const ease = [0.22, 1, 0.36, 1] as const

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const reduce = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      animate={inView || reduce ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHeading({ eyebrow, title, sub, align = 'left' }: { eyebrow: string; title: string; sub?: string; align?: 'left' | 'center' }) {
  return (
    <div className={clsx('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="h-section mt-3">{title}</h2>
      {sub && <p className="mt-4 text-[17px] leading-relaxed text-ink-muted">{sub}</p>}
    </div>
  )
}

function useScrollToHash() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' })
    }, 50)
    return () => window.clearTimeout(t)
  }, [hash])
}

/* ───────────────── page ───────────────── */

export function HomePage() {
  useScrollToHash()
  return (
    <>
      <Hero />
      <Pain />
      <Automate />
      <HowItWorks />
      <Proof />
      <Offer />
      <About />
      <Testimonials />
      <Games />
      <Faq />
      <Contact />
    </>
  )
}

/* ───────────────── hero ───────────────── */

function Hero() {
  const reduce = useReducedMotion()
  const item = {
    hidden: reduce ? {} : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  }
  return (
    <section className="relative overflow-hidden">
      <div className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-ember/10 blur-[120px]" />

      <div className="container-x relative grid items-center gap-14 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.1fr,0.9fr] lg:gap-8 lg:pb-28 lg:pt-20">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          className="max-w-xl"
        >
          <motion.div variants={item} className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            {site.hero.eyebrow}
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-5 font-display text-[clamp(2.75rem,7.5vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink"
          >
            {site.hero.headline[0]}
            <br />
            <span className="text-ember">{site.hero.headline[1]}</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-lg text-[18px] leading-relaxed text-ink-muted sm:text-[19px]">
            {site.hero.sub}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href={site.cta.bookingUrl} className="btn-primary">
              {site.cta.primary}
              <ArrowIcon />
            </a>
            <a href={site.person.phoneHref} className="btn-secondary">
              <PhoneIcon className="h-4 w-4" />
              {site.person.phone}
            </a>
          </motion.div>

          <motion.p variants={item} className="mt-6 flex items-center gap-2.5 text-[14px] text-ink-faint">
            <Avatar size="sm" />
            {site.hero.trust}
          </motion.p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="relative mx-auto w-full pb-6 lg:pb-0"
        >
          <OpsFeed />
        </motion.div>
      </div>
    </section>
  )
}

/* ───────────────── pain ───────────────── */

function Pain() {
  return (
    <section className="border-y border-line bg-ink text-white">
      <div className="container-x py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr,1fr] lg:gap-20">
          <Reveal>
            <span className="eyebrow !text-ember">The problem</span>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05]">{site.pain.heading}</h2>
            <p className="mt-6 text-[17px] leading-relaxed text-white/65">{site.pain.body}</p>
          </Reveal>
          <div className="grid gap-4">
            {site.pain.points.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ember/20 text-ember">
                    <XIcon />
                  </span>
                  <div>
                    <h3 className="font-display text-[19px] font-bold">{p.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-white/60">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── what I automate ───────────────── */

function Automate() {
  const a = site.automate
  return (
    <section id="automate" className="scroll-mt-20">
      <div className="container-x py-20 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="What I automate" title={a.heading} sub={a.sub} />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {a.groups.map((group, gi) => {
            const front = group.key === 'front'
            return (
              <Reveal key={group.key} delay={gi * 0.1}>
                <div className="card h-full overflow-hidden">
                  <div className={clsx('flex items-center justify-between px-7 py-5', front ? 'bg-moss-soft' : 'bg-ember-soft')}>
                    <div>
                      <h3 className="font-display text-[24px] font-bold leading-tight">{group.title}</h3>
                      <p className={clsx('mt-0.5 text-[14px]', front ? 'text-moss' : 'text-ember-deep')}>{group.blurb}</p>
                    </div>
                    <span className={clsx('grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card', front ? 'text-moss' : 'text-ember')}>
                      {front ? <PhoneIcon className="h-5 w-5" /> : <GearIcon />}
                    </span>
                  </div>
                  <ul className="divide-y divide-line px-7">
                    {group.items.map((it) => (
                      <li key={it.title} className="flex gap-4 py-5">
                        <span className={clsx('mt-[5px] grid h-5 w-5 shrink-0 place-items-center rounded-full', front ? 'bg-moss-soft text-moss' : 'bg-ember-soft text-ember')}>
                          <CheckIcon />
                        </span>
                        <div>
                          <div className="font-display text-[17px] font-bold leading-snug">{it.title}</div>
                          <p className="mt-1 text-[14.5px] leading-relaxed text-ink-muted">{it.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ───────────────── how it works ───────────────── */

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20">
      <div className="container-x py-20 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="The fix" title={site.steps.heading} sub={site.steps.sub} />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {site.steps.items.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="card group relative h-full overflow-hidden p-7 transition-shadow hover:shadow-lift">
                <span className="font-display text-[44px] font-extrabold leading-none text-ember/25 transition group-hover:text-ember/50">{s.n}</span>
                <h3 className="mt-5 font-display text-[22px] font-bold leading-tight">{s.title}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-ink-muted">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────── proof ───────────────── */

function Proof() {
  return (
    <section id="proof" className="scroll-mt-20 bg-paper-deep/60">
      <div className="container-x py-20 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="Proof" title={site.proof.heading} sub={site.proof.sub} />
        </Reveal>

        {site.proof.demoVideoUrl && (
          <Reveal className="mt-12">
            <div className="card overflow-hidden p-2">
              <div className="aspect-video overflow-hidden rounded-2xl bg-ink">
                <iframe
                  src={site.proof.demoVideoUrl}
                  title="Watch the AI take a call and book the job"
                  className="h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </Reveal>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {site.proof.cases.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.1}>
              <CaseCard c={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseCard({ c }: { c: CaseStudy }) {
  const ember = c.accent === 'ember'
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className={clsx('relative overflow-hidden px-7 pb-6 pt-7', ember ? 'bg-ember text-white' : 'bg-ink text-white')}>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="flex items-center justify-between">
          <span className="font-display text-[26px] font-extrabold tracking-tight">{c.name}</span>
          <a
            href={c.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-[13px] font-medium transition hover:bg-white/25"
          >
            Visit <ArrowIcon className="h-3.5 w-3.5 -rotate-45" />
          </a>
        </div>
        <p className="mt-2 text-[14px] text-white/75">{c.kicker}</p>
        <MiniUi variant={c.accent} />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-display text-[22px] font-bold leading-tight">{c.headline}</h3>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-muted">{c.body}</p>
        <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
          {c.outcomes.map((o) => (
            <li key={o} className="flex gap-3 text-[15px] text-ink-soft">
              <span className={clsx('mt-[3px] grid h-5 w-5 shrink-0 place-items-center rounded-full', ember ? 'bg-ember-soft text-ember' : 'bg-moss-soft text-moss')}>
                <CheckIcon />
              </span>
              {o}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/** Abstract product vignette so the proof cards have a visual without a screenshot. */
function MiniUi({ variant }: { variant: 'ember' | 'ink' }) {
  const rows = variant === 'ember'
    ? [
        ['New lead · Google', 'Quote sent'],
        ['Roof repair · 78756', 'Signed ✓'],
        ['Follow-up · Day 3', 'Scheduled'],
      ]
    : [
        ['Cart abandoned', 'Email drafted'],
        ['"Is it in stock?"', 'Reply sent'],
        ['10% code applied', 'Recovered ✓'],
      ]
  return (
    <div className="mt-6 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
      <div className="space-y-2">
        {rows.map(([a, b], i) => (
          <div key={a} className={clsx('flex items-center justify-between rounded-xl px-3 py-2 text-[12.5px]', i === 1 ? 'bg-white text-ink' : 'bg-white/10 text-white')}>
            <span className="font-medium">{a}</span>
            <span className={clsx('rounded-full px-2 py-0.5 text-[11px] font-semibold', i === 1 ? (variant === 'ember' ? 'bg-ember-soft text-ember' : 'bg-moss-soft text-moss') : 'bg-white/15')}>
              {b}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────────────── offer ───────────────── */

function Offer() {
  const o = site.offer
  return (
    <section id="pricing" className="scroll-mt-20">
      <div className="container-x py-20 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="The offer" title={o.heading} sub={o.sub} align="center" />
        </Reveal>
        <Reveal className="mx-auto mt-12 max-w-3xl">
          <div className="card relative overflow-hidden p-8 shadow-lift sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ember/10 blur-3xl" />
            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="eyebrow">Monthly retainer</span>
                <h3 className="mt-2 font-display text-[28px] font-bold leading-tight sm:text-[32px]">{o.name}</h3>
                <p className="mt-2 text-[15px] text-ink-muted">{o.setupNote}</p>
              </div>
              <div className="shrink-0 sm:text-right">
                {o.price ? (
                  <>
                    <div className="font-display text-[40px] font-extrabold leading-none tracking-tight">{o.price}</div>
                    <div className="mt-1 text-[13px] text-ink-faint">flat, everything included</div>
                  </>
                ) : (
                  <>
                    <div className="font-display text-[26px] font-bold leading-tight">Flat monthly rate</div>
                    <div className="mt-1 text-[13px] text-ink-faint">quoted on the call, no surprises</div>
                  </>
                )}
              </div>
            </div>

            <ul className="relative mt-8 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
              {o.includes.map((inc) => (
                <li key={inc} className="flex gap-3 text-[15px] text-ink-soft">
                  <span className="mt-[3px] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-moss-soft text-moss">
                    <CheckIcon />
                  </span>
                  {inc}
                </li>
              ))}
            </ul>

            {o.guarantee && (
              <p className="relative mt-8 rounded-2xl bg-ember-soft px-5 py-4 text-[15px] font-medium text-ember-deep">{o.guarantee}</p>
            )}

            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href={site.cta.bookingUrl} className="btn-primary">
                {site.cta.primary}
                <ArrowIcon />
              </a>
              <span className="text-[14px] text-ink-faint">No pitch deck. Twenty minutes, then a plan and a price.</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────── about ───────────────── */

function About() {
  const a = site.about
  const p = site.person
  return (
    <section id="about" className="scroll-mt-20 bg-paper-deep/60">
      <div className="container-x py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr,1.2fr] lg:gap-16">
          <Reveal>
            <div className="card overflow-hidden">
              <Avatar size="lg" />
              <div className="p-6">
                <div className="font-display text-[22px] font-bold">{p.name}</div>
                <div className="text-[14px] text-ink-muted">{p.title} · {p.location}</div>
                <div className="mt-5 flex flex-col gap-2.5">
                  <a href={p.phoneHref} className="btn-secondary !min-h-[46px] justify-start gap-3 text-[14px]">
                    <PhoneIcon className="h-4 w-4 text-ember" />
                    {p.phone}
                  </a>
                  <a href={`mailto:${p.email}`} className="btn-secondary !min-h-[46px] justify-start gap-3 text-[14px]">
                    <MailIcon className="h-4 w-4 text-ember" />
                    {p.email}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading eyebrow="About" title={a.heading} />
            <div className="mt-6 space-y-4 text-[16.5px] leading-relaxed text-ink-muted">
              {a.paragraphs.map((t) => (
                <p key={t.slice(0, 24)}>{t}</p>
              ))}
            </div>
            <dl className="mt-8 grid gap-x-8 gap-y-4 border-t border-line pt-8 sm:grid-cols-2">
              {a.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{f.label}</dt>
                  <dd className="mt-1 text-[15.5px] font-medium text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Avatar({ size }: { size: 'sm' | 'lg' }) {
  const [failed, setFailed] = useState(false)
  const p = site.person
  if (size === 'sm') {
    return failed ? (
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-[10px] font-bold text-white">{p.initials}</span>
    ) : (
      <img src={p.photo} alt="" onError={() => setFailed(true)} className="h-7 w-7 shrink-0 rounded-full object-cover" />
    )
  }
  return failed ? (
    <div className="grid aspect-[4/3] w-full place-items-center bg-gradient-to-br from-ink to-ink-soft">
      <span className="font-display text-[72px] font-extrabold text-white/90">{p.initials}</span>
    </div>
  ) : (
    <img src={p.photo} alt={p.name} onError={() => setFailed(true)} className="aspect-[4/3] w-full object-cover" />
  )
}

/* ───────────────── testimonials ───────────────── */

function Testimonials() {
  if (site.testimonials.length === 0) return null
  return (
    <section id="testimonials" className="scroll-mt-20">
      <div className="container-x py-20 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="From owners" title="What it's like to work with me" align="center" />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {site.testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="card h-full p-7">
                <blockquote className="font-display text-[19px] font-medium leading-snug text-ink">“{t.quote}”</blockquote>
                <figcaption className="mt-5 text-[14px] text-ink-muted">
                  <span className="font-semibold text-ink">{t.name}</span>, {t.business}
                  {t.location ? ` · ${t.location}` : ''}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────── games ───────────────── */

const hueClass = {
  sky: 'from-sky-400 to-blue-600',
  ember: 'from-ember to-rose-600',
  moss: 'from-moss to-emerald-700',
} as const

function Games() {
  const g = site.games
  return (
    <section id="games" className="scroll-mt-20">
      <div className="container-x py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-center lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="On the side" title={g.heading} sub={g.sub} />
          </Reveal>
          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            {g.items.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.08}>
                <GameCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function GameCard({ item }: { item: (typeof site.games.items)[number] }) {
  const [failed, setFailed] = useState(false)
  const inner = (
    <>
      <div className={clsx('relative aspect-square w-full overflow-hidden rounded-[22px] bg-gradient-to-br shadow-card', hueClass[item.hue])}>
        {!failed ? (
          <img src={`/games/${item.slug}.png`} alt="" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-display text-[56px] font-extrabold text-white/90">
            {item.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-[14px] font-bold leading-tight sm:text-[17px]">{item.name}</div>
      <div className="text-[12px] text-ink-muted sm:text-[13px]">{item.blurb}</div>
    </>
  )
  const cls = 'block transition-transform duration-300 hover:-translate-y-1'
  return item.url ? (
    <a href={item.url} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

/* ───────────────── faq ───────────────── */

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="scroll-mt-20 bg-paper-deep/60">
      <div className="container-x py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr,1.2fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title={site.faq.heading} />
            <a href={site.cta.bookingUrl} className="btn-secondary mt-8">
              Ask me directly <ArrowIcon />
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card divide-y divide-line overflow-hidden">
              {site.faq.items.map((f, i) => {
                const isOpen = open === i
                return (
                  <div key={f.q}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-paper-deep/60"
                    >
                      <span className="font-display text-[18px] font-bold leading-snug">{f.q}</span>
                      <span className={clsx('grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-ink transition-transform duration-300', isOpen && 'rotate-45 bg-ink text-white')}>
                        <PlusIcon />
                      </span>
                    </button>
                    <div className={clsx('grid transition-[grid-template-rows] duration-300 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 text-[15.5px] leading-relaxed text-ink-muted">{f.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── contact ───────────────── */

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const emptyForm: ContactFormData = { name: '', business: '', phone: '', email: '', message: '', website: '' }

function Contact() {
  const [form, setForm] = useState<ContactFormData>(emptyForm)
  const [errors, setErrors] = useState<string[]>([])
  const [status, setStatus] = useState<FormStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const set = (k: keyof ContactFormData) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors.length) {
      setErrors([])
      setStatus('idle')
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const v = validateContactForm(form)
    if (!v.valid) {
      setErrors(v.errors)
      setStatus('error')
      setStatusMessage('')
      return
    }
    setStatus('submitting')
    const r = await sendContactMessage(form)
    if (r.success) {
      setStatus('success')
      setStatusMessage(site.contact.success)
      setForm(emptyForm)
    } else {
      setStatus('error')
      setStatusMessage(r.message)
    }
  }

  const busy = status === 'submitting'

  return (
    <section id="contact" className="scroll-mt-20">
      <div className="container-x py-20 lg:py-28">
        <div className="card overflow-hidden shadow-lift lg:grid lg:grid-cols-[0.9fr,1.1fr]">
          <div className="relative overflow-hidden bg-ink p-8 text-white sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-ember/25 blur-3xl" />
            <span className="eyebrow">Next step</span>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.05]">{site.contact.heading}</h2>
            <p className="mt-5 text-[16px] leading-relaxed text-white/65">{site.contact.sub}</p>
            <div className="mt-8 space-y-3">
              <a href={site.person.phoneHref} className="flex items-center gap-3 text-[17px] font-semibold transition hover:text-ember">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><PhoneIcon className="h-4 w-4" /></span>
                {site.person.phone}
              </a>
              <a href={`mailto:${site.person.email}`} className="flex items-center gap-3 text-[17px] font-semibold transition hover:text-ember">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><MailIcon className="h-4 w-4" /></span>
                {site.person.email}
              </a>
            </div>
            <p className="mt-10 text-[13px] text-white/40">{site.person.location} · Replies within one business day.</p>
          </div>

          <form onSubmit={onSubmit} className="p-8 sm:p-10 lg:p-12" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" value={form.name} onChange={set('name')} autoComplete="name" disabled={busy} error={errors.some((e) => e.includes('name'))} />
              <Field label="Business" value={form.business} onChange={set('business')} autoComplete="organization" placeholder="Barnhart Roofing" disabled={busy} />
              <Field label="Phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="(512) 555-0134" disabled={busy} error={errors.some((e) => e.includes('phone'))} />
              <Field label="Email" type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@company.com" disabled={busy} error={errors.some((e) => e.includes('email'))} />
            </div>
            <div className="mt-5">
              <Field
                label="Where do the hours go?"
                multiline
                value={form.message}
                onChange={set('message')}
                placeholder="Quotes take all evening, invoices go out late, calls get missed, nobody chases follow-ups..."
                disabled={busy}
                error={errors.some((e) => e.includes('message'))}
              />
            </div>
            {/* honeypot: real people never see or fill this */}
            <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
              <label>
                Website
                <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website')(e.target.value)} />
              </label>
            </div>

            {(errors.length > 0 || statusMessage) && (
              <div
                role="status"
                className={clsx(
                  'mt-5 rounded-xl px-4 py-3 text-[14px]',
                  status === 'success' ? 'bg-moss-soft text-moss' : 'bg-ember-soft text-ember-deep',
                )}
              >
                {errors.length > 0 ? (
                  <ul className="space-y-1">
                    {errors.map((er) => (
                      <li key={er}>{er}</li>
                    ))}
                  </ul>
                ) : (
                  statusMessage
                )}
              </div>
            )}

            <button type="submit" disabled={busy} className={clsx('btn-primary mt-6 w-full', busy && 'pointer-events-none opacity-60')}>
              {busy ? 'Sending…' : status === 'success' ? 'Sent. Talk soon.' : site.cta.primary}
              {!busy && status !== 'success' && <ArrowIcon />}
            </button>
            <p className="mt-3 text-center text-[12.5px] text-ink-faint">No newsletter, no drip campaign. Just a reply from me.</p>
          </form>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  multiline,
  autoComplete,
  disabled,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  multiline?: boolean
  autoComplete?: string
  disabled?: boolean
  error?: boolean
}) {
  const cls = clsx(
    'w-full rounded-xl border bg-paper px-4 py-3 text-[16px] text-ink placeholder:text-ink-faint/70 outline-none transition',
    error ? 'border-ember focus:ring-2 focus:ring-ember/25' : 'border-line focus:border-ink/30 focus:ring-2 focus:ring-ink/10',
    disabled && 'opacity-60',
  )
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">{label}</span>
      {multiline ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} className={clsx(cls, 'resize-none')} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} disabled={disabled} className={cls} />
      )}
    </label>
  )
}

/* ───────────────── icons ───────────────── */

function ArrowIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
function XIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
function GearIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  )
}
