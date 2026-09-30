import { site } from '../../content/site'

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white shadow-card">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          <path d="M15 3.5a6 6 0 0 1 5.5 5.5" className="text-ember" />
          <path d="M15 7a2.5 2.5 0 0 1 2 2" className="text-ember" />
        </svg>
      </span>
      <span className="font-display text-[19px] font-bold tracking-tight text-ink">
        {site.brand.domain.split('.')[0]}
        <span className="text-ink-faint">.{site.brand.domain.split('.').slice(1).join('.')}</span>
      </span>
    </span>
  )
}
