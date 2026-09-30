import { site } from '../../content/site'
import { Wordmark } from './Wordmark'

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-deep/60">
      <div className="container-x py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr,1fr,1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-muted">
              {site.brand.tagline} Built and run by {site.person.name} in {site.person.location}.
            </p>
          </div>

          <div>
            <h3 className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Talk to me</h3>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li>
                <a href={site.person.phoneHref} className="font-medium text-ink transition hover:text-ember">
                  {site.person.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.person.email}`} className="font-medium text-ink transition hover:text-ember">
                  {site.person.email}
                </a>
              </li>
              <li className="text-ink-muted">{site.person.location}</li>
              <li>
                <a href={site.person.linkedin} target="_blank" rel="noreferrer" className="text-ink-muted transition hover:text-ink">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Other things I've shipped</h3>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {site.footer.otherWork.map((w) => (
                <li key={w.url}>
                  <a href={w.url} target="_blank" rel="noreferrer" className="text-ink-muted transition hover:text-ink">
                    {w.name}
                  </a>
                </li>
              ))}
              <li>
                <a href={site.footer.github} target="_blank" rel="noreferrer" className="text-ink-muted transition hover:text-ink">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-[13px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>
            {'©'} {new Date().getFullYear()} {site.brand.name} · {site.person.name}
          </span>
          <span>Every call answered. Every job booked.</span>
        </div>
      </div>
    </footer>
  )
}
