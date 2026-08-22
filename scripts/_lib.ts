import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

export const toPascalCase = (s: string): string =>
  s
    .replace(/[-_\s]+(.)?/g, (_, c: string | undefined) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase());

export const toCamelCase = (s: string): string => {
  const pascal = toPascalCase(s);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

export const toKebabCase = (s: string): string =>
  s
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export const writeFileSafe = (path: string, contents: string, overwrite = false): boolean => {
  if (existsSync(path) && !overwrite) {
    console.warn(`  skip   ${path}  (exists — use --force to overwrite)`);
    return false;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents, 'utf8');
  console.log(`  write  ${path}`);
  return true;
};

export const require1Arg = (name: string): string => {
  const arg = process.argv[2];
  if (!arg || arg.startsWith('-')) {
    console.error(`usage: bun run ${name} <Name>`);
    process.exit(1);
  }
  return arg;
};
