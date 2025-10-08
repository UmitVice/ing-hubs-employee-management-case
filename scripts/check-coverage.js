#!/usr/bin/env node
// Coverage gate for lcov.info produced by web-test-runner (Istanbul format)
// Usage: node scripts/check-coverage.js <thresholdPercent>
import fs from 'node:fs';
import path from 'node:path';

const thresholdArg = Number(process.argv[2]);
const threshold = Number.isFinite(thresholdArg) ? thresholdArg : 85;

const lcovPath = path.resolve(process.cwd(), 'coverage', 'lcov.info');

if (!fs.existsSync(lcovPath)) {
  console.error('\nCoverage file not found at', lcovPath);
  console.error('Run tests with coverage before pushing.');
  process.exit(1);
}

const content = fs.readFileSync(lcovPath, 'utf8');

let totalLinesFound = 0;
let totalLinesHit = 0;

for (const line of content.split(/\r?\n/)) {
  if (line.startsWith('LF:')) {
    const found = Number(line.slice(3));
    if (Number.isFinite(found)) totalLinesFound += found;
  } else if (line.startsWith('LH:')) {
    const hit = Number(line.slice(3));
    if (Number.isFinite(hit)) totalLinesHit += hit;
  }
}

if (totalLinesFound === 0) {
  console.error('Could not determine coverage from lcov.info (LF total is 0).');
  process.exit(1);
}

const coverage = (totalLinesHit / totalLinesFound) * 100;
const coverageStr = coverage.toFixed(2);

if (coverage < threshold) {
  console.error(`\nCoverage gate failed: Lines ${coverageStr}% < required ${threshold}%`);
  process.exit(1);
}

process.stdout.write(`\nCoverage gate passed: Lines ${coverageStr}% ≥ ${threshold}%\n`);

