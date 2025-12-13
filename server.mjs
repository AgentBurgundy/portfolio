// Load .env locally if available (safe in production).
// In production builds (e.g. Docker runner stage) we don't ship node_modules,
// so this must not hard-fail.
try {
  await import('dotenv/config')
} catch {
  // no-op
}

import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distDir = path.join(__dirname, 'dist')
const port = Number(process.env.PORT || 3000)
const host = '0.0.0.0'
const resendApiKey = process.env.RESEND_API_KEY
const contactEmail = process.env.CONTACT_EMAIL || 'professional.burgundy@gmail.com'
const resendFrom = process.env.RESEND_FROM || 'Portfolio Contact <onboarding@resend.dev>'

const contentType = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
}

async function exists(p) {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
    const pathname = decodeURIComponent(url.pathname)

    // Small health endpoint for debugging
    if (pathname === '/api/health' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          ok: true,
          port,
          resendConfigured: Boolean(resendApiKey),
          contactEmail,
          resendFrom,
        }),
      )
      return
    }

    // API endpoint for contact form (supports OPTIONS + POST)
    if (pathname === '/api/contact') {
      // CORS (safe defaults; keeps dev/proxy + prod happy)
      const origin = req.headers.origin
      res.setHeader('Access-Control-Allow-Origin', origin || '*')
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      res.setHeader('Access-Control-Max-Age', '86400')

      if (req.method === 'OPTIONS') {
        res.writeHead(204)
        res.end()
        return
      }

      if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }))
        return
      }

      if (!resendApiKey) {
        // eslint-disable-next-line no-console
        console.warn('RESEND_API_KEY not set. Contact form will not send emails.')
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            success: false,
            message: 'Contact form is not configured. Please set RESEND_API_KEY in your .env file.',
          }),
        )
        return
      }

      try {
        const raw = await readBody(req, 200_000)
        let data
        try {
          data = JSON.parse(raw || '{}')
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: false, message: 'Invalid JSON body' }))
          return
        }

        // Validate required fields
        if (!data.name || !data.email || !data.message) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: false, message: 'Missing required fields' }))
          return
        }

        // Proxy request to Resend
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [contactEmail],
            reply_to: data.email,
            subject: `Portfolio Contact: ${data.name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
              <h3>Message:</h3>
              <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
            `,
            text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}
            `.trim(),
          }),
        })

        if (!resendResponse.ok) {
          const errorJson = await resendResponse.json().catch(() => null)
          const errorText = errorJson ? null : await resendResponse.text().catch(() => null)
          const errorMessage =
            errorJson?.message ||
            errorJson?.error?.message ||
            errorJson?.error ||
            errorText ||
            `Failed to send email (${resendResponse.status})`

          // eslint-disable-next-line no-console
          console.error('Resend API error:', {
            status: resendResponse.status,
            statusText: resendResponse.statusText,
            error: errorJson || errorText,
          })

          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: false, message: errorMessage }))
          return
        }

        const resendResult = await resendResponse.json().catch(() => ({}))
        // eslint-disable-next-line no-console
        console.log('Email sent successfully:', resendResult)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: true, message: 'Message sent successfully! I\'ll get back to you soon.' }))
        return
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Contact API error:', err)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            success: false,
            message: err instanceof Error ? err.message : 'Server error processing request',
          }),
        )
        return
      }
      return
    }

    // basic security hardening for path traversal
    if (pathname.includes('..')) {
      res.writeHead(400)
      res.end('Bad Request')
      return
    }

    // static file resolution
    const requested = pathname === '/' ? '/index.html' : pathname
    const candidate = path.join(distDir, requested)

    if (await exists(candidate)) {
      const ext = path.extname(candidate).toLowerCase()
      const body = await readFile(candidate)
      res.writeHead(200, {
        'Content-Type': contentType[ext] || 'application/octet-stream',
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      })
      res.end(body)
      return
    }

    // SPA fallback (React Router)
    const indexPath = path.join(distDir, 'index.html')
    const body = await readFile(indexPath)
    res.writeHead(200, { 'Content-Type': contentType['.html'] })
    res.end(body)
  } catch (err) {
    res.writeHead(500)
    res.end('Server error')
    // eslint-disable-next-line no-console
    console.error(err)
  }
})

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Portfolio server listening on http://${host}:${port}`)
  // eslint-disable-next-line no-console
  console.log(
    `Contact API: ${Boolean(resendApiKey) ? 'configured' : 'NOT configured'} → ${contactEmail} (from: ${resendFrom})`,
  )
})

function readBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    let body = ''
    let bytes = 0
    req.on('data', (chunk) => {
      bytes += chunk.length
      if (bytes > maxBytes) {
        reject(new Error('Request body too large'))
        req.destroy()
        return
      }
      body += chunk.toString('utf8')
    })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

