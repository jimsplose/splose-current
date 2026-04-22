// scripts/create-labels.mjs
// Run once: node scripts/create-labels.mjs
// Requires GITHUB_TOKEN and GITHUB_REPO in env or .env.local

import { readFileSync } from 'fs';

// Load .env.local manually
try {
  const env = readFileSync('.env.local', 'utf8');
  for (const line of env.split('\n')) {
    const [k, v] = line.split('=');
    if (k && v) process.env[k.trim()] = v.trim();
  }
} catch {}

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO ?? 'jimsplose/splose-current';
const BASE = `https://api.github.com/repos/${REPO}`;

const LABELS = [
  { name: 'bug',       color: 'b91c1c', description: 'Visual defect in the replica' },
  { name: 'missing',   color: '1d4ed8', description: 'Element exists in production, absent in replica' },
  { name: 'remove',    color: '92400e', description: 'Something in replica that should not be there' },
  { name: 'new-page',  color: '065f46', description: 'Full production page that needs replicating' },
  { name: 'workflow',  color: '4c1d95', description: 'Parent issue grouping a multi-step flow' },
  { name: 'from-jim',  color: '7c3aed', description: 'Created by Jim — authoritative request' },
  { name: 'minor',     color: '6b7280', description: 'Minor severity' },
  { name: 'moderate',  color: 'd97706', description: 'Moderate severity' },
  { name: 'major',     color: 'dc2626', description: 'Major severity' },
];

const hdrs = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
};

for (const label of LABELS) {
  const res = await fetch(`${BASE}/labels`, { method: 'POST', headers: hdrs, body: JSON.stringify(label) });
  if (res.status === 422) {
    console.log(`⚠️  Label "${label.name}" already exists — skipping`);
  } else if (res.ok) {
    console.log(`✅  Created label "${label.name}"`);
  } else {
    console.error(`❌  Failed to create "${label.name}": ${res.status}`);
  }
}
