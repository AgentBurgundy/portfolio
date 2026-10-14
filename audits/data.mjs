import Ajv from 'ajv';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const schema = JSON.parse(await readFile(new URL('./schema.json', import.meta.url), 'utf8'));
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
export const origin = 'https://aibaker.io';
export const invitation = "I'd first learn how your team actually works, including its tools and handoffs. Then we can explore whether a process change or AI assistance would be useful.";
export const contactUrl = `${origin}/#contact`;
export const reportUrl = report => `${origin}/insights/${report.slug}`;
export const readableDate = value => new Date(`${value}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

// Validation is a publication gate, not a substitute for a human checking sources.
export function validateReport(report, label = 'report', today = new Date().toISOString().slice(0, 10)) {
  if (!validate(report)) throw new Error(`${label}: ${ajv.errorsText(validate.errors, { separator: '; ' })}`);
  const fail = message => { throw new Error(`${label}: ${message}`); };
  const checkDate = (date, field) => {
    const parsed = new Date(`${date}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date || date > today) fail(`${field} must be a real date, no later than today`);
  };
  const checkUrl = (value, field) => {
    let url;
    try { url = new URL(value); } catch { fail(`${field} must be a public HTTPS URL`); }
    const hostname = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || url.username || url.password || url.port || !hostname.includes('.') || hostname.endsWith('.local') || hostname.endsWith('.localhost') || hostname.endsWith('.internal') || /^[\d.]+$/.test(hostname) || hostname.includes(':')) fail(`${field} must be a public HTTPS hostname without credentials`);
    if ([...url.searchParams.keys()].some(key => /token|secret|password|email|api.?key|auth/i.test(key))) fail(`${field} contains a potentially private query parameter`);
  };
  const checkStrings = value => {
    if (typeof value === 'string') {
      if (!value.trim() || value !== value.trim() || /[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/u.test(value)) fail('text must be trimmed and contain no control characters');
      if (/\b(?:estimated? revenue|revenue estimate|revenue potential|annual revenue|fabricated score|opportunity score|audit score)\b/i.test(value)) fail('remove revenue estimates and invented scores');
      if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(value)) fail('keep contact records out of report data');
    } else if (Array.isArray(value)) value.forEach(checkStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(checkStrings);
  };
  checkStrings(report);
  checkDate(report.snapshotDate, 'snapshotDate');
  checkUrl(report.website, 'website');
  const ids = new Set();
  const used = new Set();
  for (const source of report.sources) {
    if (ids.has(source.id)) fail(`duplicate source id ${source.id}`);
    ids.add(source.id);
    checkUrl(source.url, `source ${source.id}`);
    checkDate(source.observedOn, `source ${source.id} observedOn`);
    if (source.observedOn > report.snapshotDate) fail(`source ${source.id} is later than snapshotDate`);
  }
  for (const item of [...report.metrics, ...report.observations]) {
    for (const id of item.sourceIds) {
      if (!ids.has(id)) fail(`missing evidence source ${id}`);
      used.add(id);
    }
  }
  for (const id of ids) if (!used.has(id)) fail(`unused evidence source ${id}`);
  const words = [report.companyName, ...report.metrics.flatMap(x => [x.label, x.value, x.context]), ...report.observations.flatMap(x => [x.title, x.observed, x.improvement])].join(' ').split(/\s+/).length;
  if (words > 330) fail(`keep company, metrics, and observations under 330 words (received ${words})`);
  return report;
}

export async function loadReports(directory) {
  if (directory instanceof URL) directory = fileURLToPath(directory);
  const entries = await readdir(directory, { withFileTypes: true });
  const reports = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === '.gitkeep') continue;
    if (!entry.isFile() || !entry.name.endsWith('.json')) throw new Error(`Unexpected file in report data directory: ${entry.name}`);
    const report = validateReport(JSON.parse(await readFile(path.join(directory, entry.name), 'utf8')), entry.name);
    if (entry.name !== `${report.slug}.json`) throw new Error(`${entry.name}: filename must match slug`);
    reports.push(report);
  }
  return reports;
}
