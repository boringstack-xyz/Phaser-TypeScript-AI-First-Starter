import js from '@eslint/js';
import boundariesPlugin from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import-x';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const ARCH_ELEMENTS = [
  { type: 'domain', pattern: 'src/domain/**' },
  { type: 'content', pattern: 'src/content/**' },
  { type: 'shared', pattern: 'src/shared/**' },
  { type: 'runtime', pattern: 'src/runtime/**' },
  { type: 'features', pattern: 'src/features/**' },
  { type: 'app', pattern: 'src/app/**' },
];

/** @param {string} type */
const element = (type) => ({ element: { type } });
/** @param {string[]} types */
const allowTo = (...types) => types.map((type) => ({ to: element(type) }));

const ARCH_POLICIES = [
  { from: element('domain'), allow: allowTo('domain', 'shared') },
  { from: element('content'), allow: allowTo('content', 'shared') },
  { from: element('shared'), allow: allowTo('shared') },
  {
    from: element('runtime'),
    allow: allowTo('runtime', 'domain', 'features', 'content', 'shared'),
  },
  { from: element('features'), allow: allowTo('features', 'domain', 'content', 'shared') },
  {
    from: element('app'),
    allow: allowTo('app', 'features', 'runtime', 'domain', 'content', 'shared'),
  },
];

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.husky/**',
      'public/**',
      'scripts/templates/**',
      '.dependency-cruiser.cjs',
      'docs/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js', '*.cjs', '*.mjs', '*.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      boundaries: boundariesPlugin,
      import: importPlugin,
    },
    settings: {
      'boundaries/elements': ARCH_ELEMENTS,
      'boundaries/include': ['src/**/*'],
      'boundaries/legacy-warnings': false,
      'import/resolver': {
        typescript: { project: ['./tsconfig.json', './tsconfig.node.json'] },
      },
    },
    rules: {
      'boundaries/dependencies': ['error', { default: 'disallow', policies: ARCH_POLICIES }],
      'boundaries/no-unknown-dependencies': 'error',
      'boundaries/no-unknown-files': 'off',

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['phaser', 'phaser/*'],
              message: 'Phaser is banned outside runtime/. Move code to src/runtime/phaser/**.',
            },
          ],
        },
      ],

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      'import/no-cycle': ['error', { maxDepth: 10 }],
      'import/no-default-export': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            { pattern: '@app/**', group: 'internal', position: 'before' },
            { pattern: '@domain/**', group: 'internal', position: 'before' },
            { pattern: '@features/**', group: 'internal', position: 'before' },
            { pattern: '@runtime/**', group: 'internal', position: 'before' },
            { pattern: '@content/**', group: 'internal', position: 'before' },
            { pattern: '@shared/**', group: 'internal', position: 'before' },
          ],
        },
      ],

      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'max-lines': ['warn', { max: 400, skipBlankLines: true, skipComments: true }],
      complexity: ['warn', 15],
    },
  },

  // Domain: pure. No Phaser, no wall-clock time, no random, no storage.
  // Math.floor/max/etc. are allowed; only Math.random is banned.
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'localStorage', message: 'Use ISaveGamePort instead of localStorage.' },
        { name: 'sessionStorage', message: 'Use a storage port instead of sessionStorage.' },
        { name: 'window', message: 'Domain code must not access window.' },
        { name: 'document', message: 'Domain code must not access document.' },
        { name: 'fetch', message: 'Domain code must not make network calls. Use a port.' },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message: 'Inject IRandomPort instead of Math.random().',
        },
        {
          object: 'Date',
          property: 'now',
          message: 'Inject ITimePort instead of Date.now().',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "NewExpression[callee.name='Date']",
          message: 'Inject ITimePort instead of constructing new Date() in domain code.',
        },
      ],
    },
  },

  // Runtime and app: allowed to import phaser.
  // Syntactic subset of the tsforge `phaser` pack. The full pack applies when
  // tsforge runs against this tree (detected from the `phaser` dependency).
  {
    files: ['src/runtime/**/*.ts', 'src/app/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: "AssignmentExpression[left.property.name='ignoreDestroy'][right.value=true]",
          message:
            'Do not set ignoreDestroy. Keep cross-scene objects in a game-lifetime service, or pool them. (tsforge/no-ignore-destroy)',
        },
        {
          selector:
            "CallExpression[callee.object.property.name='scene'][callee.property.name=/^(start|launch|stop|pause|resume|sleep|wake|switch|run|remove)$/][arguments.0.type='Literal']",
          message:
            'Pass a named scene-key constant, not a string literal. (tsforge/no-raw-scene-key-literal)',
        },
        {
          selector:
            "CallExpression[callee.object.name='window'][callee.property.name='addEventListener']",
          message:
            'Do not attach window listeners from a Scene; bind game-lifetime listeners in app bootstrap. (tsforge/no-unmanaged-global-listeners)',
        },
        {
          selector:
            'CallExpression[callee.name=/^(setInterval|setTimeout|requestAnimationFrame)$/]',
          message:
            'Do not use raw timers in Phaser runtime; scene.time is shutdown-owned. (tsforge/no-unmanaged-global-listeners)',
        },
      ],
    },
  },

  // Entrypoints and configs: allowed to default-export.
  {
    files: [
      'src/main.ts',
      'vite.config.ts',
      'vitest.config.ts',
      'playwright.config.ts',
      'eslint.config.js',
      'commitlint.config.js',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // Tests: relax a few rules.
  {
    files: ['**/*.test.ts', 'tests/**/*.ts'],
    rules: {
      'max-lines': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-restricted-globals': 'off',
      'no-restricted-properties': 'off',
      'no-restricted-syntax': 'off',
    },
  },

  // Generator scripts: allow console output.
  {
    files: ['scripts/**/*.ts'],
    rules: {
      'no-console': 'off',
      'boundaries/dependencies': 'off',
      'boundaries/no-unknown-dependencies': 'off',
    },
  },
);
