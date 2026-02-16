import { readdir, mkdir, cp } from 'fs/promises';
import { join } from 'path';

const distDir = './dist';

async function build() {
  console.log('🔨 Building Snowden AI extension...');

  await mkdir(distDir, { recursive: true });

  await Bun.build({
    entrypoints: ['./src/content/index.js'],
    outdir: distDir,
    format: 'iife',
    minify: false,
    target: 'browser',
    naming: '[dir]/content.js'
  });

  await Bun.build({
    entrypoints: ['./src/background/service-worker.js'],
    outdir: distDir,
    format: 'iife',
    minify: false,
    target: 'browser',
    naming: '[dir]/service-worker.js'
  });

  await cp('./public', distDir, { recursive: true });

  console.log('✅ Build complete! Load dist/ as unpacked extension.');
}

build().catch(console.error);
