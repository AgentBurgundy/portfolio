import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import clsx from 'clsx'
import { profile } from '../content/profile'
import { WebsitePreview } from '../components/projects/WebsitePreview'

export function ProjectsPage() {
  const projects = profile.featuredProjects
  const [searchParams, setSearchParams] = useSearchParams()

  const ids = useMemo(() => projects.map((p) => projectId(p.url, p.name)), [projects])
  const selectedFromQuery = (searchParams.get('p') || '').trim()

  const [selectedId, setSelectedId] = useState<string>(() => {
    if (selectedFromQuery && ids.includes(selectedFromQuery)) return selectedFromQuery
    return ids[0] ?? 'default'
  })

  useEffect(() => {
    if (!selectedFromQuery) return
    if (selectedFromQuery !== selectedId && ids.includes(selectedFromQuery)) {
      setSelectedId(selectedFromQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFromQuery, ids.join('|')])

  const selected = useMemo(() => {
    const idx = ids.indexOf(selectedId)
    return idx >= 0 ? projects[idx] : projects[0]
  }, [ids, projects, selectedId])

  const selectedRepoUrl = (selected as unknown as { repoUrl?: string }).repoUrl

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden pixel-border pixel-corners bg-white/[0.03] p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/18 via-transparent to-neon-cyan/14 opacity-70" />
        <div className="relative">
          <h1 className="font-pixel text-[14px] text-white">Projects</h1>
          <p className="mt-3 max-w-3xl text-white/70">
            Real shipped work. Web + mobile. Customer-facing UX. Greenfield builds. Click through to the
            live product pages and repos.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Chip>Customer-facing</Chip>
            <Chip>0→1</Chip>
            <Chip>React</Chip>
            <Chip>TypeScript</Chip>
            <Chip>Node</Chip>
            <Chip>React Native</Chip>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:[grid-template-columns:340px_1fr]">
        {/* Sidebar */}
        <aside className="pixel-border pixel-corners bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-3 px-2 py-2">
            <div className="font-pixel text-[11px] text-white/85">Select a project</div>
            <span className="font-mono text-sm text-white/45">click to load</span>
          </div>

          <div className="mt-2 grid gap-2">
            {projects.map((p, i) => {
              const id = ids[i]
              const isActive = id === selectedId
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setSelectedId(id)
                    const next = new URLSearchParams(searchParams)
                    next.set('p', id)
                    setSearchParams(next, { replace: true })
                  }}
                  className={clsx(
                    'group w-full overflow-hidden text-left pixel-border pixel-corners p-3 transition',
                    isActive
                      ? 'bg-white/[0.06] ring-1 ring-neon-cyan/40'
                      : 'bg-space-900/20 hover:bg-white/[0.04]',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg border border-white/10 bg-space-950/50">
                      <img
                        src={p.previewImage}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="truncate font-pixel text-[11px] text-white/90">{p.name}</div>
                        <div className="shrink-0 font-mono text-xs text-neon-cyan/80">{p.kind}</div>
                      </div>
                      <div className="mt-1 line-clamp-2 text-sm text-white/65">{p.tagline}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Detail */}
        <div className="pixel-border pixel-corners bg-white/[0.03] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="font-mono text-sm text-white/55">PROJECT</div>
              <h2 className="mt-2 font-pixel text-[14px] text-white/90">{selected.name}</h2>
              <p className="mt-2 text-white/70">{selected.tagline}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={selected.url}
                target="_blank"
                rel="noreferrer"
                className="pixel-border pixel-corners inline-flex items-center justify-center px-4 py-3 text-sm text-white/85 transition hover:bg-white/5 hover:text-white"
              >
                Open ↗
              </a>
              {selectedRepoUrl ? (
                <a
                  href={selectedRepoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pixel-border pixel-corners inline-flex items-center justify-center px-4 py-3 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                >
                  Repo ↗
                </a>
              ) : null}
            </div>
          </div>

          <div className="mt-5">
            <WebsitePreview
              url={selected.url}
              previewSrc={selected.previewImage}
              heightClassName="h-64 sm:h-80"
              className="shadow-glow/30"
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="font-mono text-sm text-white/55">NOTES</div>
              <p className="mt-2 text-white/70">{selected.note}</p>
            </div>
            <div className="md:col-span-5">
              <div className="font-mono text-sm text-white/55">STACK</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.stack.map((s) => (
                  <Chip key={`${selected.name}-${s}`}>{s}</Chip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="pixel-border pixel-corners bg-space-900/40 px-2 py-1 font-mono text-sm text-white/70">
      {children}
    </span>
  )
}

function projectId(url: string, name: string) {
  // stable-ish, URL driven where possible
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    return host.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  } catch {
    return name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  }
}
