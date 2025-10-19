#!/usr/bin/env node

/**
 * Test script for Acorn Activity Tracker
 * Runs basic validation checks
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Running tests...\n');

let exitCode = 0;

// Test 1: Check required files exist
console.log('Test 1: Checking required files...');
const requiredFiles = [
  'index.html',
  'manifest.json',
  'sw.js',
  'css/styles.css',
  'package.json'
];

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${file} exists`);
  } else {
    console.error(`  ✗ ${file} is missing`);
    exitCode = 1;
  }
}

// Test 2: Validate package.json
console.log('\nTest 2: Validating package.json...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (pkg.name) {
    console.log(`  ✓ Name: ${pkg.name}`);
  } else {
    console.error('  ✗ Missing name field');
    exitCode = 1;
  }
  
  if (pkg.version && /^\d+\.\d+\.\d+$/.test(pkg.version)) {
    console.log(`  ✓ Version: ${pkg.version}`);
  } else {
    console.error('  ✗ Invalid version format');
    exitCode = 1;
  }
  
  if (pkg.description) {
    console.log(`  ✓ Description exists`);
  }
} catch (err) {
  console.error('  ✗ Failed to parse package.json:', err.message);
  exitCode = 1;
}

// Test 3: Validate manifest.json
console.log('\nTest 3: Validating manifest.json...');
try {
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  
  if (manifest.name) {
    console.log(`  ✓ Name: ${manifest.name}`);
  } else {
    console.error('  ✗ Missing name field');
    exitCode = 1;
  }
  
  if (manifest.start_url) {
    console.log(`  ✓ Start URL: ${manifest.start_url}`);
  } else {
    console.error('  ✗ Missing start_url');
    exitCode = 1;
  }
  
  if (manifest.icons && Array.isArray(manifest.icons)) {
    console.log(`  ✓ Icons defined (${manifest.icons.length})`);
  } else {
    console.warn('  ⚠ No icons defined');
  }
} catch (err) {
  console.error('  ✗ Failed to parse manifest.json:', err.message);
  exitCode = 1;
}

// Test 4: Validate HTML structure
console.log('\nTest 4: Validating HTML...');
try {
  const html = fs.readFileSync('index.html', 'utf8');
  
  if (html.includes('<!DOCTYPE html>')) {
    console.log('  ✓ DOCTYPE declared');
  } else {
    console.error('  ✗ Missing DOCTYPE');
    exitCode = 1;
  }
  
  if (html.includes('<html') && html.includes('lang=')) {
    console.log('  ✓ Language attribute present');
  } else {
    console.warn('  ⚠ Missing or incomplete html tag with lang attribute');
  }
  
  if (html.includes('<meta charset=') || html.includes('<meta charset ')) {
    console.log('  ✓ Charset meta tag present');
  } else {
    console.error('  ✗ Missing charset meta tag');
    exitCode = 1;
  }
  
  if (html.includes('viewport')) {
    console.log('  ✓ Viewport meta tag present');
  } else {
    console.warn('  ⚠ Missing viewport meta tag');
  }
} catch (err) {
  console.error('  ✗ Failed to read index.html:', err.message);
  exitCode = 1;
}

// Test 5: Check Service Worker syntax
console.log('\nTest 5: Checking Service Worker...');
try {
  const sw = fs.readFileSync('sw.js', 'utf8');
  
  if (sw.includes('install') && sw.includes('fetch')) {
    console.log('  ✓ Service Worker has install and fetch handlers');
  } else {
    console.warn('  ⚠ Service Worker may be incomplete');
  }
  
  if (sw.includes('CACHE_NAME')) {
    console.log('  ✓ Cache name defined');
  } else {
    console.warn('  ⚠ Cache name not found');
  }
} catch (err) {
  console.error('  ✗ Failed to read sw.js:', err.message);
  exitCode = 1;
}

// Summary
console.log('\n' + '='.repeat(50));
if (exitCode === 0) {
  console.log('✅ All tests passed!');
} else {
  console.error('❌ Some tests failed!');
}
console.log('='.repeat(50) + '\n');

process.exit(exitCode);

