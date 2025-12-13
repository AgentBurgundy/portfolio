import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { profile } from '../content/profile'
import { WebsitePreview } from '../components/projects/WebsitePreview'

export function HomePage() {
  return (
    <div className="space-y-12">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
        <div className="scanline crt absolute inset-0 opacity-60" />
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-neon-cyan/20 via-neon-violet/10 to-transparent blur-2xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-gradient-to-br from-neon-pink/18 via-neon-amber/10 to-transparent blur-2xl" />

        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="font-mono text-lg text-white/70">
              <span className="text-neon-cyan">READY</span> Player One: product engineer
            </p>

            <h1 className="mt-4 font-pixel text-xl leading-relaxed text-white sm:text-3xl">
              {profile.name}
              <br />
              <span className="text-white/70">I build customer-facing products people love using.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
              Full-stack TypeScript (React + Node). I’m strongest on greenfield 0→1 work: I move fast,
              keep quality high, and sweat the UX details that make a product feel premium.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/projects">
                <Button>Mission select</Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost">Open to work</Button>
              </Link>
              <a
                href={profile.links.resume}
                className="pixel-border pixel-corners inline-flex items-center justify-center gap-2 px-4 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950"
                download
              >
                Resume
              </a>
              <Link to="/arcade">
                <Button variant="ghost">Arcade</Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <Stat label="Focus" value="customer apps" hint="UX, polish, speed" />
              <Stat label="Love" value="greenfield 0→1" hint="move fast, build right" />
              <Stat label="Stack" value="TS / React" hint="Node, Postgres, cloud" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <Terminal />
          </div>
        </div>
      </section>

      {/* MISSION SELECT */}
      <section className="space-y-4">
        <SectionTitle eyebrow="MISSION SELECT" title="What I ship best" />
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            k="01"
            title="Customer UI"
            body="Fast, readable interfaces with strong primitives and real product constraints."
            accent="cyan"
          />
          <FeatureCard
            k="02"
            title="0→1 Foundations"
            body="Greenfield architecture that stays flexible: routing, data, DX, tests, and CI."
            accent="violet"
          />
          <FeatureCard
            k="03"
            title="Systems that hold"
            body="Integrations, queues, failures, metrics—so your product keeps working at scale."
            accent="pink"
          />
        </div>
      </section>

      {/* FEATURED PROJECTS TEASER */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionTitle eyebrow="FEATURED" title="Projects with real-world vibes" />
          <Link to="/projects" className="font-mono text-sm text-neon-cyan/90 hover:text-white">
            View all →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          <ProjectTeaser
            title="Validate AI (vldt.ai)"
            tag="Featured"
            desc="AI-powered validation: design doc + competitor analysis + landing page flow. Built end-to-end."
            href={profile.links.vldt}
          />
          <ProjectTeaser
            title="Wellspring"
            tag="Mobile"
            desc="React Native app on iOS + Android. Calm UI, fast iteration, real users."
            href={profile.links.wellspring}
          />
          <ProjectTeaser
            title="practiceinterview.ai"
            tag="AI + Voice"
            desc="Mock interviews using real voice input (Whisper) + ChatGPT so practice feels real."
            href={profile.links.practiceInterview}
          />
          <ProjectTeaser
            title="stanly.io"
            tag="Landing"
            desc="Founder-style abandoned cart recovery. Customer-facing landing built to convert."
            href={profile.links.stanly}
          />
          <ProjectTeaser
            title="training.vericuda.com"
            tag="Contract"
            desc="E-learning platform for manufacturing employees. Practical UX, built to ship."
            href="https://training.vericuda.com"
          />
          <ProjectTeaser
            title="firesaas.dev"
            tag="Open source"
            desc="Framework for building Next.js + Firebase SaaS apps with clean defaults."
            href={profile.links.firesaas}
          />
        </div>
      </section>

      {/* LOADOUT */}
      <section className="space-y-4">
        <SectionTitle eyebrow="LOADOUT" title="Tools I reach for" />
        <div className="pixel-border pixel-corners bg-white/[0.03] p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <LoadoutSlot title="Frontend" items={['React', 'TypeScript', 'Routing', 'UI systems']} />
            <LoadoutSlot title="Backend" items={['Node', 'Queues', 'APIs', 'Auth']} />
            <LoadoutSlot title="Data" items={['Postgres', 'Prisma', 'Migrations', 'Caching']} />
            <LoadoutSlot title="Ship" items={['Docker', 'CI/CD', 'Monitoring', 'Sane defaults']} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-violet/10" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-pixel text-[12px] text-white/90">NEXT QUEST</div>
            <div className="mt-2 max-w-2xl text-white/70">
              If you’re hiring for customer-facing product work or greenfield builds, I’m a strong
              fit. I’ll ship quickly, keep quality high, and keep the product fun to use.
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact">
              <Button>Contact</Button>
            </Link>
            <Link to="/projects">
              <Button variant="ghost">Projects</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="pixel-border pixel-corners bg-space-900/40 p-4">
      <div className="font-pixel text-[10px] text-white/70">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
      <div className="mt-1 font-mono text-sm text-white/60">{hint}</div>
    </div>
  )
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="font-mono text-sm text-white/55">{eyebrow}</div>
        <h2 className="mt-2 font-pixel text-[13px] text-white/90">{title}</h2>
      </div>
      <div className="hidden h-px flex-1 bg-gradient-to-r from-white/10 via-neon-cyan/30 to-transparent md:block" />
    </div>
  )
}

