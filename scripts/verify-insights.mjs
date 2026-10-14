import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { loadReports, reportUrl } from '../audits/data.mjs';

export async function verifyInsights({ base = 'http://localhost:4174', reports, output = path.join(os.tmpdir(), 'insights-qa') }) {
  await mkdir(output, { recursive: true });
  const executablePath = ['C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].find(existsSync);
  const browser = await chromium.launch({ executablePath, headless: true });
  const links = [];
  try {
    for (const report of reports) {
      const url = `${base}/insights/${report.slug}`;
      const response = await fetch(url);
      assert.equal(response.status, 200, url);
      assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
      const html = await response.text();
      assert.match(html, /name="robots" content="noindex, nofollow"/);
      assert.ok(html.includes(`href="${reportUrl(report)}"`));
      assert.doesNotMatch(html, /<script/);
      const pdf = await fetch(`${url}/report.pdf`);
      assert.equal(pdf.status, 200);
      assert.equal(pdf.headers.get('x-robots-tag'), 'noindex, nofollow');
      assert.equal(pdf.headers.get('content-type'), 'application/pdf');
      assert.equal(pdf.headers.get('cache-control'), 'no-cache');
      const bytes = Buffer.from(await pdf.arrayBuffer());
      assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
      await writeFile(path.join(output, `${report.slug}.pdf`), bytes);
      for (const width of [390, 768, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [], requests = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('request', request => requests.push({ url: request.url(), method: request.method() }));
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.getByRole('heading', { level: 1, name: report.companyName, exact: true }).waitFor();
        assert.equal(await page.locator('.observation').count(), report.observations.length);
        assert.equal(await page.locator('.metric').count(), report.metrics.length);
        assert.equal(await page.locator('.sources li').count(), report.sources.length);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${report.slug} at ${width}px`);
        assert.equal(await page.locator('.sources a').count(), report.sources.length);
        await page.locator('.evidence-links a').first().click();
        assert.match(new URL(page.url()).hash, /^#evidence-/);
        assert.equal(await page.evaluate(() => document.querySelector(':target')?.getBoundingClientRect().top >= 0), true);
        const download = page.waitForEvent('download');
        await page.getByRole('link', { name: 'Download PDF' }).click();
        const downloaded = await download;
        assert.equal(downloaded.suggestedFilename(), `${report.slug}-public-presence.pdf`);
        assert.equal(await downloaded.failure(), null);
        await page.goto(`${url}/`, { waitUntil: 'networkidle' });
        await page.reload({ waitUntil: 'networkidle' });
        await page.getByRole('heading', { level: 1, name: report.companyName, exact: true }).waitFor();
        await page.screenshot({ path: path.join(output, `${report.slug}-${width}.png`), fullPage: true });
        assert.deepEqual(errors, []);
        assert.equal(requests.some(request => request.method !== 'GET' || new URL(request.url).origin !== new URL(base).origin), false, 'No third-party requests or transmissions');
        assert.ok((await page.locator('main').innerText()).split(/\s+/).length < 600, 'Concise full report including evidence');
        await context.close();
      }
      links.push({ page: reportUrl(report), pdf: `${reportUrl(report)}/report.pdf` });
      console.log(`PASS ${url} (390/768/1440px, fresh load, reload, evidence, PDF download)`);
    }
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    for (const route of ['/insights', '/insights/unknown-unpublished-prospect', '/insights/unknown-unpublished-prospect/report.pdf']) {
      const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 404);
      assert.equal(response.headers()['x-robots-tag'], 'noindex, nofollow');
      await page.getByRole('heading', { name: "These notes aren't available." }).waitFor();
    }
    await page.goto(`${base}/insights`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(output, 'unpublished-desktop.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 900 });
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: path.join(output, 'unpublished-mobile.png'), fullPage: true });
    await context.close();
    console.log(JSON.stringify({ status: 'PASS', base, browser: executablePath || 'Playwright Chromium', reports: reports.length, links, artifacts: output }, null, 2));
    return links;
  } finally { await browser.close(); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await verifyInsights({ base: (process.argv[2] || 'http://localhost:4174').replace(/\/$/, ''), reports: await loadReports(new URL('../src/content/insights', import.meta.url)) });
}
