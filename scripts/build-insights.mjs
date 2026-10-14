import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadReports } from '../audits/data.mjs';
import { renderReport, renderMissing } from '../audits/render.mjs';
import { renderPdf } from '../audits/pdf.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);

export async function buildInsights({ source = path.join(root, 'src/content/insights'), output = path.join(root, 'dist') } = {}) {
  const reports = await loadReports(source);
  const assets = path.join(output, 'assets');
  await mkdir(assets, { recursive: true });
  await copyFile(require.resolve('@fontsource/inter/LICENSE'), path.join(assets, 'insight-font-license.txt'));
  let css = await readFile(new URL('../audits/insights.css', import.meta.url), 'utf8');
  for (const [weight, name] of [['400', 'regular'], ['600', 'semibold']]) {
    const font = require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff2`);
    const hash = createHash('sha256').update(await readFile(font)).digest('hex').slice(0, 12);
    const filename = `insight-font-${name}.${hash}.woff2`;
    await copyFile(font, path.join(assets, filename));
    css = css.replace(`/assets/insight-font-${name}.woff2`, `/assets/${filename}`);
  }
  const hash = createHash('sha256').update(css).digest('hex').slice(0, 12);
  const stylesheet = `/assets/insights.${hash}.css`;
  await writeFile(path.join(assets, path.basename(stylesheet)), css);
  await writeFile(path.join(output, 'insights-unavailable.html'), renderMissing(stylesheet));
  for (const report of reports) {
    const destination = path.join(output, 'insights', report.slug);
    // Render both artifacts before writing either; any failure aborts the build.
    const pdf = await renderPdf(report);
    const html = renderReport(report, stylesheet);
    await mkdir(destination, { recursive: true });
    await writeFile(path.join(destination, 'index.html'), html);
    await writeFile(path.join(destination, 'report.pdf'), pdf);
    console.log(`Built /insights/${report.slug} and /insights/${report.slug}/report.pdf`);
  }
  console.log(`Insights: ${reports.length} approved report(s). No public index generated.`);
  return reports;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--validate')) {
    const reports = await loadReports(path.join(root, 'src/content/insights'));
    console.log(`Validated ${reports.length} approved report(s).`);
  } else await buildInsights();
}
