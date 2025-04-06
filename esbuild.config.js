import { build } from 'esbuild';

build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  platform: 'node',
  target: ['node20'],
  outfile: 'dist/index.js',
  format: 'cjs',
  sourcemap: false,
  minify: true,
}).catch(() => process.exit(1));
