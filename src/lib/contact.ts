/**
 * Contact form API utilities
 * 
 * This module handles sending contact form messages.
 * Currently configured to use Resend API, but can be easily adapted
 * to other services (Formspree, EmailJS, custom API, etc.)
 */

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface ContactFormResponse {
  success: boolean
  message: string
}

/**
 * Validates contact form data
 */
export function validateContactForm(data: ContactFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name.trim()) {
    errors.push('Name is required')
  }

  if (!data.email.trim()) {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address')
  }

  if (!data.message.trim()) {
    errors.push('Message is required')
  } else if (data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Sends a contact form message via the local API endpoint
 * 
 * The API endpoint proxies requests to Resend API to avoid CORS issues.
 * Set RESEND_API_KEY and CONTACT_EMAIL environment variables on the server.
 */
export async function sendContactMessage(data: ContactFormData): Promise<ContactFormResponse> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null)
      const errorMessage =
        errorJson?.message ||
        errorJson?.error?.message ||
        errorJson?.error ||
        `HTTP ${response.status}`
      throw new Error(errorMessage)
    }

    const result = await response.json()
    return {
      success: result.success ?? true,
      message: result.message || 'Message sent successfully! I\'ll get back to you soon.',
    }
  } catch (error) {
    console.error('Failed to send contact message:', error)
    
    // Handle connection errors
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      if (import.meta.env.DEV) {
        return {
          success: false,
          message: 'Cannot reach the contact API. Make sure `npm run dev` is running (it starts both client + server).',
        }
      }
      return {
        success: false,
        message: 'Cannot connect to server. Please try again later or contact directly via email.',
      }
    }

    // Handle HTTP errors
    if (error instanceof Error && error.message.includes('HTTP')) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send message. Please try again or email directly.',
    }
  }
}

