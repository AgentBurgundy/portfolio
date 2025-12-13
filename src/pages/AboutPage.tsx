export function AboutPage() {
  return (
    <div className="space-y-6">
      <header className="pixel-border pixel-corners bg-space-900/40 p-6">
        <h1 className="font-pixel text-[14px] text-white">About</h1>
        <p className="mt-3 max-w-2xl text-white/70">
          I’m a full-stack software engineer who loves building customer-facing apps and greenfield
          products. I care about code quality, performance, and UX that feels fast, clear, and
          premium — the kind of product people actually want to use.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <Card title="My philosophy">
          <ul className="mt-3 space-y-2 text-white/70">
            <li>Build boring cores. Add fun edges.</li>
            <li>Observability isn’t optional.</li>
            <li>Make the happy path fast and obvious.</li>
            <li>Greenfield doesn’t mean messy — start clean.</li>
            <li>Prefer sharp primitives over fragile magic.</li>
          </ul>
        </Card>
        <Card title="Toolbox">
          <div className="mt-3 grid grid-cols-2 gap-2 text-white/70 sm:grid-cols-3">
            {[
              'TypeScript',
              'React',
              'Node.js',
              'Postgres',
              'Prisma',
              'Redis',
              'Docker',
              'CI/CD',
              'GCP/AWS',
              'GraphQL',
              'REST',
              'Testing',
            ].map((t) => (
              <div key={t} className="pixel-border pixel-corners bg-white/[0.03] px-3 py-2 text-sm">
                {t}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pixel-border pixel-corners bg-space-900/40 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-pixel text-[11px] text-white/90">{title}</h2>
        <span className="font-mono text-sm text-white/50">v2.0</span>
      </div>
      {children}
    </div>
  )
}

