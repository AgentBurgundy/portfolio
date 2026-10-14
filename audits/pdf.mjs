import PDFDocument from 'pdfkit';
import { createRequire } from 'node:module';
import { invitation, contactUrl, reportUrl, readableDate } from './data.mjs';

const require = createRequire(import.meta.url);
export const fonts = {
  regular: require.resolve('@fontsource/inter/files/inter-latin-400-normal.woff'),
  semibold: require.resolve('@fontsource/inter/files/inter-latin-600-normal.woff'),
};
const colors = { ink: '#171d22', paper: '#faf7f2', accent: '#ac3c1b', muted: '#5c6270', line: '#e3ded5' };

// A measured layout, with a small typography adjustment for longer verified copy.
// Fail the build rather than clipping content or silently adding a second page.
export async function renderPdf(report) {
  for (const scale of [1, 0.94, 0.88]) {
    const doc = new PDFDocument({ size: 'LETTER', margin: 0, bufferPages: true, compress: true, info: {
      Title: `${report.companyName} | Public presence notes`, Author: 'Ronald / AI Baker',
      Subject: `Verified public snapshot: ${report.snapshotDate}`, CreationDate: new Date(`${report.snapshotDate}T12:00:00Z`),
    } });
    const chunks = [];
    const complete = new Promise((resolve, reject) => {
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });
    doc.registerFont('regular', fonts.regular).registerFont('semibold', fonts.semibold);
    // Unsupported characters must not become blank boxes in company names or facts.
    const available = doc.font('regular')._font.font;
    const allText = JSON.stringify(report);
    for (const character of new Set(allText)) {
      if (character.codePointAt(0) > 31 && !available.hasGlyphForCodePoint(character.codePointAt(0))) {
        throw new Error(`${report.slug}: PDF font does not support ${JSON.stringify(character)}; supply a suitable licensed font before publishing`);
      }
    }
    const x = 40, width = 532;
    let y = 39;
    const text = (value, tx, ty, tw, size = 9, weight = 'regular', color = colors.ink, options = {}) => {
      doc.font(weight).fontSize(size * scale).fillColor(color);
      const settings = { width: tw, lineGap: 2 * scale, ...options };
      const height = doc.heightOfString(value, settings);
      doc.text(value, tx, ty, settings);
      return height;
    };
    const rule = at => doc.moveTo(x, at).lineTo(x + width, at).lineWidth(0.6).stroke(colors.line);
    const citations = item => item.sourceIds.map(id => `[${report.sources.findIndex(s => s.id === id) + 1}]`).join(' ');
    const linkRefs = (item, tx, ty) => {
      item.sourceIds.forEach((id, i) => {
        const index = report.sources.findIndex(source => source.id === id);
        const lx = tx + i * 20;
        text(`[${index + 1}]`, lx, ty, 20, 7, 'regular', colors.accent, { link: report.sources[index].url, underline: true });
      });
    };
    text('ai baker.', x, y, 180, 17, 'semibold');
    text('PUBLIC PRESENCE NOTES', 355, y + 5, 217, 7, 'semibold', colors.muted, { align: 'right' });
    y += 30; rule(y); y += 19;
    y += text(report.companyName, x, y, width, 27, 'semibold') + 7;
    text(`Public snapshot / ${readableDate(report.snapshotDate)}`, x, y, width, 8, 'regular', colors.muted);
    y += 23;
    if (report.scope) y += text(report.scope, x, y, width, 8, 'regular', colors.muted) + 13;

    if (report.metrics.length) {
      const cellWidth = width / report.metrics.length;
      const heights = report.metrics.map(metric => {
        doc.font('regular').fontSize(8 * scale);
        const labelHeight = doc.heightOfString(metric.label, { width: cellWidth - 28, lineGap: 2 * scale });
        const contextHeight = doc.heightOfString(`${metric.context} ${citations(metric)}`, { width: cellWidth - 28, lineGap: 2 * scale });
        doc.font('semibold').fontSize(22 * scale);
        const valueHeight = doc.heightOfString(metric.value, { width: cellWidth - 28, lineGap: 2 * scale });
        return 14 + labelHeight + 5 + valueHeight + 5 + contextHeight + 14;
      });
      const height = Math.max(...heights);
      doc.roundedRect(x, y, width, height, 5).fill(colors.paper);
      report.metrics.forEach((metric, i) => {
        const cx = x + i * cellWidth;
        if (i) doc.moveTo(cx, y + 12).lineTo(cx, y + height - 12).stroke(colors.line);
        let my = y + 13;
        my += text(metric.label, cx + 14, my, cellWidth - 28, 8, 'regular', colors.muted) + 5;
        my += text(metric.value, cx + 14, my, cellWidth - 28, 22, 'semibold') + 4;
        text(`${metric.context} ${citations(metric)}`, cx + 14, my, cellWidth - 28, 8, 'regular', colors.muted);
      });
      y += height + 21;
    }
    text('Company website', x + width - 100, y + 5, 100, 7, 'regular', colors.accent, { link: report.website, underline: true, align: 'right' });
    y += text('A few places to start.', x, y, width - 110, 16, 'semibold') + 12;
    for (const [index, item] of report.observations.entries()) {
      rule(y); y += 12;
      text(`0${index + 1}`, x, y + 2, 25, 8, 'semibold', colors.accent);
      const contentX = x + 34, contentWidth = width - 34;
      y += text(item.title, contentX, y, contentWidth - 70, 10.5, 'semibold') + 5;
      linkRefs(item, x + width - 60, y - 15 * scale);
      y += text(item.observed, contentX, y, contentWidth, 9, 'regular', colors.muted) + 5;
      y += text(`Next step: ${item.improvement}`, contentX, y, contentWidth, 9) + 13;
    }
    y += 1;
    const ctaX = x + 15, ctaWidth = width - 30;
    doc.font('regular').fontSize(9 * scale);
    const ctaHeight = doc.heightOfString(invitation, { width: ctaWidth, lineGap: 2 * scale }) + 61 * scale;
    doc.roundedRect(x, y, width, ctaHeight, 5).fill(colors.paper);
    let cy = y + 12 * scale;
    cy += text("Let's learn how the work happens.", ctaX, cy, ctaWidth, 12, 'semibold') + 5 * scale;
    cy += text(invitation, ctaX, cy, ctaWidth, 9, 'regular', colors.muted) + 6 * scale;
    text('Explore together at aibaker.io', ctaX, cy, ctaWidth, 8, 'semibold', colors.accent, { link: contactUrl, underline: true });
    y += ctaHeight + 17;

    y += text('EVIDENCE & CONTEXT', x, y, width, 7, 'semibold', colors.muted) + 5;
    y += text('A dated view of the public-facing presence. Details can change.', x, y, width, 7, 'regular', colors.muted) + 7;
    for (const note of report.limitations || []) y += text(note, x, y, width, 7, 'regular', colors.muted) + 4;
    y += 3;
    const sourceTop = y;
    const columnWidth = (width - 22) / 2;
    const sourceBottoms = [sourceTop, sourceTop];
    report.sources.forEach((source, index) => {
      const column = index % 2;
      const sx = x + column * (columnWidth + 22);
      let sy = sourceBottoms[column];
      sy += text(`[${index + 1}] ${source.label}`, sx, sy, columnWidth, 7, 'regular', colors.accent, { link: source.url, underline: true }) + 1;
      sy += text(`Checked ${readableDate(source.observedOn)}`, sx, sy, columnWidth, 6.5, 'regular', colors.muted) + 2;
      if (source.context) sy += text(source.context, sx, sy, columnWidth, 7, 'regular', colors.muted) + 2;
      sourceBottoms[column] = sy + 6;
    });
    y = Math.max(...sourceBottoms);
    const fits = y < 736 && doc.bufferedPageRange().count === 1;
    if (fits) {
      rule(752);
      text('Prepared by Ronald / AI Baker', x, 761, 210, 6.5, 'regular', colors.muted);
      text('Unlisted / publicly accessible', 342, 761, 230, 6.5, 'regular', colors.muted, { align: 'right' });
      // The stable page URL remains clickable without adding a second URL list.
      doc.link(x, 761, 210, 12, reportUrl(report));
    }
    doc.end();
    const pdf = await complete;
    if (fits) return pdf;
  }
  throw new Error(`${report.slug}: report exceeds a compact one-page PDF; shorten copy or source context`);
}
