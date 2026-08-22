import { resolve } from 'node:path';
import process from 'node:process';

import { require1Arg, toPascalCase, writeFileSafe } from './_lib.js';

const raw = require1Arg('new:feature');
const Name = toPascalCase(raw);
const folder = Name.charAt(0).toLowerCase() + Name.slice(1);
const base = resolve(process.cwd(), 'src', 'features', folder);

const files: Record<string, string> = {
  [`${base}/${Name}Feature.ts`]: `import type { GameEventMap } from '@domain/core';

import type { IEventBus } from '@shared/events';

export interface I${Name}FeatureDeps {
  readonly events: IEventBus<GameEventMap>;
}

export interface I${Name}Feature {
  dispose: () => void;
}

export const create${Name}Feature = (_deps: I${Name}FeatureDeps): I${Name}Feature => ({
  dispose() {},
});
`,
  [`${base}/${Name}Feature.test.ts`]: `import { describe, expect, it } from 'vitest';

import type { GameEventMap } from '@domain/core';

import { createEventBus } from '@shared/events';

import { create${Name}Feature } from './${Name}Feature.js';

describe('${Name}Feature', () => {
  it('can be created and disposed', () => {
    const events = createEventBus<GameEventMap>();
    const feature = create${Name}Feature({ events });
    expect(() => feature.dispose()).not.toThrow();
  });
});
`,
  [`${base}/index.ts`]: `export { create${Name}Feature } from './${Name}Feature.js';
export type { I${Name}Feature, I${Name}FeatureDeps } from './${Name}Feature.js';
`,
};

console.log(`creating feature: ${Name}`);
for (const [path, body] of Object.entries(files)) {
  writeFileSafe(path, body);
}
console.log(
  `\nDone. Wire the feature in scene setup (e.g. src/runtime/phaser/scenes/WorldScene/WorldScene.setup.ts). Process-wide ports come from src/app/composition — do not construct adapters in the scene.`,
);
