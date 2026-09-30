import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { site } from '../../content/site'
import { Wordmark } from './Wordmark'

const links = [
  { href: '/#how', label: 'How it works' },
  { href: '/#proof', label: 'Proof' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#about', label: 'About' },
  { href: '/#faq', label: 'FAQ' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300',
        scrolled
          ? 'border-b border-line bg-paper/85 shadow-[0_1px_0_rgba(20,23,31,0.03)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="container-x flex h-[72px] items-center justify-between">
        <Link to="/" onClick={() => setOpen(false)} aria-label={`${site.brand.name} home`}>
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-[14px] font-medium text-ink-muted transition hover:bg-ink/[0.04] hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={site.person.phoneHref}
            className="hidden items-center gap-2 text-[14px] font-semibold text-ink transition hover:text-ember lg:inline-flex"
          >
            <PhoneIcon className="h-4 w-4" />
            {site.person.phone}
          </a>
          <a href={site.cta.bookingUrl} className="btn-primary !min-h-[44px] px-5 text-[14px]">
            {site.cta.primary}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-ink/[0.05] lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full border-b border-line bg-paper px-5 pb-6 pt-2 shadow-lift lg:hidden"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-[17px] font-medium text-ink transition hover:bg-ink/[0.04]"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-3 border-t border-line pt-4">
              <a href={site.person.phoneHref} className="btn-secondary">
                <PhoneIcon className="h-4 w-4" />
                Call {site.person.phone}
              </a>
              <a href={site.cta.bookingUrl} onClick={() => setOpen(false)} className="btn-primary">
                {site.cta.primary}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
