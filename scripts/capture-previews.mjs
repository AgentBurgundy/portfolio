import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir } from 'node:fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, '..', 'public', 'previews')
await mkdir(outDir, { recursive: true })

const targets = [
  { name: 'vldt', url: 'https://www.vldt.ai/' },
  { name: 'firesaas', url: 'https://firesaas.dev/' },
  { name: 'practiceinterview', url: 'https://practiceinterview.ai/' },
  { name: 'vericuda-training', url: 'https://training.vericuda.com' },
  { name: 'wellspring', url: 'https://apps.apple.com/us/app/wellspring-daily-devotionals/id6741737201' },
  { name: 'stanly', url: 'https://stanly.io/' },
]

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
})

for (const t of targets) {
  const page = await context.newPage()
  try {
    await page.goto(t.url, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(800)
    const file = path.join(outDir, `${t.name}.png`)
    await page.screenshot({ path: file, fullPage: false })
    // eslint-disable-next-line no-console
    console.log(`Saved ${file}`)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed ${t.url}`, err)
  } finally {
    await page.close()
  }
}

await context.close()
await browser.close()

