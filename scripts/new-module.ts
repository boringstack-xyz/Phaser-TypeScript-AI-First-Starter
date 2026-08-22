import { resolve } from 'node:path';
import process from 'node:process';

import { require1Arg, toPascalCase, writeFileSafe } from './_lib.js';

const raw = require1Arg('new:module');
const Name = toPascalCase(raw);
const folder = Name.charAt(0).toLowerCase() + Name.slice(1);
const base = resolve(process.cwd(), 'src', 'domain', folder);

const files: Record<string, string> = {
  [`${base}/${Name}.types.ts`]: `export interface ${Name}State {
  readonly id: string;
}
`,
  [`${base}/${Name}.constants.ts`]: `export const ${Name.toUpperCase()}_CONSTANT = 0;
`,
  [`${base}/${Name}.model.ts`]: `import type { ${Name}State } from './${Name}.types.js';

export const create${Name} = (id: string): ${Name}State => ({ id });
`,
  [`${base}/${Name}.behavior.ts`]: `import type { ${Name}State } from './${Name}.types.js';

export const noop${Name} = (state: ${Name}State): ${Name}State => state;
`,
  [`${base}/${Name}.system.ts`]: `// Orchestrates multiple behaviors. Keep pure where possible.
export {};
`,
  [`${base}/${Name}.contracts.ts`]: `// Module-specific ports. Cross-cutting ports live in src/shared/types/ports.ts.
export {};
`,
  [`${base}/${Name}.test.ts`]: `import { describe, expect, it } from 'vitest';

import { noop${Name} } from './${Name}.behavior.js';
import { create${Name} } from './${Name}.model.js';

describe('${Name}.noop', () => {
  it('returns the input state unchanged', () => {
    const state = create${Name}('test');
    expect(noop${Name}(state)).toBe(state);
  });
});
`,
  [`${base}/index.ts`]: `export type { ${Name}State } from './${Name}.types.js';
export { create${Name} } from './${Name}.model.js';
export { noop${Name} } from './${Name}.behavior.js';
`,
};

console.log(`creating domain module: ${Name}`);
for (const [path, body] of Object.entries(files)) {
  writeFileSafe(path, body);
}
console.log(
  `\nDone. Next:\n  • Register exports in ${base}/index.ts as you add them\n  • Add the module to docs/ai/catalog.md (or run bun run catalog)`,
);
