import { invitation, contactUrl, origin, reportUrl, readableDate } from './data.mjs';

export function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
const e = escapeHtml;
const external = (url, label) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer nofollow">${e(label)}<span class="visually-hidden"> (opens in a new tab)</span><span aria-hidden="true"> ↗</span></a>`;

export function renderReport(report, stylesheet) {
  const title = `${report.companyName} | Public presence notes | AI Baker`;
  const description = `A few verified public observations for ${report.companyName}. Snapshot: ${readableDate(report.snapshotDate)}.`;
  const refs = item => `<span class="evidence-links" aria-label="Evidence">${item.sourceIds.map(id => {
    const index = report.sources.findIndex(source => source.id === id);
    return `<a href="#evidence-${e(id)}" aria-label="Evidence ${index + 1}: ${e(report.sources[index].label)}">[${index + 1}]</a>`;
  }).join(' ')}</span>`;
  return `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><meta name="referrer" content="no-referrer">
<meta name="theme-color" content="#faf7f2"><title>${e(title)}</title>
<meta name="description" content="${e(description)}"><link rel="canonical" href="${e(reportUrl(report))}">
<meta property="og:type" content="website"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${e(reportUrl(report))}">
<meta name="twitter:card" content="summary"><link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="${e(stylesheet)}">
</head><body class="insight">
<a class="skip" href="#notes">Skip to notes</a>
<header class="masthead wrap"><a class="brand" href="${origin}/" aria-label="AI Baker home"><span class="brand-mark">a</span>ai baker<span class="brand-dot">.</span></a><a class="download" href="/insights/${e(report.slug)}/report.pdf" download="${e(report.slug)}-public-presence.pdf">Download PDF <span aria-hidden="true">↓</span></a></header>
<main id="notes">
<section class="hero"><div class="wrap hero-inner"><span class="eyebrow">A FEW NOTES FROM THE OUTSIDE</span><h1>${e(report.companyName)}</h1><p>Public presence. Practical next steps.</p>${report.scope ? `<p class="hero-scope">${e(report.scope)}</p>` : ''}<div class="snapshot"><span>PUBLIC SNAPSHOT</span><time datetime="${e(report.snapshotDate)}">${e(readableDate(report.snapshotDate))}</time></div></div></section>
<div class="wrap body-wrap">
${report.metrics.length ? `<section class="metrics" aria-label="Verified public metrics">${report.metrics.map(metric => `<article class="metric"><h2>${e(metric.label)}</h2><p class="metric-value">${e(metric.value)}</p><p class="metric-context">${e(metric.context)} ${refs(metric)}</p></article>`).join('')}</section>` : ''}
<section class="observations" aria-labelledby="observations-title"><div class="section-heading"><h2 id="observations-title">A few places to start.</h2><span>${external(report.website, 'Company website')}</span></div>
${report.observations.map((item, i) => `<article class="observation"><span class="number" aria-hidden="true">0${i + 1}</span><div><h3>${e(item.title)} ${refs(item)}</h3><p>${e(item.observed)}</p><p class="improvement"><span>Next step</span> ${e(item.improvement)}</p></div></article>`).join('')}</section>
<section class="conversation" aria-labelledby="conversation-title"><div><span class="eyebrow">THE INSIDE PICTURE STARTS WITH YOU</span><h2 id="conversation-title">Let's learn how the work happens.</h2><p>${e(invitation)}</p></div><a class="contact" href="${contactUrl}">Explore together <span aria-hidden="true">↗</span></a></section>
<section class="sources" aria-labelledby="sources-title"><h2 id="sources-title">Evidence &amp; context</h2><p class="scope">A dated view of the public-facing presence. Details can change.</p>${(report.limitations || []).map(note => `<p class="scope">${e(note)}</p>`).join('')}<ol>${report.sources.map(source => `<li id="evidence-${e(source.id)}">${external(source.url, source.label)} <span class="source-date">Checked ${e(readableDate(source.observedOn))}</span>${source.context ? `<p>${e(source.context)}</p>` : ''}</li>`).join('')}</ol></section>
</div></main><footer class="wrap footer"><span>Prepared by Ronald / AI Baker</span><span>Unlisted · publicly accessible</span></footer>
</body></html>`;
}

export function renderMissing(stylesheet) {
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Notes unavailable | AI Baker</title><link rel="stylesheet" href="${e(stylesheet)}"></head><body class="insight"><main class="wrap missing"><span class="eyebrow">AI BAKER / PUBLIC PRESENCE NOTES</span><h1>These notes aren't available.</h1><p>Please check the direct link you received.</p><a href="${origin}/">AI Baker home ↗</a></main></body></html>`;
}
