# Space Arcade Portfolio (React + TS)

A space/pixel-art portfolio with an animated starfield and a tiny arcade mini-game.

## Local dev

```bash
npm install
npm run dev
```

This starts both the frontend (Vite) and backend (API server) together:
- **Frontend**: Runs on `http://localhost:5173` (or 5175)
- **Backend API**: Runs on `http://localhost:3002`
- The Vite dev server automatically proxies `/api` requests to the backend

**Note:** Port 3002 is used for the backend because ports 3000-3001 may be in use. If you need to change it, update `PORT` in the `dev:server` script in `package.json` and the proxy target in `vite.config.ts`.

## Production build

```bash
npm run build
npm run start
```

## Docker (Railway-friendly)

```bash
docker build -t portfolio .
docker run --rm -p 3000:3000 -e PORT=3000 portfolio
```

## Contact Form Setup

The contact form uses [Resend](https://resend.com) to send emails via a server-side API endpoint (to avoid CORS issues). To enable it:

1. Create a `.env` file in the root directory:
   ```bash
   # Copy this template and fill in your values
   RESEND_API_KEY=re_your_api_key_here
   CONTACT_EMAIL=professional.burgundy@gmail.com
   PORT=3002
   ```

2. Get your API key from [Resend](https://resend.com/api-keys)

3. Update the `from` email in `server.mjs` (line ~60) with your verified domain (or use Resend's test domain `onboarding@resend.dev` for development)

**Note:** The `.env` file is automatically loaded by the server. Make sure it's in the root directory and contains `RESEND_API_KEY`.

**Development:** 
- For local testing, run both `npm run dev` (Vite) and `npm run start` (server) in separate terminals
- Vite will proxy `/api` requests to the server on port 3000

**Production:**
- Set `RESEND_API_KEY` and `CONTACT_EMAIL` as environment variables on your hosting platform (Railway, etc.)

**Note:** The API endpoint is at `/api/contact` and proxies requests to Resend, keeping your API key secure on the server side.
