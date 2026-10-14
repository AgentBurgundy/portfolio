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

## Mountain Movers presentation

`/mmatx` is a concise, unlisted, public call page with four metric cards, one branch-specific Google review chart, four short observations, and a discussion about learning internal workflows before proposing process or AI changes. Sources are collapsed by default. It is omitted from public navigation. The Node server sets route-specific `noindex, nofollow` in both the HTTP header and initial HTML; this is not access control.

The compact route dataset in `src/content/mmatx-summary.json` is derived from `movers_presentation_data.json` (Library `libfile_1a5eadbf14b88191ac094a74d1fecaa9`), observed October 13, 2026. The original normalized archive remains in `src/content/mmatx-audit.json` and is no longer imported by the presentation. The referral percentage discrepancy appears once, on one URL. The earlier automated broken-link claim has been withdrawn and flagged as disputed in the archive; it is absent from the public presentation. Review totals remain branch-specific and closed profiles stay out of the chart. No analytics, additional services, or form submissions are introduced.

After `npm run build`, start the production server with `PORT=4174`, then run `node scripts/verify-mmatx.mjs`. The script checks data and page-count accuracy, the single referral observation, evidence links, indexing isolation, reduced motion, and four responsive widths in an installed Edge or Chrome browser (otherwise Playwright Chromium). QA screenshots are written to the system temporary directory. To verify a deployment, pass its base URL as the first argument.

Railway automatically deploys `master`. Keep the route, dataset, styles, and server metadata committed on that branch; a local-only `railway up` can be overwritten by a later GitHub deploy. `/mmatx` is excluded from analytics initialization. Presentation text stays visible without waiting for entrance animations, and a route-loading error offers a reload action. Missing hashed assets return 404 rather than SPA HTML.

`node scripts/verify-mountain-destinations.mjs` records the seven previously flagged source/destination pairs using read-only HTTP GET and a visible, fresh installed Edge session. The October 13 recheck returned 200 for all six source pages and 404 / `Not Found` for all seven exact destinations, with no redirects. These local results conflict with cached search content and the reported working-page experience, so the concise presentation keeps the claim withdrawn. Exact status, titles, final URLs and screenshots are stored in the system temporary directory; no forms are submitted.

## Reusable prospect reports

The standalone `/insights/<company-slug>` report system and matching `/report.pdf` downloads are generated from approved JSON in `src/content/insights/`. Reports have no public index, homepage links, analytics, or third-party requests, and receive `noindex, nofollow` in both the initial HTML and HTTP headers. They are publicly accessible. See [`audits/README.md`](audits/README.md) for the verified October 14, 2026 batch, data contract, factual-review requirements, browser/PDF checks, and existing Railway `master` deployment workflow.

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
