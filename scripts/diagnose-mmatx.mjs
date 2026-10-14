import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const output = path.join(os.tmpdir(), 'mmatx-diagnosis');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true });
const report = [];
for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  const errors = [], failedRequests = [], assets = [], consoleErrors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', e => { if (e.type() === 'error') consoleErrors.push(e.text()); });
  page.on('requestfailed', r => failedRequests.push({ url: r.url(), failure: r.failure() }));
  page.on('response', r => { if (/\.(js|css)(\?|$)/.test(r.url())) assets.push({ url: r.url(), status: r.status(), type: r.headers()['content-type'], cache: r.headers()['cache-control'] }); });
  const response = await page.goto('https://aibaker.io/mmatx', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const first = { status: response.status(), headers: response.headers(), title: await page.title(), finalUrl: page.url(), bodyText: (await page.locator('body').innerText()).slice(0, 2000), metrics: await page.locator('.mx-metric').count(), observations: await page.locator('.mx-observation').count(), chart: await page.locator('.mx-chart').count() };
  await page.screenshot({ path: path.join(output, `before-${width}.png`) });
  await page.reload({ waitUntil: 'networkidle' });
  const reload = { title: await page.title(), bodyText: (await page.locator('body').innerText()).slice(0, 600), metrics: await page.locator('.mx-metric').count() };
  report.push({ width, first, reload, errors, consoleErrors, failedRequests, assets });
  await context.close();
}
await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ browser: browser.version(), report, output }, null, 2));
await browser.close();
