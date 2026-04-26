#!/usr/bin/env node
// Upgrade auto-generated WhenToUse stories: replace CamelCase splits with
// human-friendly description sourced from showcase story `name:` zh-CN field
// + LinkTo from @storybook/addon-links for actual cross-page navigation.
//
// Idempotent: skips files where WhenToUse already uses LinkTo (already upgraded).

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const COMPONENTS_DIR = 'src/design-system/components';

function findFile(dir, suffix, exclude) {
  const files = readdirSync(dir);
  return files.find(f => f.endsWith(suffix) && !exclude.some(e => f.includes(e)));
}

// Extract showcase scenario exports + their `name:` zh-CN labels
function getShowcaseScenarios(showcasePath) {
  if (!showcasePath) return [];
  const content = readFileSync(showcasePath, 'utf-8');
  // Match: export const X: Story = { ... name: '中文名稱' ... }
  // Or: export const X = { ... name: '...' ... }
  const exportBlocks = content.split(/(?=^export const [A-Z])/m);
  const scenarios = [];
  for (const block of exportBlocks) {
    const exportMatch = block.match(/^export const ([A-Z]\w+)/);
    if (!exportMatch) continue;
    const name = exportMatch[1];
    if (['Default', 'AllVariants', 'AllSizes', 'States', 'Disabled', 'Loading', 'WithIcon', 'WithBadge', 'IconOnly', 'FullWidth', 'Pressed', 'OpenSnapshot', 'AllStates'].includes(name)) continue;
    const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
    const label = nameMatch ? nameMatch[1] : name.replace(/([A-Z])/g, ' $1').trim();
    scenarios.push({ name, label });
  }
  return scenarios.slice(0, 5);
}

function findShowcaseFile(dir) {
  return findFile(dir, '.stories.tsx', ['anatomy', 'principles']);
}

function findPrinciplesFile(dir) {
  return findFile(dir, '.principles.stories.tsx', []);
}

// Storybook title format: 'Design System/Components/{Name}/展示'
function titleFor(componentName, internal = false) {
  return `Design System/${internal ? 'Internal' : 'Components'}/${componentName}/展示`;
}

function generateUpgradedWhenToUse(componentName, scenarios, isInternal) {
  const showcaseTitle = titleFor(componentName, isInternal);
  const items = scenarios.map(s => {
    return `        <li>
          <LinkTo kind="${showcaseTitle}" name="${s.label}" className="text-primary hover:underline font-medium">
            {'${s.label}'}
          </LinkTo>
        </li>`;
  }).join('\n');

  if (scenarios.length === 0) {
    return null;
  }

  return `// ── WhenToUse — 何時使用 ${componentName} ──────────────────────

export const WhenToUse: Story = {
  name: '何時使用',
  render: () => (
    <div className="prose prose-sm max-w-prose">
      <p>適合 ${componentName} 的真實業務場景(點擊跳轉「展示」頁範例):</p>
      <ul className="space-y-1">
${items}
      </ul>
      <p className="text-fg-muted mt-3">判斷不確定時:對照 spec.md「何時用 / 何時不用」段;若仍不符,改用近親元件(見 <code>Vs*Rule</code> stories)。</p>
    </div>
  ),
}
`;
}

const dirs = readdirSync(COMPONENTS_DIR).filter(d => statSync(join(COMPONENTS_DIR, d)).isDirectory());
const results = { upgraded: [], skipped: [], error: [] };

for (const name of dirs) {
  const dir = join(COMPONENTS_DIR, name);
  try {
    const principlesFile = findPrinciplesFile(dir);
    if (!principlesFile) { results.skipped.push({ name, reason: 'no principles' }); continue; }

    const principlesPath = join(dir, principlesFile);
    let content = readFileSync(principlesPath, 'utf-8');

    // Skip if already has LinkTo (already upgraded)
    if (content.includes('@storybook/addon-links')) {
      results.skipped.push({ name, reason: 'already upgraded' });
      continue;
    }

    // Skip if no auto-generated WhenToUse(detect by signature: 「對照「展示」頁」or「適用情境」)
    const autoGenSignature = /export const WhenToUse:\s*Story\s*=\s*\{[\s\S]*?(?:適用情境|對照「展示」)/;
    if (!autoGenSignature.test(content)) {
      results.skipped.push({ name, reason: 'no auto-generated WhenToUse to upgrade' });
      continue;
    }

    const showcaseFile = findShowcaseFile(dir);
    const showcasePath = showcaseFile ? join(dir, showcaseFile) : null;
    const scenarios = showcasePath ? getShowcaseScenarios(showcasePath) : [];

    // Detect Internal vs Components from existing principles title
    const isInternal = /title:\s*['"]Design System\/Internal\//.test(content);

    const newWhenToUse = generateUpgradedWhenToUse(name, scenarios, isInternal);
    if (!newWhenToUse) {
      results.skipped.push({ name, reason: 'no scenarios to derive content' });
      continue;
    }

    // Replace existing auto-gen WhenToUse with upgraded version
    // Pattern: from `// ── WhenToUse` or `export const WhenToUse` to next `export const` or end
    const replacePattern = /(?:\/\/\s*──\s*WhenToUse[^\n]*\n+)?export const WhenToUse:\s*Story\s*=\s*\{[\s\S]*?\n\}\n/;
    if (!replacePattern.test(content)) {
      results.skipped.push({ name, reason: 'WhenToUse pattern not matched' });
      continue;
    }

    content = content.replace(replacePattern, newWhenToUse);

    // Add LinkTo import if missing
    if (!content.includes("from '@storybook/addon-links'")) {
      // Insert after first import statement
      content = content.replace(
        /(import[^\n]+\n)/,
        "$1import LinkTo from '@storybook/addon-links/react'\n"
      );
    }

    writeFileSync(principlesPath, content);
    results.upgraded.push({ name, scenarios: scenarios.map(s => s.label) });
  } catch (e) {
    results.error.push({ name, reason: e.message });
  }
}

console.log('=== WhenToUse content upgrade ===\n');
console.log(`Upgraded: ${results.upgraded.length}`);
results.upgraded.forEach(r => console.log(`  ✓ ${r.name}: [${r.scenarios.join(', ')}]`));
console.log(`\nSkipped: ${results.skipped.length}`);
results.skipped.forEach(r => console.log(`  - ${r.name}: ${r.reason}`));
if (results.error.length) {
  console.log(`\nErrors: ${results.error.length}`);
  results.error.forEach(r => console.log(`  ✗ ${r.name}: ${r.reason}`));
}
