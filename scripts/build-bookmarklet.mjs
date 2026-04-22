// scripts/build-bookmarklet.mjs
import { buildSync } from 'esbuild';
import { writeFileSync, mkdirSync } from 'fs';

mkdirSync('public', { recursive: true });

const result = buildSync({
  entryPoints: ['scripts/bookmarklet-src/widget.js'],
  bundle: true,
  minify: true,
  write: false,
  format: 'iife',
  target: 'es2020',
});

const minified = result.outputFiles[0].text.trim().replace(/\n/g, '');
writeFileSync('public/bookmarklet.js', result.outputFiles[0].text);

const uri = `javascript:${encodeURIComponent(`(function(){${minified}})();`)}`;
writeFileSync('public/bookmarklet-uri.txt', uri);

console.log('✅ Bookmarklet built');
console.log(`   public/bookmarklet.js       (${result.outputFiles[0].text.length} bytes readable)`);
console.log(`   public/bookmarklet-uri.txt  (${uri.length} bytes URI)`);
