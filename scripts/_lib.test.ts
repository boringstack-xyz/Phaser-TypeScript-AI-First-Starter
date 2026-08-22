import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { writeFileSafe } from './_lib.js';

describe('writeFileSafe', () => {
  const dirs: string[] = [];

  afterEach(() => {
    for (const dir of dirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('creates a missing file and refuses to clobber it without overwrite', () => {
    const dir = mkdtempSync(join(tmpdir(), 'phaser-write-'));
    dirs.push(dir);
    const path = join(dir, 'nested', 'out.ts');

    expect(writeFileSafe(path, 'one\n')).toBe(true);
    expect(readFileSync(path, 'utf8')).toBe('one\n');
    expect(writeFileSafe(path, 'two\n')).toBe(false);
    expect(readFileSync(path, 'utf8')).toBe('one\n');
  });

  it('overwrites when overwrite is true', () => {
    const dir = mkdtempSync(join(tmpdir(), 'phaser-write-'));
    dirs.push(dir);
    const path = join(dir, 'out.ts');

    expect(writeFileSafe(path, 'one\n')).toBe(true);
    expect(writeFileSafe(path, 'two\n', true)).toBe(true);
    expect(readFileSync(path, 'utf8')).toBe('two\n');
  });
});
