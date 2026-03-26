import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { profile } from '../content/profile'

const ease = [0.22, 1, 0.36, 1] as const
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

export function AboutPage() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="pb-16 pt-4"
    >
      <motion.header variants={fadeUp}>
        <h1 className="text-3xl font-bold text-white">About</h1>
      </motion.header>

      <div className="mt-10 grid gap-16 lg:grid-cols-[1fr,320px]">
        {/* left — prose */}
        <motion.div variants={fadeUp} className="space-y-5 text-[15px] leading-relaxed text-white/45">
          <p>
            I{"'"}m a software engineer and serial founder based in Austin, TX.
            I{"'"}ve spent the last 8+ years building products across startups
            and enterprise — from{' '}
            <span className="text-white/70">S&P Global</span> and{' '}
            <span className="text-white/70">BambooHR</span> to my own companies.
          </p>
          <p>
            I{"'"}m happiest when I own the entire stack. I{"'"}ve built AI-powered
            SaaS tools, mobile apps, real-time game engines, e-commerce
            automation, and open-source frameworks — each time handling
            architecture, backend, frontend, and deployment myself.
          </p>
          <p>
            My work is defined by speed and quality. I move fast without
            cutting corners — clean code, thoughtful UX, solid infrastructure.
            I care about the details that make software feel good: transitions,
            loading states, error boundaries, animation timing.
          </p>
          <p>
            Right now I{"'"}m focused on AI-native products and looking for my
            next thing — whether that{"'"}s a co-founder role, an early-stage
            team, or a hard technical problem worth solving.
          </p>
        </motion.div>

        {/* right — sidebar */}
        <motion.div variants={fadeUp} className="space-y-6">
          {/* quick info */}
          <div className="rounded-2xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06]">
            <div className="space-y-3 text-sm">
              <InfoRow label="Location" value="Austin, TX" />
              <InfoRow label="Focus" value="Full-stack, AI, 0-to-1" />
              <InfoRow label="Experience" value="8+ years" />
              <InfoRow label="Status">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-emerald-400/70">Open to work</span>
                </span>
              </InfoRow>
            </div>
          </div>

          {/* links */}
          <div className="rounded-2xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06]">
            <h3 className="mb-3 text-xs font-medium text-white/30">Links</h3>
            <div className="space-y-2 text-sm">
              <ExtLink href={profile.links.github}>GitHub</ExtLink>
              <ExtLink href="https://linkedin.com/in/ronaldbarnhart">LinkedIn</ExtLink>
              <ExtLink href={profile.links.website}>{profile.links.website.replace('https://', '')}</ExtLink>
              <ExtLink href={`mailto:ronald@aibaker.io`}>ronald@aibaker.io</ExtLink>
            </div>
          </div>

          {/* CTA */}
          <Link
            to="/contact"
            className="group relative block rounded-2xl p-[1px]"
          >
            <div className="absolute inset-0 animate-gradient rounded-2xl bg-gradient-to-r from-[#00c8ff] via-[#7c3aed] to-[#ff3278] bg-[length:200%_auto] opacity-50 transition group-hover:opacity-80" />
            <div className="relative rounded-2xl bg-[#0a0a1a] px-5 py-4 text-center text-sm font-medium text-white transition group-hover:bg-[#0a0a1a]/80">
              Get in touch {'\u2192'}
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

function InfoRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-white/25">{label}</span>
      {children ?? <span className="text-white/60">{value}</span>}
    </div>
  )
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block text-white/30 transition hover:text-white/70"
    >
      {children} {'\u2197'}
    </a>
  )
}
