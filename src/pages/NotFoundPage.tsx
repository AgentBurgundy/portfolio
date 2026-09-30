import { Link } from 'react-router-dom'
import { site } from '../content/site'

export function NotFoundPage() {
  return (
    <div className="container-x py-24 text-center">
      <span className="eyebrow">404</span>
      <h1 className="h-section mt-3">That page doesn't exist.</h1>
      <p className="mx-auto mt-4 max-w-md text-[16px] text-ink-muted">
        The site was rebuilt around one thing: turning missed calls into booked jobs. Everything's on the home page now.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/" className="btn-primary">
          Back to the home page
        </Link>
        <a href={site.person.phoneHref} className="btn-secondary">
          Call {site.person.phone}
        </a>
      </div>
    </div>
  )
}
