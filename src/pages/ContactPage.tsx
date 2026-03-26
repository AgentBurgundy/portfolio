import { useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../content/profile'
import { sendContactMessage, validateContactForm, type ContactFormData } from '../lib/contact'
import clsx from 'clsx'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const ease = [0.22, 1, 0.36, 1] as const
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

export function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<string[]>([])
  const [status, setStatus] = useState<FormStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors([])
    setStatus('submitting')

    const validation = validateContactForm(formData)
    if (!validation.valid) {
      setErrors(validation.errors)
      setStatus('error')
      setStatusMessage('Please fix the errors below')
      return
    }

    const result = await sendContactMessage(formData)

    if (result.success) {
      setStatus('success')
      setStatusMessage(result.message)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => {
        setStatus('idle')
        setStatusMessage('')
      }, 5000)
    } else {
      setStatus('error')
      setStatusMessage(result.message)
    }
  }

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors.length > 0) {
      setErrors([])
      setStatus('idle')
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="pb-16 pt-4"
    >
      <motion.header variants={fadeUp}>
        <h1 className="text-3xl font-bold text-white">Contact</h1>
        <p className="mt-2 max-w-lg text-sm text-white/40">
          Have a project in mind, want to collaborate, or just want to say hi?
          I{"'"}d love to hear from you.
        </p>
      </motion.header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr,340px]">
        {/* form */}
        <motion.div variants={fadeUp}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Name"
                placeholder="Your name"
                value={formData.name}
                onChange={(v) => handleChange('name', v)}
                error={errors.some((e) => e.toLowerCase().includes('name'))}
                disabled={status === 'submitting'}
              />
              <Field
                label="Email"
                placeholder="you@example.com"
                type="email"
                value={formData.email}
                onChange={(v) => handleChange('email', v)}
                error={errors.some((e) => e.toLowerCase().includes('email'))}
                disabled={status === 'submitting'}
              />
            </div>

            <Field
              label="Message"
              placeholder="What are you working on?"
              multiline
              value={formData.message}
              onChange={(v) => handleChange('message', v)}
              error={errors.some((e) => e.toLowerCase().includes('message'))}
              disabled={status === 'submitting'}
            />

            {(errors.length > 0 || statusMessage) && (
              <div
                className={clsx(
                  'rounded-xl p-3 text-sm',
                  status === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
                )}
              >
                {errors.length > 0 ? (
                  <ul className="space-y-1">
                    {errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                ) : (
                  statusMessage
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting' || status === 'success'}
              className={clsx(
                'group relative w-full rounded-xl p-[1px] transition',
                (status === 'submitting' || status === 'success') && 'pointer-events-none opacity-50',
              )}
            >
              <div className="absolute inset-0 animate-gradient rounded-xl bg-gradient-to-r from-[#00c8ff] via-[#7c3aed] to-[#ff3278] bg-[length:200%_auto] opacity-60 transition group-hover:opacity-100" />
              <div className="relative rounded-xl bg-[#0a0a1a] px-6 py-3 text-sm font-semibold text-white transition group-hover:bg-[#0a0a1a]/80">
                {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send message'}
              </div>
            </button>
          </form>
        </motion.div>

        {/* sidebar */}
        <motion.div variants={fadeUp} className="space-y-5">
          <div className="rounded-2xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06]">
            <h3 className="mb-4 text-xs font-medium text-white/30">Direct</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-white/20">Email</div>
                <a href="mailto:ronald@aibaker.io" className="mt-0.5 block text-white/60 transition hover:text-white">
                  ronald@aibaker.io
                </a>
              </div>
              <div>
                <div className="text-white/20">Resume</div>
                <a href={profile.links.resume} download className="mt-0.5 block text-white/60 transition hover:text-white">
                  Download PDF {'\u2193'}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06]">
            <h3 className="mb-4 text-xs font-medium text-white/30">Elsewhere</h3>
            <div className="space-y-2.5 text-sm">
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="block text-white/30 transition hover:text-white/70">
                GitHub {'\u2197'}
              </a>
              <a href="https://linkedin.com/in/ronaldbarnhart" target="_blank" rel="noreferrer" className="block text-white/30 transition hover:text-white/70">
                LinkedIn {'\u2197'}
              </a>
              <a href={profile.links.website} target="_blank" rel="noreferrer" className="block text-white/30 transition hover:text-white/70">
                aibaker.io {'\u2197'}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function Field({
  label,
  placeholder,
  multiline,
  type = 'text',
  value,
  onChange,
  error,
  disabled,
}: {
  label: string
  placeholder: string
  multiline?: boolean
  type?: string
  value: string
  onChange: (value: string) => void
  error?: boolean
  disabled?: boolean
}) {
  const cls = clsx(
    'w-full rounded-xl border bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition',
    error
      ? 'border-red-500/30 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20'
      : 'border-white/[0.06] focus:border-white/[0.15] focus:ring-1 focus:ring-[#00c8ff]/20',
    disabled && 'opacity-50 cursor-not-allowed',
  )

  return (
    <label className="block">
      <div className="mb-2 text-sm text-white/40">{label}</div>
      {multiline ? (
        <textarea
          rows={5}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={clsx(cls, 'resize-none')}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cls}
        />
      )}
    </label>
  )
}
