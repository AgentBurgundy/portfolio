// Renders scripts/og.html to public/og.png (1200x630) for social previews.
import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src = 'file://' + path.join(__dirname, 'og.html')
const out = path.join(__dirname, '..', 'public', 'og.png')

// CHROMIUM_PATH lets this run where Playwright's bundled browser isn't installed.
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
)
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.goto(src)
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)
await page.screenshot({ path: out, type: 'png' })
await browser.close()
console.log('wrote', out)