function FeatureCard({
  k,
  title,
  body,
  accent,
}: {
  k: string
  title: string
  body: string
  accent: 'cyan' | 'violet' | 'pink'
}) {
  const a =
    accent === 'cyan'
      ? 'from-neon-cyan/25'
      : accent === 'violet'
        ? 'from-neon-violet/25'
        : 'from-neon-pink/25'
  return (
    <div className="group relative overflow-hidden pixel-border pixel-corners bg-white/[0.03] p-6 transition hover:bg-white/[0.05]">
      <div className={`absolute inset-0 bg-gradient-to-br ${a} via-transparent to-transparent opacity-50`} />
      <div className="relative">
        <div className="flex items-baseline justify-between gap-3">
          <div className="font-mono text-sm text-white/55">MISSION {k}</div>
          <div className="h-2 w-2 rounded-full bg-white/25 group-hover:bg-white/45" />
        </div>
        <div className="mt-3 font-pixel text-[12px] text-white/90">{title}</div>
        <div className="mt-3 text-white/70">{body}</div>
      </div>
    </div>
  )
}

function Terminal() {
  return (
    <div className="relative overflow-hidden pixel-border pixel-corners bg-space-900/40 p-5">
      <div className="scanline absolute inset-0 opacity-70" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="font-mono text-sm text-white/60">/terminal</div>
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
          </div>
        </div>

        <div className="mt-4 space-y-2 font-mono text-sm text-white/70">
          <Line k="focus" v="customer-facing apps" />
          <Line k="sweet" v="greenfield 0→1" />
          <Line k="stack" v="react · ts · node · postgres · rn" />
          <Line k="traits" v="fast · clean · reliable" />
          <div className="pt-2 text-white/55">
            <span className="text-neon-cyan">$</span> npm run build
            <span className="ml-2 inline-block h-[14px] w-[10px] animate-pulse bg-white/60 align-middle" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-16 text-white/45">{k}</span>
      <span className="text-white/75">{v}</span>
    </div>
  )
}

function ProjectTeaser({
  title,
  tag,
  desc,
  href,
}: {
  title: string
  tag: string
  desc: string
  href?: string
}) {
  const previewSrc = href ? getPreviewSrc(href) : undefined
  return (
    <div className="group h-full pixel-border pixel-corners bg-white/[0.03] p-6 transition hover:bg-white/[0.05] hover:shadow-glow flex flex-col">
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="mb-4 block">
          <WebsitePreview url={href} previewSrc={previewSrc} heightClassName="h-40" className="shadow-glow/20" />
        </a>
      ) : null}
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-pixel text-[12px] text-white/90">{title}</div>
        <div className="font-mono text-sm text-neon-cyan/80">{tag}</div>
      </div>
      <div className="mt-3 text-white/70">{desc}</div>
      <div className="mt-5 h-px bg-gradient-to-r from-white/10 via-neon-cyan/20 to-transparent" />
      <div className="mt-auto pt-4 font-mono text-sm text-white/55">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="hover:text-white">
            Open ↗
          </a>
        ) : (
          <span>Case study → (add link)</span>
        )}
      </div>
    </div>
  )
}

function normalizeUrl(u: string) {
  return u.replace(/\/+$/, '')
}

function getPreviewSrc(url: string) {
  const target = normalizeUrl(url)
  return profile.featuredProjects.find((p) => normalizeUrl(p.url) === target)?.previewImage
}

function LoadoutSlot({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="pixel-border pixel-corners bg-space-900/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="font-pixel text-[10px] text-white/80">{title}</div>
        <div className="font-mono text-xs text-white/45">EQUIPPED</div>
      </div>
      <ul className="mt-3 space-y-2 text-sm text-white/70">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-sm bg-neon-cyan/60" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

