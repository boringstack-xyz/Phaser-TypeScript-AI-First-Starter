/**
 * Dependency-cruiser config — second architectural boundary check
 * See https://github.com/sverweij/dependency-cruiser
 */
module.exports = {
  forbidden: [
    {
      name: 'no-phaser-in-domain',
      severity: 'error',
      comment: 'domain/** must be engine-agnostic. Phaser belongs in runtime/.',
      from: { path: '^src/domain' },
      to: { path: '(^|/)phaser($|/)' },
    },
    {
      name: 'no-phaser-in-content',
      severity: 'error',
      comment: 'content/** must be pure data + schemas. Move engine code to runtime/.',
      from: { path: '^src/content' },
      to: { path: '(^|/)phaser($|/)' },
    },
    {
      name: 'no-phaser-in-shared',
      severity: 'error',
      comment: 'shared/** must not depend on the engine.',
      from: { path: '^src/shared' },
      to: { path: '(^|/)phaser($|/)' },
    },
    {
      name: 'no-phaser-in-features',
      severity: 'error',
      comment:
        'features/** orchestrate domain + runtime but must not import phaser directly. Go through runtime ports.',
      from: { path: '^src/features' },
      to: { path: '(^|/)phaser($|/)' },
    },
    {
      name: 'domain-cannot-import-runtime',
      severity: 'error',
      comment: 'Domain is the pure core. It must not know about runtime or features.',
      from: { path: '^src/domain' },
      to: { path: '^src/(runtime|features|app|content)' },
    },
    {
      name: 'content-cannot-import-runtime',
      severity: 'error',
      from: { path: '^src/content' },
      to: { path: '^src/(runtime|features|app|domain)' },
    },
    {
      name: 'shared-is-leaf',
      severity: 'error',
      comment: 'shared/** can only depend on itself.',
      from: { path: '^src/shared' },
      to: { path: '^src/(domain|runtime|features|app|content)' },
    },
    {
      name: 'runtime-cannot-import-app',
      severity: 'error',
      comment:
        'Runtime may implement feature-declared contracts, but must never depend on the app composition root.',
      from: { path: '^src/runtime' },
      to: { path: '^src/app' },
    },
    {
      name: 'features-cannot-import-app',
      severity: 'error',
      from: { path: '^src/features' },
      to: { path: '^src/app' },
    },
    {
      name: 'features-cannot-import-runtime',
      severity: 'error',
      comment:
        'Features orchestrate domain + ports. Runtime implements those ports. Do not import runtime from features.',
      from: { path: '^src/features' },
      to: { path: '^src/runtime' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular deps are architectural smell. Refactor.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'Orphaned module (no one imports it). Delete or wire up.',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$',
          '\\.d\\.ts$',
          '(^|/)tsconfig\\.json$',
          '(^|/)(package|package-lock)\\.json$',
          '^src/main\\.ts$',
          '^src/app/entrypoints/',
          '^src/shared/.*/index\\.ts$',
          '^src/shared/constants/',
          '^scripts/',
          '^tests/',
        ],
      },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
      mainFields: ['module', 'main', 'types', 'typings'],
    },
    reporterOptions: {
      text: { highlightFocused: true },
    },
  },
};
