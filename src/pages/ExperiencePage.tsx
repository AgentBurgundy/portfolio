const timeline = [
  {
    title: 'Front End Software Engineer',
    where: 'BambooHR | Austin, TX (Remote)',
    when: 'May 2022 → Present',
    bullets: [
      'Pioneered the adoption of AI development tools (GitHub Copilot, Cursor) across the team, increasing development velocity and code quality.',
      'Led the architecture and development of critical user-facing features in a large-scale React and Next.js application, improving user engagement and performance.',
      'Engineered scalable and reusable component libraries, enhancing developer experience and ensuring design consistency across the product.',
      'Optimized web application performance, reducing load times by 25% through code splitting, lazy loading, and efficient state management.',
    ],
  },
  {
    title: 'Senior Software Engineer',
    where: 'Tensure Consulting | Austin, TX',
    when: 'May 2021 → May 2022',
    bullets: [
      'Architected and delivered full-stack solutions for enterprise clients, interfacing with cross-functional teams to translate business requirements into technical specifications.',
      'Designed and implemented robust RESTful APIs and backend services using Node.js, enabling seamless data integration between disparate systems.',
      'Mentored junior engineers on best practices for modern web development, CI/CD pipelines, and writing clean, maintainable code.',
    ],
  },
  {
    title: 'Software Engineer 2',
    where: 'S&P Global Market Intelligence | Richmond, VA',
    when: 'Dec 2018 → May 2021',
    bullets: [
      'Developed and maintained complex financial data visualization tools using JavaScript frameworks and D3.js.',
      'Collaborated on a large, distributed team to build and scale a mission-critical web application, focusing on reliability and data accuracy.',
      'Improved application test coverage by 40% by implementing a comprehensive end-to-end testing strategy using Cypress.',
    ],
  },
  {
    title: 'Software Developer',
    where: 'Hyland | Westlake, OH',
    when: 'Jun 2017 → Nov 2018',
    bullets: [
      'Contributed to an enterprise content management platform, focusing on building and testing new product features.',
      'Developed test automation frameworks from the ground up, reducing manual testing time by over 50%.',
    ],
  },
]

export function ExperiencePage() {
  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden pixel-border pixel-corners bg-white/[0.03] p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/14 via-transparent to-neon-violet/18 opacity-70" />
        <div className="relative">
          <h1 className="font-pixel text-[14px] text-white">Experience</h1>
          <p className="mt-3 max-w-3xl text-white/70">
            8+ years building AI-powered applications and developer-centric platforms. Full-stack
            engineer with a bias for action and strong ownership mindset.
          </p>
        </div>
      </header>

      <div className="relative">
        <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-neon-violet/50 via-white/10 to-transparent md:left-6" />
        <div className="space-y-6">
          {timeline.map((t) => (
            <div key={t.title + t.when} className="relative pl-10 md:pl-16">
              <div className="absolute left-[6px] top-3 h-3 w-3 rounded-full bg-neon-violet/70 shadow-[0_0_24px_rgba(167,139,250,0.35)] md:left-[18px]" />
              <div className="pixel-border pixel-corners bg-white/[0.03] p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <div className="font-pixel text-[12px] text-white/90">{t.title}</div>
                    <div className="mt-2 font-mono text-sm text-white/60">{t.where}</div>
                  </div>
                  <div className="font-mono text-sm text-neon-violet/80">{t.when}</div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <ul className="space-y-2 text-white/70">
                    {t.bullets.slice(0, Math.ceil(t.bullets.length / 2)).map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-sm bg-neon-violet/60" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-2 text-white/70">
                    {t.bullets.slice(Math.ceil(t.bullets.length / 2)).map((b) => (
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
    </div>
  )
}

