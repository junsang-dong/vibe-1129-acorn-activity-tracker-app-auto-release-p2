#!/usr/bin/env node

/**
 * Build script for Acorn Activity Tracker
 * Creates a dist/ directory with optimized files
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = 'dist';
const FILES_TO_COPY = [
  'index.html',
  'manifest.json',
  'sw.js',
  'css/',
  'js/',
  'assets/'
];

console.log('🔨 Building Acorn Activity Tracker...\n');

// Clean build directory
if (fs.existsSync(BUILD_DIR)) {
  fs.rmSync(BUILD_DIR, { recursive: true });
  console.log('✓ Cleaned build directory');
}

// Create build directory
fs.mkdirSync(BUILD_DIR);
console.log('✓ Created build directory');

// Copy files
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    for (const file of files) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

for (const file of FILES_TO_COPY) {
  const srcPath = path.join(process.cwd(), file);
  const destPath = path.join(process.cwd(), BUILD_DIR, file);
  
  if (fs.existsSync(srcPath)) {
    copyRecursive(srcPath, destPath);
    console.log(`✓ Copied ${file}`);
  } else {
    console.warn(`⚠ Skipped ${file} (not found)`);
  }
}

// Inject version into HTML
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const indexPath = path.join(BUILD_DIR, 'index.html');

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace(
    '</head>',
    `  <meta name="version" content="${packageJson.version}">\n  </head>`
  );
  fs.writeFileSync(indexPath, html);
  console.log(`✓ Injected version ${packageJson.version} into HTML`);
}

console.log('\n✅ Build completed successfully!');
console.log(`📦 Output: ${BUILD_DIR}/`);

