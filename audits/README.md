# Concise public-presence reports

Reports are standalone HTML documents and one-page PDFs generated together from the same approved JSON. They use `/insights/company-slug` and `/insights/company-slug/report.pdf`. They require no JavaScript, third-party requests, accounts, paid PDF services, or runtime PDF dependencies.

The production data directory `src/content/insights/` contains only reviewed reports. Test fixtures are synthetic and generated only in the OS temporary directory. There is no sample client report, public catalog, homepage link, or sitemap entry.

The October 14, 2026 batch comes from the sanitized, publication-approved Library dataset `prospect_audits_public.json` (`libfile_7f71c784c3f08191aa3bf7b5ab272f57`). Each report selects two observations and up to two useful metrics; copy is shortened without expanding claims. Location scope, company-reported attribution, sample limits and untested form-delivery caveats remain visible. Social catalogs and unselected observations are omitted for brevity. North Austin Animal Hospital's booking observation stays explicitly limited to one browser session, with unknown cause and impact. The Evolution report uses the current redirected San Antonio evidence URL. No original private outreach records or revenue prioritization enter this repository.

## Dataset to provide

Send one JSON object per company, or an array of these objects for intake. Save the final reviewed objects as `src/content/insights/<slug>.json`. The full machine-readable contract is [`schema.json`](./schema.json). All objects reject unknown fields; keep private selection research and lead records outside this repository.

| Field | Contract |
| --- | --- |
| `schemaVersion` | `1` |
| `slug` | Stable lowercase letters/numbers/hyphens, 2-64 characters; filename must match. Do not rename after sending links. |
| `companyName` | Public business name, up to 80 characters. |
| `website` | Confirmed public HTTPS company website. |
| `snapshotDate` | Actual public snapshot date, `YYYY-MM-DD`; no future dates. |
| `publicationApproved` | `true` only after factual and public-content review. The build fails otherwise. |
| `scope` | Optional short branch, location, or review scope, up to 180 characters; include where identity could be misread. |
| `limitations` | Optional array of up to 3 short caveats, each up to 180 characters. Preserve material research limitations. |
| `metrics` | Array of 0-3 verified metrics. Use `[]` if none are reliable; no invented scores or estimates. |
| `observations` | Exactly 2 or 3 specific public observations, each with a short improvement idea. |
| `sources` | 1-8 public evidence sources; every source must support a metric or observation. |

Each **metric** has:

- `label`: up to 48 characters, including platform or branch where relevant.
- `value`: display-ready string, up to 18 characters.
- `context`: up to 110 characters; state branch, denominator, inspected sample, and limitations needed to interpret the value. Do not combine branches or imply an overall response rate from a sample.
- `sourceIds`: 1-3 IDs referring to entries in `sources`.

Each **observation** has:

- `title`: up to 70 characters.
- `observed`: up to 220 characters; a verified, narrowly scoped public finding. Distinguish an inspected sample from a census, and a missing finding from proof of absence.
- `improvement`: up to 160 characters; a short practical suggestion, separated visually from the factual finding. Avoid promised outcomes and assumptions about internal processes.
- `sourceIds`: 1-3 evidence IDs.

Each **source** has:

- `id`: stable lowercase letters/numbers/hyphens, up to 32 characters; unique within the report.
- `label`: readable linked label, up to 80 characters.
- `url`: exact public HTTPS evidence URL (maximum 1500 characters). No private links, credentials, tokens, or contact data.
- `observedOn`: actual check date, `YYYY-MM-DD`, on or before `snapshotDate`.
- `context`: optional scope or caveat, up to 140 characters. Include this where the evidence alone could be misread.

Keep the company name, metrics, and observations under **330 words combined**. Evidence copy also needs to stay short enough for the one-page PDF. Missing metrics are omitted, not converted into a negative claim. Use plain text only; HTML is escaped. The font supports Latin text and common punctuation; unsupported PDF glyphs fail the build for review.

