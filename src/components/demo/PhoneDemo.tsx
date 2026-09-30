import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'

/**
 * A looping, self-playing text conversation: a missed call becomes a booked job.
 * Pure CSS + framer-motion, no video required. Timings are tuned to be readable
 * without dragging.
 */

type Line =
  | { kind: 'notice'; text: string; tone?: 'missed' | 'booked' }
  | { kind: 'ai'; text: string }
  | { kind: 'customer'; text: string }

const SCRIPT: Line[] = [
  { kind: 'notice', text: 'Missed call · (512) 555-0134 · 2:14 PM', tone: 'missed' },
  {
    kind: 'ai',
    text: "Hey, this is the assistant for Barnhart Roofing. Sorry we missed your call, the crew's on a roof. What's going on with yours?",
  },
  { kind: 'customer', text: "Leak in the ceiling after last night's storm. Water spot in the living room." },
  { kind: 'ai', text: 'Got it, that needs eyes fast. What’s the address?' },
  { kind: 'customer', text: '4120 Shoal Creek Blvd, 78756' },
  { kind: 'ai', text: 'Thanks. We can be out tomorrow at 9 AM or 1 PM. Which works?' },
  { kind: 'customer', text: '9 works' },
  {
    kind: 'ai',
    text: 'You’re booked for tomorrow at 9 AM. Ronald will text when he’s 20 min out. Reply here anytime.',
  },
  { kind: 'notice', text: 'Job booked · Added to calendar · 2:16 PM', tone: 'booked' },
]

const TYPING_MS = 1100
const READ_MS = 1500
const LOOP_PAUSE_MS = 4200

export function PhoneDemo({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState<number>(reduce ? SCRIPT.length : 0)
  const [typing, setTyping] = useState<'ai' | 'customer' | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce) return
    let cancelled = false
    let timer: number

    const step = (i: number) => {
      if (cancelled) return
      if (i >= SCRIPT.length) {
        timer = window.setTimeout(() => {
          setShown(0)
          setTyping(null)
          step(0)
        }, LOOP_PAUSE_MS)
        return
      }
      const line = SCRIPT[i]
      if (line.kind === 'notice') {
        setTyping(null)
        setShown(i + 1)
        timer = window.setTimeout(() => step(i + 1), READ_MS)
        return
      }
      setTyping(line.kind)
      timer = window.setTimeout(() => {
        setTyping(null)
        setShown(i + 1)
        timer = window.setTimeout(() => step(i + 1), READ_MS)
      }, TYPING_MS)
    }

    timer = window.setTimeout(() => step(0), 600)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [reduce])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [shown, typing, reduce])

  const visible = SCRIPT.slice(0, shown)
  const booked = visible.some((l) => l.kind === 'notice' && l.tone === 'booked')

  return (
    <div
      className={clsx('relative mx-auto w-[300px] sm:w-[330px]', className)}
      aria-label="Demo: a missed call becomes a booked job by text"
    >
      {/* phone frame */}
      <div className="relative rounded-[44px] bg-ink p-[10px] shadow-phone">
        <div className="relative flex h-[600px] flex-col overflow-hidden rounded-[36px] bg-[#f4f2ee] sm:h-[640px]">
          {/* notch */}
          <div className="absolute left-1/2 top-2.5 z-20 h-[26px] w-[104px] -translate-x-1/2 rounded-full bg-ink" />

          {/* header */}
          <div className="z-10 border-b border-black/[0.06] bg-white/80 px-4 pb-3 pt-12 text-center backdrop-blur">
            <div className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-ember text-[12px] font-bold text-white">
              BR
            </div>
            <div className="mt-1.5 text-[13px] font-semibold text-ink">Barnhart Roofing</div>
            <div className="text-[11px] text-ink-faint">Text Message · Today</div>
          </div>

          {/* conversation */}
          <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto px-3.5 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <AnimatePresence initial={false}>
              {visible.map((line, i) => (
                <motion.div
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Bubble line={line} />
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  key={`typing-${shown}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  className={clsx('flex', typing === 'ai' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={clsx(
                      'flex items-center gap-1 rounded-[18px] px-3.5 py-3',
                      typing === 'ai' ? 'bg-ember/90' : 'bg-white',
                    )}
                  >
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className={clsx(
                          'block h-1.5 w-1.5 animate-pulseDot rounded-full',
                          typing === 'ai' ? 'bg-white' : 'bg-ink/40',
                        )}
                        style={{ animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* composer */}
          <div className="border-t border-black/[0.06] bg-white/80 px-3 pb-6 pt-2.5 backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="h-9 flex-1 rounded-full border border-black/10 bg-white px-3.5 text-[13px] leading-9 text-ink-faint">
                iMessage
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-ink/10">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink/50" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* floating callouts */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute -left-16 top-[104px] z-10 hidden items-center gap-2.5 rounded-2xl border border-line bg-white px-3.5 py-2.5 shadow-lift sm:flex lg:-left-24"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ember-soft text-ember">
          <svg viewBox="0 0 24 24" className="h-4 w-4 animate-ring" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </span>
        <div>
          <div className="text-[12px] font-semibold text-ink">You're on a roof</div>
          <div className="text-[11px] text-ink-faint">Call goes unanswered</div>
        </div>
      </motion.div>

      <motion.div
        animate={booked ? { opacity: 1, x: 0 } : { opacity: 0, x: 14 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -right-16 bottom-[132px] z-10 hidden items-center gap-2.5 rounded-2xl border border-line bg-white px-3.5 py-2.5 shadow-lift sm:flex lg:-right-24"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-moss-soft text-moss">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <div>
          <div className="text-[12px] font-semibold text-ink">Job booked</div>
          <div className="text-[11px] text-ink-faint">Tomorrow, 9:00 AM</div>
        </div>
      </motion.div>
    </div>
  )
}

function Bubble({ line }: { line: Line }) {
  if (line.kind === 'notice') {
    const booked = line.tone === 'booked'
    return (
      <div className="flex justify-center py-1">
        <span
          className={clsx(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium',
            booked ? 'bg-moss-soft text-moss' : 'bg-ink/[0.06] text-ink-muted',
          )}
        >
          {booked ? (
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-3 w-3 text-ember" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          )}
          {line.text}
        </span>
      </div>
    )
  }

  const ai = line.kind === 'ai'
  return (
    <div className={clsx('flex', ai ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[82%] rounded-[18px] px-3.5 py-2.5 text-[13.5px] leading-snug',
          ai
            ? 'rounded-br-[6px] bg-ember text-white'
            : 'rounded-bl-[6px] bg-white text-ink shadow-[0_1px_1px_rgba(0,0,0,0.05)]',
        )}
      >
        {line.text}
      </div>
    </div>
  )
}
