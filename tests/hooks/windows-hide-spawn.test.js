/**
 * Regression guard: every child process launched from the hook runtime must
 * pass `windowsHide: true`.
 *
 * On Windows, a hook that spawns node.exe, git, npx or PowerShell without
 * windowsHide can open a visible console window (e.g. an empty Windows
 * Terminal tab titled "C:\Program Files\nodejs\node.exe") on every tool call.
 * The option is a no-op on macOS/Linux, so it is always safe to pass.
 *
 * This test statically scans the hook scripts (and the lib helpers they call)
 * for child_process calls and fails if any call site omits windowsHide.
 *
 * Run with: node tests/hooks/windows-hide-spawn.test.js
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..', '..');
const hooksDir = path.join(repoRoot, 'scripts', 'hooks');

// scripts/lib helpers that hook scripts call and that spawn processes.
const HOOK_LIB_FILES = [
  path.join(repoRoot, 'scripts', 'lib', 'utils.js'),
  path.join(repoRoot, 'scripts', 'lib', 'observer-sessions.js'),
];

const CHILD_PROCESS_FNS = ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync'];

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (err) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

/**
 * Names this file imports from child_process, e.g.
 * `const { spawnSync, execFileSync } = require('child_process');`
 */
function importedChildProcessNames(src) {
  const names = new Set();
  const re = /\{([^}]*)\}\s*=\s*require\(\s*['"](?:node:)?child_process['"]\s*\)/g;
  let m;
  while ((m = re.exec(src))) {
    for (const part of m[1].split(',')) {
      const [orig, alias] = part.split(':').map(s => s.trim());
      const name = alias || orig;
      if (name && CHILD_PROCESS_FNS.includes(orig)) names.add(name);
    }
  }
  return names;
}

/**
 * Return the source text from `start` (an opening paren) to its matching
 * closing paren, skipping over string and template literals.
 */
function sliceBalancedCall(src, start) {
  let depth = 0;
  let quote = null;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === '\\') { i++; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '\'' || ch === '"' || ch === '`') { quote = ch; continue; }
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return src.slice(start);
}

/**
 * True when the call passes windowsHide inline, or passes an options variable
 * whose declaration in the same file sets windowsHide.
 */
function callHidesWindow(src, callText) {
  if (/\bwindowsHide\s*:\s*true\b/.test(callText)) return true;
  const identifiers = callText.match(/[A-Za-z_$][\w$]*/g) || [];
  return identifiers.some(id => {
    const decl = new RegExp(`(?:const|let)\\s+${id}\\s*=\\s*\\{[^;]*\\bwindowsHide\\s*:\\s*true\\b`);
    return decl.test(src);
  });
}

function findUnhiddenCalls(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const names = importedChildProcessNames(src);
  const problems = [];
  if (names.size === 0) return problems;

  const lines = src.split('\n');
  const callRe = new RegExp(`(^|[^.\\w$])(${[...names].join('|')})\\s*\\(`, 'g');
  let m;
  while ((m = callRe.exec(src))) {
    const nameStart = m.index + m[1].length;
    const lineNo = src.slice(0, nameStart).split('\n').length;
    const lineText = lines[lineNo - 1].trim();
    if (lineText.startsWith('//') || lineText.startsWith('*')) continue;
    // Skip local function declarations that shadow an imported name.
    if (/function\s+$/.test(src.slice(Math.max(0, nameStart - 20), nameStart))) continue;

    const parenStart = src.indexOf('(', nameStart);
    const callText = sliceBalancedCall(src, parenStart);
    if (!callHidesWindow(src, callText)) {
      problems.push(`${path.relative(repoRoot, filePath)}:${lineNo}  ${lineText}`);
    }
  }
  return problems;
}

function hookRuntimeFiles() {
  const hookFiles = fs.readdirSync(hooksDir)
    .filter(f => f.endsWith('.js'))
    .map(f => path.join(hooksDir, f));
  return [...hookFiles, ...HOOK_LIB_FILES];
}

function runTests() {
  console.log('\n=== Testing windowsHide on hook child processes ===\n');

  let passed = 0;
  let failed = 0;

  if (test('scanner flags a spawn without windowsHide', () => {
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'ecc-winhide-'));
    const fixture = path.join(tmp, 'fixture.js');
    try {
      fs.writeFileSync(fixture, [
        "const { spawnSync } = require('child_process');",
        "spawnSync(process.execPath, ['x.js'], { timeout: 1000 });",
        "spawnSync(process.execPath, ['y.js'], { timeout: 1000, windowsHide: true });",
        '',
      ].join('\n'));
      const problems = findUnhiddenCalls(fixture);
      assert.strictEqual(problems.length, 1, `expected 1 problem, got: ${problems.join('; ')}`);
      assert.ok(problems[0].includes(':2'), `expected line 2 to be flagged, got: ${problems[0]}`);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  })) passed++; else failed++;

  if (test('scanner accepts an options variable that sets windowsHide', () => {
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'ecc-winhide-'));
    const fixture = path.join(tmp, 'fixture.js');
    try {
      fs.writeFileSync(fixture, [
        "const { execFileSync } = require('child_process');",
        "const opts = { encoding: 'utf8', windowsHide: true };",
        "execFileSync('npx', ['tsc'], opts);",
        '',
      ].join('\n'));
      assert.deepStrictEqual(findUnhiddenCalls(fixture), []);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  })) passed++; else failed++;

  if (test('run-with-flags legacy node spawn hides its window', () => {
    const problems = findUnhiddenCalls(path.join(hooksDir, 'run-with-flags.js'));
    assert.deepStrictEqual(problems, []);
  })) passed++; else failed++;

  if (test('session-start-bootstrap node spawn hides its window', () => {
    const problems = findUnhiddenCalls(path.join(hooksDir, 'session-start-bootstrap.js'));
    assert.deepStrictEqual(problems, []);
  })) passed++; else failed++;

  if (test('every child_process call in the hook runtime passes windowsHide', () => {
    const problems = hookRuntimeFiles().flatMap(findUnhiddenCalls);
    assert.deepStrictEqual(
      problems,
      [],
      `Add \`windowsHide: true\` to these spawn options:\n      ${problems.join('\n      ')}`
    );
  })) passed++; else failed++;

  console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
