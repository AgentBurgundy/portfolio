import { resumeData } from "../content/profile";

const accents = ["pink", "cyan", "violet", "amber"] as const;
const accentGradients: Record<string, string> = {
  pink: "from-neon-pink/20",
  cyan: "from-neon-cyan/20",
  violet: "from-neon-violet/20",
  amber: "from-neon-amber/20",
};
const accentDots: Record<string, string> = {
  pink: "bg-neon-pink/60",
  cyan: "bg-neon-cyan/60",
  violet: "bg-neon-violet/60",
  amber: "bg-neon-amber/60",
};

export function ExperiencePage() {
  return (
    <div className="space-y-8">
      {/* HEADER + SUMMARY */}
      <header className="relative overflow-hidden pixel-border pixel-corners bg-white/[0.03] p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/14 via-transparent to-neon-violet/18 opacity-70" />
        <div className="relative">
          <h1 className="font-pixel text-[14px] text-white">Experience</h1>
          <p className="mt-3 max-w-4xl text-white/70 leading-relaxed">
            {resumeData.summary}
          </p>
        </div>
      </header>

      {/* FEATURED SHIPMENTS */}
      <section className="space-y-4">
        <div className="flex items-end gap-4">
          <div>
            <div className="font-mono text-sm text-white/55">
              FEATURED SHIPMENTS
            </div>
            <h2 className="mt-2 font-pixel text-[13px] text-white/90">
              Products I've conceived, designed, and shipped
            </h2>
          </div>
          <div className="hidden h-px flex-1 bg-gradient-to-r from-white/10 via-neon-pink/30 to-transparent md:block" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {resumeData.featuredShipments.map((ship, i) => {
            const accent = accents[i % accents.length];
            return (
              <div
                key={ship.name}
                className="group relative overflow-hidden pixel-border pixel-corners bg-white/[0.03] p-6 transition hover:bg-white/[0.05]"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${accentGradients[accent]} via-transparent to-transparent opacity-50`}
                />
                <div className="relative">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-pixel text-[12px] text-white/90">
                      {ship.name}
                    </div>
                    <div className="font-mono text-xs text-white/50">
                      {ship.role}
                    </div>
                  </div>
                  <div className="mt-2 font-mono text-sm text-neon-cyan/80">
                    {ship.mission}
                  </div>
                  <ul className="mt-4 space-y-2">
                    {ship.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-sm text-white/70">
                        <span
                          className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-sm ${accentDots[accent]}`}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PROFESSIONAL EXPERIENCE TIMELINE */}
      <section className="space-y-4">
        <div className="flex items-end gap-4">
          <div>
            <div className="font-mono text-sm text-white/55">WORK HISTORY</div>
            <h2 className="mt-2 font-pixel text-[13px] text-white/90">
              Professional Experience
            </h2>
          </div>
          <div className="hidden h-px flex-1 bg-gradient-to-r from-white/10 via-neon-violet/30 to-transparent md:block" />
        </div>

        <div className="relative">
          <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-neon-violet/50 via-white/10 to-transparent md:left-6" />
          <div className="space-y-6">
            {resumeData.experience.map((job) => (
              <div
                key={job.title + job.when}
                className="relative pl-10 md:pl-16"
              >
                <div className="absolute left-[6px] top-3 h-3 w-3 rounded-full bg-neon-violet/70 shadow-[0_0_24px_rgba(167,139,250,0.35)] md:left-[18px]" />
                <div className="pixel-border pixel-corners bg-white/[0.03] p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <div className="font-pixel text-[12px] text-white/90">
                        {job.title}
                      </div>
                      <div className="mt-2 font-mono text-sm text-white/60">
                        {job.company} | {job.location}
                      </div>
                    </div>
                    <div className="font-mono text-sm text-neon-violet/80">
                      {job.when}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <ul className="space-y-2 text-white/70">
                      {job.bullets
                        .slice(0, Math.ceil(job.bullets.length / 2))
                        .map((b) => (
                          <li key={b} className="flex gap-2">
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-sm bg-neon-violet/60" />
                            <span>{b}</span>
                          </li>
                        ))}
                    </ul>
                    <ul className="space-y-2 text-white/70">
                      {job.bullets
                        .slice(Math.ceil(job.bullets.length / 2))
                        .map((b) => (
                          <li key={b} className="flex gap-2">
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-sm bg-neon-violet/60" />
                            <span>{b}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNICAL SKILLS */}
      <section className="space-y-4">
        <div className="flex items-end gap-4">
          <div>
            <div className="font-mono text-sm text-white/55">THE LOADOUT</div>
            <h2 className="mt-2 font-pixel text-[13px] text-white/90">
              Technical Skills
            </h2>
          </div>
          <div className="hidden h-px flex-1 bg-gradient-to-r from-white/10 via-neon-cyan/30 to-transparent md:block" />
        </div>

        <div className="pixel-border pixel-corners bg-white/[0.03] p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(resumeData.skills).map(([category, items]) => (
              <div
                key={category}
                className="pixel-border pixel-corners bg-space-900/40 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-pixel text-[10px] text-white/80">
                    {category}
                  </div>
                  <div className="font-mono text-xs text-white/45">
                    EQUIPPED
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-white/70">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-sm bg-neon-cyan/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
