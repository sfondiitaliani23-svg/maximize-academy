import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) results = results.concat(walk(full));
    else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.html')) results.push(full);
  });
  return results;
}

const files = walk(path.join(root, 'src')).concat([
  path.join(root, 'index.html'),
  path.join(root, 'public', 'privacy.html'),
  path.join(root, 'public', '404.html')
]);

const imgRegex = /src=["'](\/(assets|img|loghi)[^"']+\.(png|jpg|jpeg|svg|webp))["']/g;
const missing = [];
const found = new Set();

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const relativePath = match[1];
    const assetPath = path.join(root, 'public', relativePath);
    if (!fs.existsSync(assetPath)) {
      missing.push({ file: path.relative(root, f), asset: relativePath });
    } else {
      found.add(relativePath);
    }
  }
});

console.log('✅ Asset verificati con successo:', found.size);
found.forEach(a => console.log('   ✓', a));

if (missing.length > 0) {
  console.log('❌ ASSET MANCANTI:', missing);
  process.exit(1);
} else {
  console.log('🎉 Tutti gli asset referenziati nel codice esistono fisicamente su disco!');
}
