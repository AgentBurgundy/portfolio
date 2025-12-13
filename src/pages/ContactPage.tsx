import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { profile } from '../content/profile'
import { sendContactMessage, validateContactForm, type ContactFormData } from '../lib/contact'
import clsx from 'clsx'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const directEmail = 'professional.burgundy@gmail.com'

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

    // Validate form
    const validation = validateContactForm(formData)
    if (!validation.valid) {
      setErrors(validation.errors)
      setStatus('error')
      setStatusMessage('Please fix the errors below')
      return
    }

    // Send message
    const result = await sendContactMessage(formData)
    
    if (result.success) {
      setStatus('success')
      setStatusMessage(result.message)
      setFormData({ name: '', email: '', message: '' })
      // Reset success message after 5 seconds
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
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
      setStatus('idle')
    }
  }

  return (
    <div className="space-y-6">
      <header className="pixel-border pixel-corners bg-space-900/40 p-6">
        <h1 className="font-pixel text-[14px] text-white">Contact</h1>
        <p className="mt-3 max-w-3xl text-white/70">
          Want me on your team? I'm looking for customer-facing product work and greenfield builds.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <div className="pixel-border pixel-corners bg-white/[0.03] p-6">
            <h2 className="font-pixel text-[11px] text-white/90">Direct</h2>
            <div className="mt-4 space-y-3">
              <div>
                <div className="mb-2 font-mono text-xs text-white/50">Email</div>
                <a
                  href={`mailto:${directEmail}`}
                  className="font-mono text-sm text-neon-cyan hover:text-white transition"
                >
                  {directEmail}
                </a>
              </div>

              <div>
                <div className="mb-2 font-mono text-xs text-white/50">Resume</div>
                <a
                  className="font-mono text-sm text-neon-cyan hover:text-white transition"
                  href={profile.links.resume}
                  download
                >
                  Download PDF ↗
                </a>
              </div>

              <div>
                <div className="mb-2 font-mono text-xs text-white/50">Highlights</div>
                <div className="space-y-1.5">
                  <a className="block text-sm text-white/70 hover:text-white transition" href={profile.links.vldt} target="_blank" rel="noreferrer">
                    vldt.ai ↗
                  </a>
                  <a
                    className="block text-sm text-white/70 hover:text-white transition"
                    href={profile.links.practiceInterview}
                    target="_blank"
                    rel="noreferrer"
                  >
                    practiceinterview.ai ↗
                  </a>
                  <a
                    className="block text-sm text-white/70 hover:text-white transition"
                    href={profile.links.firesaas}
                    target="_blank"
                    rel="noreferrer"
                  >
                    firesaas.dev ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pixel-border pixel-corners bg-white/[0.03] p-6">
            <h2 className="font-pixel text-[11px] text-white/90">Links</h2>
            <div className="mt-4 space-y-2">
              <a className="block text-sm text-white/70 hover:text-white transition" href={profile.links.website} target="_blank" rel="noreferrer">
                {profile.links.website} ↗
              </a>
              <a className="block text-sm text-white/70 hover:text-white transition" href={profile.links.firesaasRepo} target="_blank" rel="noreferrer">
                github.com/AgentBurgundy/fire-saas ↗
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="pixel-border pixel-corners bg-white/[0.03] p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-pixel text-[11px] text-white/90">Send a message</h2>
              <div className="font-mono text-xs text-white/45">response comes from the server</div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
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
                  placeholder="your@email.com"
                  type="email"
                  value={formData.email}
                  onChange={(v) => handleChange('email', v)}
                  error={errors.some((e) => e.toLowerCase().includes('email'))}
                  disabled={status === 'submitting'}
                />
              </div>

              <Field
                label="Message"
                placeholder="Let’s talk about the role…"
                multiline
                value={formData.message}
                onChange={(v) => handleChange('message', v)}
                error={errors.some((e) => e.toLowerCase().includes('message'))}
                disabled={status === 'submitting'}
              />

              {(errors.length > 0 || statusMessage) && (
                <div
                  className={clsx(
                    'pixel-border pixel-corners p-3',
                    status === 'success'
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30',
                  )}
                >
                  {errors.length > 0 ? (
                    <ul className="space-y-1">
                      {errors.map((error, i) => (
                        <li key={i} className="font-mono text-xs text-red-400">
                          {error}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div
                      className={clsx(
                        'font-mono text-xs',
                        status === 'success' ? 'text-green-400' : 'text-red-400',
                      )}
                    >
                      {statusMessage}
                    </div>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={status === 'submitting' || status === 'success'}>
                {status === 'submitting' ? 'Sending…' : status === 'success' ? 'Sent ✓' : 'Send message'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
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
  return (
    <label className="block">
      <div className="mb-2 font-mono text-sm text-white/70">{label}</div>
      {multiline ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={clsx(
            'pixel-border pixel-corners w-full resize-none bg-space-950/40 px-3 py-2 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 transition',
            error
              ? 'border-red-500/50 focus:ring-red-500/50'
              : 'focus:ring-neon-cyan/50',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={clsx(
            'pixel-border pixel-corners w-full bg-space-950/40 px-3 py-2 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 transition',
            error
              ? 'border-red-500/50 focus:ring-red-500/50'
              : 'focus:ring-neon-cyan/50',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />
      )}
    </label>
  )
}
