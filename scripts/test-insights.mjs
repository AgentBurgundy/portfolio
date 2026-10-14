import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, writeFile, copyFile, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import { validateReport } from '../audits/data.mjs';
import { renderReport } from '../audits/render.mjs';
import { renderPdf } from '../audits/pdf.mjs';
import { buildInsights } from './build-insights.mjs';
import { verifyInsights } from './verify-insights.mjs';

// Synthetic content exists only in test memory / the OS temp directory. The
// production content directory deliberately contains no demonstration reports.
export function layoutFixture() {
  return {
    schemaVersion: 1,
    slug: 'internal-layout-check',
    companyName: 'Internal layout verification',
    website: 'https://example.com',
    snapshotDate: '2026-10-14',
    publicationApproved: true,
    metrics: [{ label: 'Synthetic metric / layout only', value: '4.9 / 5', context: 'Test value. This is not a client finding.', sourceIds: ['layout'] }],
    observations: [
      { title: 'Synthetic observation for layout testing', observed: 'This is a local test fixture used to check text wrapping and evidence links. It is never included in the production reports.', improvement: 'Use this space for a short, practical idea grounded in the verified observation.', sourceIds: ['layout'] },
      { title: 'A second synthetic observation', observed: 'This text checks spacing between observations and their suggested next steps on small screens.', improvement: 'Keep the eventual report concise enough to read in a minute.', sourceIds: ['layout'] },
    ],
    sources: [{ id: 'layout', label: 'Synthetic source / layout test only', url: 'https://example.com', observedOn: '2026-10-14', context: 'Reserved example domain. Not prospect evidence.' }],
  };
}

test('publication contract rejects incomplete or unsafe content', () => {
  assert.equal(validateReport(layoutFixture()).slug, 'internal-layout-check');
  const reject = (change, pattern) => {
    const fixture = layoutFixture();
    change(fixture);
    assert.throws(() => validateReport(fixture), pattern);
  };
  reject(x => { x.publicationApproved = false; }, /constant/);
  reject(x => { x.privateContact = 'not allowed'; }, /additional properties/);
  reject(x => { x.observations[0].sourceIds = ['missing']; }, /missing evidence/);
  reject(x => { x.sources.push(x.sources[0]); }, /duplicate source/);
  reject(x => { x.snapshotDate = '2026-02-30'; }, /real date/);
  reject(x => { x.snapshotDate = '2099-01-01'; }, /no later than today/);
  reject(x => { x.sources[0].observedOn = '2026-10-15'; }, /later than/);
  reject(x => { x.sources[0].url = 'javascript:alert(1)'; }, /pattern/);
  reject(x => { x.sources[0].url = 'https://127.0.0.1/private'; }, /public HTTPS/);
  reject(x => { x.sources[0].url = 'https://example.com/?token=private'; }, /private query/);
  reject(x => { x.observations[0].observed = 'Estimated revenue: $1M.'; }, /revenue estimates/);
  reject(x => { x.observations[0].observed = 'Contact: person@example.com'; }, /contact records/);
  reject(x => { x.metrics[0].context = 'x'.repeat(111); }, /characters/);
  reject(x => { x.observations = [x.observations[0]]; }, /fewer than 2/);
  const noMetrics = layoutFixture(); noMetrics.metrics = [];
  assert.doesNotThrow(() => validateReport(noMetrics));
});

test('HTML is escaped, standalone and has publication metadata before JavaScript', () => {
  const fixture = layoutFixture();
  fixture.companyName = 'A & B <Company>';
  const html = renderReport(fixture, '/assets/insights.test.css');
  assert.match(html, /A &amp; B &lt;Company&gt;/);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.match(html, /rel="canonical" href="https:\/\/aibaker.io\/insights\/internal-layout-check"/);
  assert.doesNotMatch(html, /<script|mixpanel|publicationApproved|schemaVersion/);
  assert.match(html, /download="internal-layout-check-public-presence.pdf"/);
});

test('PDF contains one measured page and public evidence links', async () => {
  const pdf = await renderPdf(layoutFixture());
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  const raw = pdf.toString('latin1');
  assert.match(raw, /\/Count 1\b/);
  assert.match(raw, /https:\/\/example.com/);
  assert.match(raw, /https:\/\/aibaker.io\/#contact/);
});

test('standalone server serves report/PDF, protects namespace and rejects missing routes', async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'insights-integration-'));
  const source = path.join(temporary, 'data');
  const output = path.join(temporary, 'dist');
  await mkdir(source);
  await writeFile(path.join(source, 'internal-layout-check.json'), JSON.stringify(layoutFixture()));
  await buildInsights({ source, output });
  await writeFile(path.join(output, 'index.html'), '<!doctype html><html><head><title>Home test</title></head><body>Home</body></html>');
  await copyFile(new URL('../server.mjs', import.meta.url), path.join(temporary, 'server.mjs'));
  const child = spawn(process.execPath, ['server.mjs'], { cwd: temporary, env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  let base;
  try {
    base = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Server startup timeout')), 10000);
      child.once('error', reject);
      child.stdout.on('data', chunk => {
        const match = chunk.toString().match(/http:\/\/0.0.0.0:(\d+)/);
        if (match) { clearTimeout(timeout); resolve(`http://localhost:${match[1]}`); }
      });
    });
    for (const suffix of ['', '/']) {
      const response = await fetch(`${base}/insights/internal-layout-check${suffix}`);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
      assert.equal(response.headers.get('cache-control'), 'no-cache');
      assert.match(await response.text(), /Internal layout verification/);
    }
    const pdf = await fetch(`${base}/insights/internal-layout-check/report.pdf`);
    assert.equal(pdf.headers.get('content-type'), 'application/pdf');
    assert.match(pdf.headers.get('content-disposition'), /attachment/);
    assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0, 5).toString(), '%PDF-');
    for (const route of ['/insights', '/insights/', '/insights/no-such-company', '/insights/no-such-company/report.pdf', '/insights/internal-layout-check/index.html', '/insights/internal-layout-check.json']) {
      const response = await fetch(`${base}${route}`);
      assert.equal(response.status, 404, route);
      assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow', route);
      assert.match(await response.text(), /These notes aren't available/);
    }
    const head = await fetch(`${base}/insights/internal-layout-check`, { method: 'HEAD' });
    assert.equal(head.status, 200); assert.equal(await head.text(), '');
    assert.equal((await fetch(`${base}/insights/internal-layout-check`, { method: 'POST' })).status, 405);
    assert.equal((await fetch(base)).headers.get('x-robots-tag'), null);
    const generated = await readFile(path.join(output, 'insights/internal-layout-check/index.html'), 'utf8');
    assert.doesNotMatch(generated, /<script/);
    await verifyInsights({ base, reports: [layoutFixture()], output: path.join(temporary, 'qa') });
    console.log(`Local synthetic layout artifacts: ${output}`);
  } finally { child.kill(); }
});
