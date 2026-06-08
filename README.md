# zapier-automation-sprawl-auditor

Board-readable Kinetic Gain proof repo for **Zapier** platform and company signal coverage.

## Product thesis

Lightweight automations can quietly become production dependencies without owners, rollback paths, or evidence of business value.

This repo turns that problem into a small, inspectable product surface: synthetic fixture data, a deterministic CLI, a tested scoring model, a JSON report, and a static brief that explains the business and technical value of the signal.

## Buyer and operator fit

- **Primary audience:** RevOps, marketing operations, IT, and automation governance teams
- **Signal domain:** Workflow Automation
- **Executive question:** Where is this system creating exposure, waste, or decision latency?
- **Product motion:** The product inventories automation paths, classifies operational risk, identifies redundant workflows, and routes cleanup by owner.
- **Value architecture:** Leaders can decide what to consolidate, retire, govern, or promote into a more durable integration layer.

## What this repo proves

- **Normalize:** messy Zapier operating evidence is represented as explicit lanes.
- **Score:** risk and evidence depth are measured separately so weak proof is not hidden by high urgency.
- **Route:** each lane has an owner and next action instead of a vague status.
- **Package:** CLI output, tests, JSON report, and static page all tell the same board-ready story.

## Integration boundary

Focus area: Zapier zaps, app connections, trigger/action chains, owners, and failure history.

This is synthetic proof only. It does not connect to live Zapier tenants, call private APIs, store secrets, publish credentials, or expose customer data.

## Local run

```bash
npm install
npm test
npm run build
npm run demo
```

## Public surface

The generated site is in `site/index.html`. The data report is in `site/report.json`.

## Keywords

- Zapier
- automation governance
- workflow sprawl
- RevOps automation
- integration risk
