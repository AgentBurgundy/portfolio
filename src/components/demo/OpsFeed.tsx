import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'

/**
 * A looping, self-playing activity feed: what AI does across a business in
 * a day, front of house and back office. Pure CSS + framer-motion.
 */

type Tone = 'ember' | 'moss' | 'ink'

type Item = {
  icon: ReactNode
  title: string
  detail: string
  status: string
  tone: Tone
  side: 'Front of house' | 'Back office'
}

const ITEMS: Item[] = [
  {
    icon: <PhoneGlyph />,
    title: 'Missed call from (512) 555-0134',
    detail: 'Texted back in 8 seconds. Booked Tue 9:00 AM.',
    status: 'Booked',
    tone: 'moss',
    side: 'Front of house',
  },
  {
    icon: <DocGlyph />,
    title: 'Quote #2041 drafted from site notes',
    detail: 'Three line items, your pricing. Sent for e-signature.',
    status: 'Sent',
    tone: 'ember',
    side: 'Back office',
  },
  {
    icon: <CalendarGlyph />,
    title: 'Rain Thursday, schedule rebalanced',
    detail: '3 outdoor jobs moved to Friday. Customers notified.',
    status: 'Done',
    tone: 'ink',
    side: 'Back office',
  },
  {
    icon: <MailGlyph />,
    title: 'Quote follow-up, day 3',
    detail: '"Still interested?" Customer replied: yes, book it.',
    status: 'Won',
    tone: 'moss',
    side: 'Front of house',
  },
  {
    icon: <ReceiptGlyph />,
    title: 'Invoice created from finished job',
    detail: 'Pay-online link texted to the customer.',
    status: 'Sent',
    tone: 'ember',
    side: 'Back office',
  },
  {
    icon: <ChartGlyph />,
    title: 'Weekly numbers note',
    detail: 'Revenue, margin, cash, and what’s stuck, in plain English.',
    status: 'Emailed',
    tone: 'ink',
    side: 'Back office',
  },
  {
    icon: <InboxGlyph />,
    title: 'Supplier bill matched to job',
    detail: 'Filed against the right job. No double entry.',
    status: 'Done',
    tone: 'ink',
    side: 'Back office',
  },
  {
    icon: <StarGlyph />,
    title: 'Review request after job close',
    detail: 'Customer left 5 stars on Google.',
    status: '5 stars',
    tone: 'moss',
    side: 'Front of house',
  },
]

const VISIBLE = 5
const STEP_MS = 2100

export function OpsFeed({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const [count, setCount] = useState(reduce ? VISIBLE : 1)

  useEffect(() => {
    if (reduce) return
    const t = window.setInterval(() => setCount((c) => c + 1), STEP_MS)
    return () => window.clearInterval(t)
  }, [reduce])

  // newest first; keys stay unique across loops so exit/enter animate cleanly
  const rows = Array.from({ length: Math.min(count, VISIBLE) }, (_, i) => {
    const idx = count - 1 - i
    return { key: idx, item: ITEMS[idx % ITEMS.length] }
  })

  return (
    <div
      className={clsx('relative mx-auto w-full max-w-[440px]', className)}
      aria-label="Demo: a day of AI activity across a business, front of house and back office"
    >
      <div className="card overflow-hidden shadow-lift">
        <div className="flex items-center justify-between border-b border-line bg-paper-deep/60 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-moss" />
            </span>
            <span className="text-[13px] font-semibold text-ink">AI activity</span>
          </div>
          <span className="text-[12px] text-ink-faint">Example day</span>
        </div>

        <div className="relative h-[464px] overflow-hidden px-3 py-3 sm:h-[480px]">
          <AnimatePresence initial={false}>
            {rows.map(({ key, item }, i) => (
              <motion.div
                key={key}
                layout
                initial={reduce ? false : { opacity: 0, y: -18, scale: 0.98 }}
                animate={{ opacity: i === VISIBLE - 1 ? 0.45 : 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mb-2.5"
              >
                <Row item={item} fresh={i === 0} />
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>

      {/* floating legend (outer div centers; inner motion.div animates so transforms don't fight) */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center gap-4 whitespace-nowrap rounded-full border border-line bg-white px-4 py-2 text-[12px] font-medium text-ink-muted shadow-lift"
        >
          <span className="flex items-center gap-1.5"><Dot tone="moss" /> Front of house</span>
          <span className="flex items-center gap-1.5"><Dot tone="ember" /> Back office</span>
          <span className="flex items-center gap-1.5"><Dot tone="ink" /> Ops &amp; numbers</span>
        </motion.div>
      </div>
    </div>
  )
}

function Dot({ tone }: { tone: Tone }) {
  return <span className={clsx('h-2 w-2 rounded-full', tone === 'moss' && 'bg-moss', tone === 'ember' && 'bg-ember', tone === 'ink' && 'bg-ink')} />
}

function Row({ item, fresh }: { item: Item; fresh: boolean }) {
  const toneBg = { ember: 'bg-ember-soft text-ember', moss: 'bg-moss-soft text-moss', ink: 'bg-ink/[0.06] text-ink' }[item.tone]
  return (
    <div className={clsx('flex items-start gap-3 rounded-2xl border px-3.5 py-3 transition-colors', fresh ? 'border-ink/10 bg-paper' : 'border-transparent bg-white')}>
      <span className={clsx('mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl', toneBg)}>{item.icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="text-[13.5px] font-semibold leading-snug text-ink">{item.title}</div>
          <span className={clsx('shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold', toneBg)}>{item.status}</span>
        </div>
        <div className="mt-0.5 text-[12.5px] leading-snug text-ink-muted">{item.detail}</div>
        <div className="mt-1 text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink-faint">{item.side}</div>
      </div>
    </div>
  )
}

/* glyphs */
const g = { className: 'h-4 w-4', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
function PhoneGlyph() {
  return (
    <svg {...g}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
function DocGlyph() {
  return (
    <svg {...g}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  )
}
function CalendarGlyph() {
  return (
    <svg {...g}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
function MailGlyph() {
  return (
    <svg {...g}>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  )
}
function ReceiptGlyph() {
  return (
    <svg {...g}>
      <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  )
}
function ChartGlyph() {
  return (
    <svg {...g}>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-5 4 3 5-7" />
    </svg>
  )
}
function InboxGlyph() {
  return (
    <svg {...g}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
}
function StarGlyph() {
  return (
    <svg {...g}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
    </svg>
  )
}
