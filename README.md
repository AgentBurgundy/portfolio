# aibaker.io

Marketing site for AI Baker: AI missed-call recovery and booking for Austin contractors and local businesses. Single page, React + Vite + Tailwind, served by a tiny Node server on Railway.

## Edit the copy

Everything on the page (headline, offer, pricing, FAQ, contact details, games, case studies) lives in **`src/content/site.ts`**. Search that file for `TODO` to find the things that still need real values:

- `cta.bookingUrl` — a Calendly / Cal.com / Google appointment link (currently scrolls to the form)
- `offer.price` — the flat monthly rate (hidden until set)
- `offer.guarantee` — optional
- `proof.demoVideoUrl` — 60-second screen capture of the AI booking a job
- `testimonials` — section is hidden while empty

## Portfolio images

Images are checked into `public/` and served locally, so visitors do not depend on third-party image URLs. App and game icons are decorative alongside the visible product names. Below-the-fold images load lazily with reserved dimensions.

| File | Source |
| --- | --- |
| `public/ronald.jpg` | Ronald's supplied LinkedIn photo (400 × 400); displayed square to preserve the full photo. |
| `public/apps/crewos.png` | [CrewOS's published icon](https://crewos.site/android-chrome-512x512.png) (512 × 512). |
| `public/apps/stanly.png` | [Stanly's original app icon](https://github.com/AgentBurgundy/stanly-v2/blob/main/apps/stanly-landing/public/apple-touch-icon.png) (180 × 180). |
| `public/games/cloudhop.png` | [Cloudhop on the App Store](https://apps.apple.com/us/app/cloudhop-bunny-adventure/id6813691757). |
| `public/games/emberbound.png` | [Emberbound on the App Store](https://apps.apple.com/us/app/emberbound-endless-descent/id6811690793). |
| `public/games/wrong-turn-factory.png` | [Wrong Turn Factory on the App Store](https://apps.apple.com/us/app/wrong-turn-factory/id6811652960). |

Game icons were downloaded at 512 × 512 from the artwork URLs returned by Apple's lookup API on September 30, 2026. To replace an image, update its local file; app logo paths and the portrait path are configured in `src/content/site.ts`.

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
