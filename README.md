# aibaker.io

Marketing site for AI Baker: AI missed-call recovery and booking for Austin contractors and local businesses. Single page, React + Vite + Tailwind, served by a tiny Node server on Railway.

## Edit the copy

Everything on the page (headline, offer, pricing, FAQ, contact details, games, case studies) lives in **`src/content/site.ts`**. Search that file for `TODO` to find the things that still need real values:

- `cta.bookingUrl` — a Calendly / Cal.com / Google appointment link (currently scrolls to the form)
- `offer.price` — the flat monthly rate (hidden until set)
- `offer.guarantee` — optional
- `person.photo` — drop a headshot at `public/ronald.jpg`
- `proof.demoVideoUrl` — 60-second screen capture of the AI booking a job
- `testimonials` — section is hidden while empty
- `games.items[].url` / `blurb` and icons at `public/games/<slug>.png`

## Local dev

```bash
npm install
npm run dev        # Vite on :5173 + API server on :3002 (Vite proxies /api)
```

## Production

```bash
npm run build
npm start          # node server.mjs — serves dist/ and /api/contact
```

Docker (what Railway runs):

```bash
docker build -t aibaker .
docker run --rm -p 3000:3000 -e PORT=3000 aibaker
```

## Contact form

`POST /api/contact` relays to [Resend](https://resend.com). Environment variables:

| Var              | Purpose                                                         |
| ---------------- | --------------------------------------------------------------- |
| `RESEND_API_KEY` | Required for the form to send. Unset = form returns an error.   |
| `CONTACT_EMAIL`  | Where leads land.                                               |
| `RESEND_FROM`    | Verified sender, e.g. `aibaker.io <hello@aibaker.io>`.          |
| `PORT`           | Defaults to 3000.                                               |

The form has a honeypot field; submissions that fill it are silently dropped.

## Social preview

`public/og.png` is generated from `scripts/og.html`:

```bash
node scripts/render-og.mjs
```
