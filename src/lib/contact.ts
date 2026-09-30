/**
 * Contact form client: validation + POST to /api/contact (server.mjs relays to Resend).
 */

export interface ContactFormData {
  name: string
  business: string
  phone: string
  email: string
  message: string
  /** Honeypot. Real users never fill it; bots do. */
  website: string
}

export interface ContactFormResponse {
  success: boolean
  message: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_DIGITS_MIN = 10

export function validateContactForm(data: ContactFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name.trim()) errors.push('Add your name so I know who to call back.')

  const email = data.email.trim()
  const phoneDigits = data.phone.replace(/\D/g, '')

  if (!email && !phoneDigits) {
    errors.push('Leave a phone number or an email so I can reach you.')
  } else {
    if (email && !EMAIL_RE.test(email)) errors.push("That email doesn't look right.")
    if (phoneDigits && phoneDigits.length < PHONE_DIGITS_MIN) errors.push("That phone number looks short.")
  }

  if (!data.message.trim()) errors.push('Tell me a little about what you need (one line is fine).')

  return { valid: errors.length === 0, errors }
}

export async function sendContactMessage(data: ContactFormData): Promise<ContactFormResponse> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const json = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null

    if (!response.ok) {
      return {
        success: false,
        message: json?.message || `Something went wrong (HTTP ${response.status}). Call or text me instead.`,
      }
    }

    return { success: json?.success ?? true, message: json?.message || 'Sent.' }
  } catch (error) {
    console.error('Failed to send contact message:', error)
    return {
      success: false,
      message: import.meta.env.DEV
        ? 'Cannot reach the contact API. Run `npm run dev` (it starts client + server).'
        : "Couldn't send that. Call or text me instead and I'll get right back to you.",
    }
  }
}
