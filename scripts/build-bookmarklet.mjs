// scripts/build-bookmarklet.mjs
import { buildSync } from 'esbuild';
import { writeFileSync, mkdirSync } from 'fs';

mkdirSync('public', { recursive: true });

// Readable copy
const readable = buildSync({
  entryPoints: ['scripts/bookmarklet-src/widget.js'],
  bundle: true,
  minify: false,
  write: false,
  format: 'esm',
  target: 'es2020',
});

// Minified for URI
const minified = buildSync({
  entryPoints: ['scripts/bookmarklet-src/widget.js'],
  bundle: true,
  minify: true,
  write: false,
  format: 'esm',
  target: 'es2020',
});

if (!readable.outputFiles?.length || !minified.outputFiles?.length) {
  console.error('esbuild produced no output');
  process.exit(1);
}

writeFileSync('public/bookmarklet.js', readable.outputFiles[0].text);

const minifiedText = minified.outputFiles[0].text.trim().replace(/\n/g, '');
const uri = `javascript:${encodeURIComponent(minifiedText)}`;
writeFileSync('public/bookmarklet-uri.txt', uri);

console.log('✅ Bookmarklet built');
console.log(`   public/bookmarklet.js       (${readable.outputFiles[0].text.length} bytes readable)`);
console.log(`   public/bookmarklet-uri.txt  (${uri.length} bytes URI)`);
