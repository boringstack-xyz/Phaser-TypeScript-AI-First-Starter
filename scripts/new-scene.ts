import { resolve } from 'node:path';
import process from 'node:process';

import { require1Arg, toPascalCase, writeFileSafe } from './_lib.js';

const raw = require1Arg('new:scene');
const Name = toPascalCase(raw);
const base = resolve(process.cwd(), 'src', 'runtime', 'phaser', 'scenes', Name);

const key = Name.replace(/Scene$/, '');

const files: Record<string, string> = {
  [`${base}/${Name}.constants.ts`]: `import { asSceneKey, type SceneKey } from '../sceneKeys.js';

export const ${key.toUpperCase()}_SCENE_KEY: SceneKey = asSceneKey('${key}');
`,
  [`${base}/${Name}.setup.ts`]: `import type * as Phaser from 'phaser';

export interface I${Name}Runtime {
  update: (deltaMs: number) => void;
  dispose: () => void;
}

export const setup${Name} = (scene: Phaser.Scene): I${Name}Runtime => {
  void scene;
  return {
    update(_deltaMs) {},
    dispose() {},
  };
};
`,
  [`${base}/${Name}.ts`]: `import * as Phaser from 'phaser';

import { ${key.toUpperCase()}_SCENE_KEY } from './${Name}.constants.js';
import { setup${Name}, type I${Name}Runtime } from './${Name}.setup.js';

export class ${Name} extends Phaser.Scene {
  private runtime: I${Name}Runtime | null = null;

  constructor() {
    super(${key.toUpperCase()}_SCENE_KEY);
  }

  create(): void {
    this.runtime = setup${Name}(this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.runtime?.dispose();
      this.runtime = null;
    });
  }

  override update(_time: number, delta: number): void {
    this.runtime?.update(delta);
  }
}
`,
  [`${base}/index.ts`]: `export { ${Name} } from './${Name}.js';
export { ${key.toUpperCase()}_SCENE_KEY } from './${Name}.constants.js';
`,
};

console.log(`creating scene: ${Name}`);
for (const [path, body] of Object.entries(files)) {
  writeFileSafe(path, body);
}
console.log(`\nDone. Register the scene in src/app/config/gameConfig.ts.`);
