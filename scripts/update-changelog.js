#!/usr/bin/env node

/**
 * Update CHANGELOG.md with new version entry
 */

const fs = require('fs');
const { execSync } = require('child_process');

const VERSION = process.env.VERSION || require('../package.json').version;
const DEPLOY_URL = process.env.DEPLOY_URL || 'https://acorn-activity-tracker.vercel.app';
const PH_POST_URL = process.env.PH_POST_URL || '';

console.log('📝 Updating CHANGELOG...\n');

// Get git commit messages since last tag
let commits = [];
try {
  const gitLog = execSync('git log --pretty=format:"%s" $(git describe --tags --abbrev=0 @^)..@', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore']
  }).trim();
  
  if (gitLog) {
    commits = gitLog.split('\n').filter(c => c.trim());
  }
} catch (err) {
  // If no previous tags, get all commits
  try {
    const gitLog = execSync('git log --pretty=format:"%s"', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
    
    if (gitLog) {
      commits = gitLog.split('\n').filter(c => c.trim()).slice(0, 10); // Last 10 commits
    }
  } catch (err2) {
    console.warn('⚠️  Could not retrieve git log');
  }
}

// Categorize commits
const categories = {
  features: [],
  fixes: [],
  chores: [],
  docs: [],
  other: []
};

for (const commit of commits) {
  const lower = commit.toLowerCase();
  if (lower.startsWith('feat:') || lower.includes('feature:')) {
    categories.features.push(commit.replace(/^feat(ure)?:\s*/i, ''));
  } else if (lower.startsWith('fix:') || lower.includes('fixed:')) {
    categories.fixes.push(commit.replace(/^fix(ed)?:\s*/i, ''));
  } else if (lower.startsWith('chore:')) {
    categories.chores.push(commit.replace(/^chore:\s*/i, ''));
  } else if (lower.startsWith('docs:') || lower.includes('documentation')) {
    categories.docs.push(commit.replace(/^docs:\s*/i, ''));
  } else {
    categories.other.push(commit);
  }
}

// Generate changelog entry
const date = new Date().toISOString().split('T')[0];
let entry = `\n## [${VERSION}] - ${date}\n\n`;

if (DEPLOY_URL) {
  entry += `🚀 **Deployment:** ${DEPLOY_URL}\n\n`;
}

if (PH_POST_URL && PH_POST_URL !== 'N/A') {
  entry += `📢 **Product Hunt:** ${PH_POST_URL}\n\n`;
}

if (categories.features.length > 0) {
  entry += '### ✨ Features\n\n';
  for (const feat of categories.features) {
    entry += `- ${feat}\n`;
  }
  entry += '\n';
}

if (categories.fixes.length > 0) {
  entry += '### 🐛 Bug Fixes\n\n';
  for (const fix of categories.fixes) {
    entry += `- ${fix}\n`;
  }
  entry += '\n';
}

if (categories.docs.length > 0) {
  entry += '### 📚 Documentation\n\n';
  for (const doc of categories.docs) {
    entry += `- ${doc}\n`;
  }
  entry += '\n';
}

if (categories.chores.length > 0) {
  entry += '### 🔧 Maintenance\n\n';
  for (const chore of categories.chores) {
    entry += `- ${chore}\n`;
  }
  entry += '\n';
}

if (categories.other.length > 0 && categories.other.length <= 5) {
  entry += '### Other Changes\n\n';
  for (const other of categories.other) {
    entry += `- ${other}\n`;
  }
  entry += '\n';
}

// Read existing CHANGELOG
let changelog = '';
if (fs.existsSync('CHANGELOG.md')) {
  changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
} else {
  changelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;
}

// Check if this version already exists
if (changelog.includes(`## [${VERSION}]`)) {
  console.log(`⚠️  Version ${VERSION} already exists in CHANGELOG`);
  console.log('Skipping update...');
  process.exit(0);
}

// Insert new entry after header
const lines = changelog.split('\n');
let insertIndex = 0;

// Find the end of the header (after first empty line following title)
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('## [')) {
    insertIndex = i;
    break;
  }
}

if (insertIndex === 0) {
  // No previous entries, add after header
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '' && i > 2) {
      insertIndex = i + 1;
      break;
    }
  }
}

// Insert new entry
lines.splice(insertIndex, 0, entry.trim());
const newChangelog = lines.join('\n');

// Write updated CHANGELOG
fs.writeFileSync('CHANGELOG.md', newChangelog);

console.log(`✅ Updated CHANGELOG.md for version ${VERSION}`);
console.log('\nNew entry:');
console.log(entry);

// Also update README badge
if (fs.existsSync('README.md')) {
  let readme = fs.readFileSync('README.md', 'utf8');
  
  // Update version badge
  readme = readme.replace(
    /!\[Version\]\(https:\/\/img\.shields\.io\/badge\/version-[^)]+\)/g,
    `![Version](https://img.shields.io/badge/version-${VERSION}-blue)`
  );
  
  // Add badge if it doesn't exist
  if (!readme.includes('![Version]')) {
    const lines = readme.split('\n');
    let titleIndex = lines.findIndex(line => line.startsWith('# '));
    if (titleIndex >= 0) {
      lines.splice(titleIndex + 1, 0, '', `![Version](https://img.shields.io/badge/version-${VERSION}-blue)`);
      readme = lines.join('\n');
    }
  }
  
  fs.writeFileSync('README.md', readme);
  console.log('✅ Updated version badge in README.md');
}

