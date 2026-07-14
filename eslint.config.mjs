import next from 'eslint-config-next/core-web-vitals';

/**
 * Flat ESLint config for Next.js 16 + ESLint 9.
 * `next lint` was removed in Next 16, so we run ESLint directly (`eslint .`).
 * `eslint-config-next/core-web-vitals` is already a flat-config array in v16.
 */
const config = [
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'node_modules/**', '.vercel/**'],
  },
  ...next,
];

export default config;
