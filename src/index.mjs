import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PRODUCT = {
  "repo": "zapier-automation-sprawl-auditor",
  "vendor": "Zapier",
  "title": "automation sprawl auditor",
  "domain": "Workflow Automation",
  "audience": "RevOps, marketing operations, IT, and automation governance teams",
  "problem": "Lightweight automations can quietly become production dependencies without owners, rollback paths, or evidence of business value.",
  "workflow": "The product inventories automation paths, classifies operational risk, identifies redundant workflows, and routes cleanup by owner.",
  "business": "Leaders can decide what to consolidate, retire, govern, or promote into a more durable integration layer.",
  "technical": "Synthetic automation lanes are scored with a reproducible CLI and emitted as a static decision brief.",
  "integration": "Zapier zaps, app connections, trigger/action chains, owners, and failure history.",
  "keywords": [
    "Zapier",
    "automation governance",
    "workflow sprawl",
    "RevOps automation",
    "integration risk"
  ]
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function summarizeSignal(input) {
  const lanes = input.lanes ?? [];
  const averageRisk = Math.round(lanes.reduce((sum, lane) => sum + lane.risk, 0) / Math.max(lanes.length, 1));
  const averageEvidence = Math.round(lanes.reduce((sum, lane) => sum + lane.evidence, 0) / Math.max(lanes.length, 1));
  const priorityLane = [...lanes].sort((a, b) => b.risk - a.risk)[0] ?? null;
  return {
    vendor: input.vendor,
    domain: input.domain,
    averageRisk,
    averageEvidence,
    priorityLane: priorityLane?.name ?? 'None',
    recommendation: priorityLane
      ? input.vendor + ': start with ' + priorityLane.name.toLowerCase() + ' because it has the highest board-visible risk.'
      : input.vendor + ': no lanes available for scoring.'
  };
}

export function formatSummary(summary) {
  return [
    summary.vendor + ' signal brief',
    'Domain: ' + summary.domain,
    'Average risk: ' + summary.averageRisk,
    'Evidence depth: ' + summary.averageEvidence,
    'Priority lane: ' + summary.priorityLane,
    'Recommendation: ' + summary.recommendation
  ].join('\n');
}

function renderLaneRows(input) {
  return (input.lanes ?? []).map((lane) => `
    <tr>
      <td><strong>${escapeHtml(lane.name)}</strong><span>${escapeHtml(lane.owner)}</span></td>
      <td>${escapeHtml(lane.risk)}</td>
      <td>${escapeHtml(lane.evidence)}</td>
      <td>${escapeHtml(lane.nextAction)}</td>
    </tr>`).join('');
}

function renderKeywords() {
  return PRODUCT.keywords.map((keyword) => `<span class="pill">${escapeHtml(keyword)}</span>`).join('');
}

export function renderSite(input, summary) {
  const pageTitle = `${PRODUCT.vendor} ${PRODUCT.title} | Kinetic Gain`;
  const description = `${PRODUCT.vendor} ${PRODUCT.title} turns ${PRODUCT.domain} complexity into board-ready operating decisions.`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index,follow" />
    <style>
      :root { color-scheme: dark; --bg: #070b12; --panel: #101827; --panel2: #0c1322; --line: rgba(148, 163, 184, .22); --line2: rgba(56, 231, 170, .28); --text: #f5f1e8; --muted: #aeb8ca; --aqua: #25d9f2; --mint: #39e7aa; --violet: #a78bfa; --amber: #fbbf24; --red: #fb7185; --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --sans: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: var(--sans); background: radial-gradient(circle at 80% 0%, rgba(37,217,242,.18), transparent 34%), radial-gradient(circle at 12% 18%, rgba(57,231,170,.14), transparent 30%), linear-gradient(180deg, #060912 0%, #070b12 55%, #05070c 100%); color: var(--text); }
      main { max-width: 1180px; margin: 0 auto; padding: clamp(24px, 4vw, 56px) 20px 76px; }
      .hero, .panel, .table, .quote { border: 1px solid var(--line); background: linear-gradient(145deg, rgba(16,24,39,.94), rgba(7,11,18,.98)); box-shadow: 0 24px 80px rgba(0,0,0,.34); }
      .hero { border-radius: 30px; padding: clamp(24px, 5vw, 56px); position: relative; overflow: hidden; }
      .hero::before { content: ""; position: absolute; inset: 0; border-top: 2px solid var(--line2); background: linear-gradient(115deg, rgba(57,231,170,.09), transparent 38%, rgba(37,217,242,.08)); pointer-events: none; }
      .hero > * { position: relative; }
      .eyebrow, .label { color: var(--mint); text-transform: uppercase; letter-spacing: .16em; font: 700 12px/1.2 var(--mono); }
      h1 { margin: 18px 0; max-width: 950px; font-size: clamp(42px, 7vw, 86px); line-height: .94; letter-spacing: -.055em; }
      h2 { margin: 0 0 16px; font-size: clamp(26px, 3vw, 42px); letter-spacing: -.035em; }
      h3 { margin: 10px 0 8px; font-size: 21px; letter-spacing: -.02em; }
      p { color: var(--muted); font-size: 17px; line-height: 1.65; max-width: 780px; }
      .hero-grid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 22px; align-items: end; }
      .scorebox { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
      .metric { border: 1px solid var(--line); border-radius: 18px; padding: 18px; background: rgba(255,255,255,.035); min-height: 126px; }
      .metric span { color: var(--muted); font: 700 11px/1.3 var(--mono); letter-spacing: .14em; text-transform: uppercase; }
      .metric b { display: block; color: var(--aqua); font-size: clamp(24px, 4vw, 38px); margin-top: 10px; }
      .section { margin-top: 28px; }
      .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
      .grid.four { grid-template-columns: repeat(4, 1fr); }
      .panel { border-radius: 22px; padding: 22px; }
      .panel p { font-size: 15px; margin-bottom: 0; }
      .label { color: var(--aqua); font-size: 10px; }
      .pillrow { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 18px; }
      .pill { min-height: 38px; display: inline-flex; align-items: center; border: 1px solid rgba(37,217,242,.24); border-radius: 999px; padding: 9px 13px; color: #c7d2fe; background: rgba(37,217,242,.055); font: 700 12px/1 var(--mono); }
      .table { border-radius: 22px; overflow: hidden; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: 14px 16px; border-bottom: 1px solid rgba(148,163,184,.14); color: var(--muted); vertical-align: top; }
      th { color: #dbeafe; font: 700 11px/1.25 var(--mono); letter-spacing: .14em; text-transform: uppercase; background: rgba(255,255,255,.035); }
      td strong { color: var(--text); display: block; margin-bottom: 4px; }
      td span { color: rgba(174,184,202,.72); font-size: 13px; }
      .quote { border-radius: 24px; padding: 24px; border-color: rgba(57,231,170,.26); }
      .quote b { color: var(--mint); }
      .footer { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; color: rgba(174,184,202,.64); font: 700 12px/1.4 var(--mono); }
      .footer a { color: var(--aqua); text-decoration: none; }
      @media (max-width: 840px) {
        main { padding-inline: 14px; }
        .hero-grid, .grid, .grid.four, .scorebox { grid-template-columns: 1fr; }
        h1 { font-size: clamp(40px, 13vw, 58px); }
        p { font-size: 16px; }
        .table { overflow-x: auto; }
        table { min-width: 720px; }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <div class="hero-grid">
          <div>
            <div class="eyebrow">Kinetic Gain platform signal</div>
            <h1>${escapeHtml(PRODUCT.vendor)} ${escapeHtml(PRODUCT.title)}.</h1>
            <p>${escapeHtml(PRODUCT.problem)}</p>
            <div class="pillrow">${renderKeywords()}</div>
          </div>
          <div class="scorebox">
            <div class="metric"><span>Average risk</span><b>${escapeHtml(summary.averageRisk)}</b></div>
            <div class="metric"><span>Evidence depth</span><b>${escapeHtml(summary.averageEvidence)}</b></div>
            <div class="metric"><span>Priority lane</span><b style="font-size:22px">${escapeHtml(summary.priorityLane)}</b></div>
          </div>
        </div>
      </section>

      <section class="section grid">
        <article class="panel"><div class="label">Who it is for</div><h3>${escapeHtml(PRODUCT.audience)}</h3><p>Written so an executive can understand the operating exposure and a technical reviewer can see the control logic behind the surface.</p></article>
        <article class="panel"><div class="label">What it does</div><h3>Turns fragmented system signals into a decision lane.</h3><p>${escapeHtml(PRODUCT.workflow)}</p></article>
        <article class="panel"><div class="label">Why it matters</div><h3>Connects platform work to board questions.</h3><p>${escapeHtml(PRODUCT.business)}</p></article>
      </section>

      <section class="section">
        <h2>What these signal repos have in common</h2>
        <div class="grid four">
          <article class="panel"><div class="label">01 / Normalize</div><h3>Messy platform evidence becomes readable.</h3><p>Each repo starts with synthetic lane data shaped like real operating evidence: owners, risks, evidence depth, and next actions.</p></article>
          <article class="panel"><div class="label">02 / Score</div><h3>Risk and evidence are separated.</h3><p>The model does not confuse loud risk with strong proof. Risk posture and evidence depth are scored independently.</p></article>
          <article class="panel"><div class="label">03 / Route</div><h3>Every finding has an owner.</h3><p>The output names the team or executive lane that must remediate, fund, consolidate, or monitor the issue.</p></article>
          <article class="panel"><div class="label">04 / Package</div><h3>The result is board-ready.</h3><p>The same fixture powers CLI output, test assertions, JSON report data, and this crawlable static brief.</p></article>
        </div>
      </section>

      <section class="section">
        <h2>Evidence lanes</h2>
        <div class="table">
          <table>
            <thead><tr><th>Lane</th><th>Risk</th><th>Evidence</th><th>Next action</th></tr></thead>
            <tbody>${renderLaneRows(input)}</tbody>
          </table>
        </div>
      </section>

      <section class="section grid">
        <article class="panel"><div class="label">SaaS GTM analyst lens</div><h3>Marketable proof, not keyword stuffing.</h3><p>The page shows the buyer, pain, workflow, and decision value behind ${escapeHtml(PRODUCT.vendor)} so the portfolio signal is credible to non-technical evaluators.</p></article>
        <article class="panel"><div class="label">SaaS value architect lens</div><h3>Value ties to exposure, savings, and investment.</h3><p>The evidence model explains where leaders are exposed, where work can be consolidated, and which control deserves funding.</p></article>
        <article class="panel"><div class="label">Technical reviewer lens</div><h3>Small repo, inspectable mechanics.</h3><p>${escapeHtml(PRODUCT.technical)} The fixture, test, and generated report are intentionally visible.</p></article>
      </section>

      <section class="section quote">
        <div class="label">Integration boundary</div>
        <p><b>${escapeHtml(PRODUCT.vendor)}</b> signal coverage focuses on ${escapeHtml(PRODUCT.integration)} This is synthetic proof only: no live credentials, tenant records, customer data, or private operational logs are published.</p>
      </section>

      <div class="footer">
        <span>${escapeHtml(PRODUCT.vendor)} signal brief</span>
        <a href="https://portfolio.kineticgain.com/">Portfolio atlas</a>
        <a href="https://kineticgain.com/">Kinetic Gain</a>
        <span>AGPL-3.0-or-later</span>
      </div>
    </main>
  </body>
</html>`;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  const fixturePath = process.argv[2] ?? 'fixtures/sample.json';
  const siteIndex = process.argv.indexOf('--site');
  const input = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const summary = summarizeSignal(input);
  if (siteIndex >= 0) {
    const target = process.argv[siteIndex + 1];
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, JSON.stringify(summary, null, 2));
    fs.writeFileSync(path.join(path.dirname(target), 'index.html'), renderSite(input, summary));
  }
  console.log(formatSummary(summary));
}
