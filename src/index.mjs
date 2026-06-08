import fs from 'node:fs';

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

if (import.meta.url === 'file://' + process.argv[1]) {
  const fixturePath = process.argv[2] ?? 'fixtures/sample.json';
  const siteIndex = process.argv.indexOf('--site');
  const input = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const summary = summarizeSignal(input);
  if (siteIndex >= 0) {
    fs.writeFileSync(process.argv[siteIndex + 1], JSON.stringify(summary, null, 2));
  }
  console.log(formatSummary(summary));
}