The validator catches malformed records, invalid/future dates, unknown keys, unresolved/unused evidence IDs, private URL patterns, contact-email strings, common estimate/score wording, and excess copy. It does **not** prove the facts, detect every private record, or replace factual review. Set `publicationApproved` only when the report is ready to be public. Do not include estimated revenue, private contact records, backend assertions, or fabricated scores in any field. The standard invitation is intentionally fixed: learn the team's real tools and handoffs before considering process changes or AI.

## Build and check

```powershell
npm run insights:validate
npm run insights:test
npm run lint
npm run build
$env:PORT = '4174'
npm start
```

In another terminal:

```powershell
npm run insights:verify -- http://localhost:4174
node scripts/verify-mmatx.mjs http://localhost:4174
```

`insights:test` builds a synthetic report in the OS temp directory and checks rejection cases, HTML escaping, PDF links, actual server routes, HTTP status, and browser rendering. `insights:verify` reads the actual production dataset and tests **every report** at 390, 768, and 1440 pixels with installed Edge/Chrome (or Playwright Chromium), a fresh context at each width, trailing-slash loads, reloads, evidence anchors, no overflow, and a real PDF download. It rejects third-party requests and submissions. It saves full-page screenshots and downloaded PDFs to the OS temp `insights-qa` directory, and prints every direct page and PDF link.

Inspect the screenshots. Render the PDFs to PNG with Poppler (`pdftoppm -scale-to 1500 -png report.pdf preview`) and inspect each page; use `pdfinfo` and `pdftotext` to confirm one page and expected names, dates, metrics, observations, and source labels. Build-time layout measurement fails rather than clipping a long PDF. The PDF has clickable evidence labels and the same source context as the page.

With local `pypdf` and Poppler available, `python scripts/verify-insight-pdfs.py <download-directory> --render` verifies every public data field and evidence/company/invitation link against the actual PDFs, requires exactly one page per report, and renders each to PNG for visual inspection. These are local QA tools, not application/runtime dependencies.

The build uses `pdfkit` and the locally bundled OFL-licensed Inter font from `@fontsource/inter`. PDF metrics/observations cite numbered sources, with clickable evidence entries below. HTML styles and fonts are content-hashed; HTML and PDFs revalidate on each request. Both have `X-Robots-Tag: noindex, nofollow`; HTML also includes the robots meta tag before rendering. There is no robots.txt disallow rule preventing crawlers from reading that directive.

These URLs are **unlisted and public, not password-protected**. The entire `/insights` namespace returns a real branded 404 for missing reports, the root, raw JSON, and alternate `/index.html` URLs. There is no prospect-list endpoint or client-side report bundle. No email is sent by this feature.

## Publish without losing reports

Railway project `aibaker.io` (`7ea5ed3b-1e27-4d3f-af9b-1111973fa3cc`), production environment `6b1ee535-17ee-4bb4-83f7-bff72d00cd55`, service `portfolio` (`466e927e-2eb0-4c1b-9c72-a196f061d5a5`) deploys `AgentBurgundy/portfolio`, branch **`master`**. Use that existing path only.

1. Inspect the working tree and preserve unrelated work.
2. Fact-check and validate the sanitized company objects. Select the twenty leads separately; revenue rankings never enter public data.
3. Build, verify each route locally, inspect desktop/mobile screenshots and rendered PDFs. Confirm `/mmatx` still passes its own verification.
4. Commit all intended code and JSON to `master`, then push. PDFs/HTML are generated by the committed build; `dist` stays ignored. Do not rely on an uncommitted local `railway up` deployment.
5. Observe the matching Railway GitHub deployment reach terminal `SUCCESS` and confirm its commit. Do not create new services, modify credentials, or change deployment sources.
6. Run `npm run insights:verify -- https://aibaker.io` and the `/mmatx` regression script against the live domain. Check fresh loads and reloads in the real browser, inspect live screenshots and downloaded PDFs.
7. Send **every direct page URL** as each verified batch is ready. Include PDF URLs if useful for the second drip email. Do not send prospect emails from this coding task.

Do not publish a placeholder while waiting for a factual dataset. Without approved records, deploying this system publishes only the missing-report response.
