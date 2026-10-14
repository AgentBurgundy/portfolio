import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const origin = 'https://www.mountainmoversatx.com';
const pairs = [
  ['/mover-austin', '/mover-austin/residential-moving-austin'],
  ['/mover-austin', '/mover-austin/office-moving-austin'],
  ['/storage-facility-austin', '/storage-facility-austin/climate-controlled-storage-austin'],
  ['/piano-moving-service-austin', '/piano-moving-service-austin/piano-storage-austin'],
  ['/moving-and-storage-service-austin', '/moving-and-storage-service-austin/labor-only-moving-austin'],
  ['/local-moving-austin', '/blog/what-is-considered-a-local-move'],
  ['/moving-company-bee-cave', '/moving-company-lakeway'],
];
const output = path.join(os.tmpdir(), 'mmatx-link-verification');
await mkdir(output, { recursive: true });
const decodeTitle = text => text.replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
async function http(url) {
  const chain = [];
  let current = url;
  for (let i = 0; i < 10; i++) {
    const response = await fetch(current, { redirect: 'manual', signal: AbortSignal.timeout(25000) });
    const body = await response.text();
    const location = response.headers.get('location');
    chain.push({ url: current, status: response.status, location });
    if (response.status >= 300 && response.status < 400 && location) { current = new URL(location, current).href; continue; }
    return { requestedUrl: url, finalUrl: response.url || current, status: response.status, responseDateUtc: response.headers.get('date'), title: decodeTitle(body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || ''), chain, body };
  }
  throw new Error('Too many redirects');
}
const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: false });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
page.setDefaultNavigationTimeout(30000);
const userAgent = await page.evaluate(() => navigator.userAgent);
const sourceCache = new Map();
const results = [];
for (const [sourcePath, destinationPath] of pairs) {
  const sourceUrl = origin + sourcePath;
  const destinationUrl = origin + destinationPath;
  let sourceResult = sourceCache.get(sourceUrl);
  if (!sourceResult) { sourceResult = await http(sourceUrl); sourceCache.set(sourceUrl, sourceResult); }
  const links = [...sourceResult.body.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)].map(m => { try { return new URL(m[1], sourceResult.finalUrl).href; } catch { return null; } });
  const direct = await http(destinationUrl);
  delete direct.body;
  const browserResult = { requestedUrl: destinationUrl };
  try {
    const response = await page.goto(destinationUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    browserResult.finalUrl = page.url();
    browserResult.status = response?.status() ?? null;
    browserResult.title = await page.title();
    browserResult.h1 = await page.locator('h1').allTextContents();
    const bodyText = await page.locator('body').innerText();
    browserResult.bodyExcerpt = bodyText.slice(0, 750);
    browserResult.notFoundTextVisible = /page not found|404|doesn.t exist|couldn.t find/i.test(bodyText);
    const chain = [];
    let request = response?.request();
    while (request) { const r = await request.response(); chain.unshift({ url: request.url(), status: r?.status() ?? null }); request = request.redirectedFrom(); }
    browserResult.chain = chain;
    browserResult.screenshot = path.join(output, `destination-${results.length + 1}.png`);
    await page.screenshot({ path: browserResult.screenshot });
  } catch (error) { browserResult.error = error.message; }
  const row = { source: { url: sourceUrl, status: sourceResult.status, finalUrl: sourceResult.finalUrl, title: sourceResult.title, exactDestinationLinkPresentInRawHtml: links.includes(destinationUrl) }, destination: destinationUrl, directHttp: direct, localEdge: browserResult };
  results.push(row);
  console.log(JSON.stringify({ number: results.length, destination: destinationUrl, sourceStatus: sourceResult.status, sourceLinkPresent: row.source.exactDestinationLinkPresentInRawHtml, http: direct.status, edge: browserResult.status, title: browserResult.title, finalUrl: browserResult.finalUrl, error: browserResult.error }));
}
const responseDate = results.at(-1)?.directHttp.responseDateUtc;
const report = { checkedAtUtc: responseDate ? new Date(responseDate).toISOString() : null, timeSource: 'Last destination HTTP Date header', machineReportedUtc: new Date().toISOString(), browser: 'Installed Microsoft Edge, visible fresh profile', browserVersion: browser.version(), userAgent, directHttpUserAgent: 'Node fetch default', results };
const reportPath = path.join(output, 'results.json');
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ reportPath, checkedAtUtc: report.checkedAtUtc, browserVersion: report.browserVersion, complete: results.length === 7 }));
await browser.close();
