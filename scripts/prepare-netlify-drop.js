const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const fontSource = path.join(
  rootDir,
  'node_modules',
  '@expo',
  'vector-icons',
  'build',
  'vendor',
  'react-native-vector-icons',
  'Fonts',
  'Ionicons.ttf',
);
const expoFontUrlPattern =
  /\/assets\/node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/Ionicons\.[a-f0-9]+\.ttf/g;

function walkFiles(dir, matches = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, matches);
    } else if (/\.(html|js)$/.test(entry.name)) {
      matches.push(fullPath);
    }
  }
  return matches;
}

if (!fs.existsSync(distDir)) {
  throw new Error('dist directory not found. Run expo export first.');
}

const fontBytes = fs.readFileSync(fontSource);
const fontHash = crypto.createHash('sha256').update(fontBytes).digest('hex').slice(0, 8);
const fontTargetName = `Ionicons.${fontHash}.ttf`;
const fontTargetUrl = `/assets/fonts/${fontTargetName}`;
const fontTargetPath = path.join(distDir, 'assets', 'fonts', fontTargetName);

fs.mkdirSync(path.dirname(fontTargetPath), { recursive: true });
fs.writeFileSync(fontTargetPath, fontBytes);

let patchedFiles = 0;
for (const file of walkFiles(distDir)) {
  const current = fs.readFileSync(file, 'utf8');
  const next = current.replace(expoFontUrlPattern, fontTargetUrl);
  if (next !== current) {
    fs.writeFileSync(file, next);
    patchedFiles += 1;
  }
}

console.log(`Prepared Netlify drop: copied ${fontTargetName} and patched ${patchedFiles} files.`);
