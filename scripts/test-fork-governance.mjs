#!/usr/bin/env node
// test-fork-governance.mjs — 假 fork 測試 harness(C-prime 缺點3「假生效」的機械保證)
//
// 合成一個 Scenario-B fork(apps/** 產品 code + node_modules/@qijenchen/design-system/src specs+tokens,
// NO packages/design-system),把生成的 fork-mode hook 逐個對「違規 / 乾淨」樣本跑,斷言:
//   - 該 enforce 的 hook:違規樣本要有反應(exit 2 BLOCKER 或 stderr 提示),乾淨樣本要放行
//   - 絕不「對違規也靜默 exit 0 無輸出」= false-green(這正是 opacity registry 漂移那類陷阱)
//   - REPLACE 的 fork-quality hook:對任何 apps/** 都不得 exit 2(不得 brick)
//   - 全部 hook 不得 crash(exit 127 / syntax error)
//
// 用法:node scripts/test-fork-governance.mjs   (CI / preflight 跑;非 0 = fail)

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, copyFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { execSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FORK_HOOKS = join(ROOT, 'packages/design-system/ds-canonical/fork/hooks')
const FIX = '/tmp/ds-fork-fixture'

// ── 合成 fork 佈局 ──
function buildFixture() {
  if (existsSync(FIX)) rmSync(FIX, { recursive: true, force: true })
  mkdirSync(join(FIX, 'apps/demo/src'), { recursive: true })
  const dsSpecDir = join(FIX, 'node_modules/@qijenchen/design-system/src')
  mkdirSync(join(dsSpecDir, 'tokens'), { recursive: true })
  mkdirSync(join(dsSpecDir, 'components/CircularProgress'), { recursive: true })
  // 帶上真實 token registry(opacity hook SHIP_REWRITTEN 後讀這個路徑)
  const realReg = join(ROOT, 'packages/design-system/src/tokens/utility-registry.json')
  if (existsSync(realReg)) copyFileSync(realReg, join(dsSpecDir, 'tokens/utility-registry.json'))
  writeFileSync(join(dsSpecDir, 'components/CircularProgress/circular-progress.spec.md'), '# CircularProgress\nsize 預設 24\n')
  writeFileSync(join(FIX, 'apps/demo/src/App.tsx'), 'export const App = () => <div>x</div>\n')
}

// run a hook with a synthetic tool_input; returns {exit, stderr}
// spawnSync 同時拿 status + stderr + stdout(不管 exit code)→ 避免「exit 0 但有 stderr 警告」被漏判 false-green。
function runHook(hookFile, toolName, filePath, content) {
  const payload = JSON.stringify({ tool_name: toolName, tool_input: { file_path: filePath, content, new_string: content } })
  const r = spawnSync('bash', [join(FORK_HOOKS, hookFile)], {
    input: payload, encoding: 'utf8', cwd: FIX, env: { ...process.env, CLAUDE_PROJECT_DIR: FIX },
  })
  if (r.error) return { exit: 127, stderr: String(r.error.message || r.error) }
  return { exit: r.status == null ? 127 : r.status, stderr: (r.stderr || '') + (r.stdout || '') }
}

// ── 高風險 enforce 案例:violation 必有反應 / clean 必放行 ──
// 每個 fork-relevant 品質 hook 一組(違規 + 乾淨)。
const A = 'apps/demo/src/App.tsx'
const CASES = [
  { hook: 'check_consumer_app_invariants.sh', tool: 'Write', enforce: true,
    violation: 'export const X=()=><table><thead><th>a</th></thead></table>',
    clean: 'import {DataTable} from "@qijenchen/design-system"\nexport const X=()=><DataTable columns={c} data={d}/>' },
  { hook: 'check_layout_space_magic_numbers.sh', tool: 'Write', enforce: true,
    violation: 'export const X=()=><div className="gap-13 mt-7">x</div>',
    clean: 'export const X=()=><div className="gap-[var(--layout-space-tight)]">x</div>' },
  { hook: 'check_opacity_token_usage.sh', tool: 'Write', enforce: true,
    violation: 'export const X=()=><div className="bg-[#ff0000] text-[14px] shadow-md">x</div>',
    clean: 'export const X=()=><div className="bg-surface text-body">x</div>' },
  { hook: 'check_fork_product_quality.sh', tool: 'Write', enforce: false, neverBrick: true,
    violation: 'export const X=()=><table><thead><th>a</th></thead></table>',
    clean: 'export const X=()=><div>ok</div>' },
]

buildFixture()
let fail = 0
const results = []

// 1) 高風險案例:enforce 行為
for (const c of CASES) {
  const v = runHook(c.hook, c.tool, A, c.violation)
  const cl = runHook(c.hook, c.tool, A, c.clean)
  let verdict = 'ok'
  if (c.neverBrick) {
    // 不得 exit 2(brick);違規時可有提示(stderr)但不得擋
    if (v.exit === 2 || cl.exit === 2) { verdict = `❌ BRICK: exit 2 on apps/** (v=${v.exit} c=${cl.exit})`; fail++ }
    else verdict = `✅ never-brick (v.exit=${v.exit} c.exit=${cl.exit})`
  } else if (c.enforce) {
    const reacted = v.exit === 2 || v.stderr.trim().length > 0
    const passedClean = cl.exit === 0 && cl.stderr.trim().length === 0
    if (!reacted) { verdict = `❌ FALSE-GREEN: 違規樣本靜默放行(exit=${v.exit}, 無 stderr)`; fail++ }
    else if (!passedClean) { verdict = `⚠️ clean 樣本未乾淨放行(exit=${cl.exit}) — 檢查` ; /* not hard fail */ }
    else verdict = `✅ enforce (violation→exit ${v.exit}/stderr / clean→pass)`
  }
  results.push(`  ${c.hook}: ${verdict}`)
}

// 2) 全 15 hook crash 檢查(語法 + 不得 127)
const allHooks = readdirSync(FORK_HOOKS).filter((f) => f.endsWith('.sh') || f.endsWith('.py'))
const crashed = []
for (const h of allHooks) {
  if (h.endsWith('.sh')) {
    try { execSync(`bash -n '${join(FORK_HOOKS, h)}'`, { stdio: 'pipe' }) }
    catch (e) { crashed.push(`${h}: syntax error`); fail++ }
  }
  // 跑一次 generic apps edit,不得 127
  const r = runHook(h, 'Write', A, 'export const X=()=><div>x</div>')
  if (r.exit === 127) { crashed.push(`${h}: exit 127 (missing dep/file)`); fail++ }
}

console.log('=== 假 fork 測試 harness 結果 ===')
console.log(`fixture: ${FIX}(apps/** + node_modules/@qijenchen/design-system/src,NO packages/design-system)`)
console.log(results.join('\n'))
console.log(`\ncrash 檢查(${allHooks.length} hook):${crashed.length ? '\n  ' + crashed.join('\n  ') : '✅ 無 syntax error / 無 exit-127'}`)
console.log(`\n${fail === 0 ? '✅ FORK-GOVERNANCE HARNESS PASS — 無 false-green / 無 brick / 無 crash' : `❌ ${fail} 項 fail(見上）`}`)
process.exit(fail === 0 ? 0 : 1)
