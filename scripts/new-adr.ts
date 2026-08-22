import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

import { toKebabCase, writeFileSafe } from './_lib.js';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('usage: bun run new:adr "<Title>"');
  process.exit(1);
}

const adrDir = resolve(process.cwd(), 'docs', 'adr');
const entries = readdirSync(adrDir).filter((f) => /^\d{4}-.+\.md$/.test(f));
const nextNumber = String(entries.length).padStart(4, '0');
const slug = toKebabCase(title);
const filename = `${nextNumber}-${slug}.md`;
const path = `${adrDir}/${filename}`;
const today = new Date().toISOString().slice(0, 10);

const body = `# ${nextNumber}. ${title}

Date: ${today}
Status: proposed

## Context

Why is this decision needed? What problem are we solving?

## Decision

What did we decide? State it concretely.

## Consequences

What becomes easier? What becomes harder? What do we now have to maintain?

## Alternatives considered

- Option A — rejected because …
- Option B — rejected because …
`;

writeFileSafe(path, body);
console.log(`\nEdit the ADR, then set Status to 'accepted' or 'rejected' when decided.`);
