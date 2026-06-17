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
import { refreshLaunchers } from './refresh-fork-launchers.mjs'

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

// 3) committed 模板治理流程(#6 codex C3:測 dispatcher/bootstrap/injection,不只 fork hook 本體)
// 合成「完整 fork」:committed template .claude/hooks + npm fork corpus,跑 3 個 committed 啟動器。
const TPL_HOOKS = join(ROOT, 'template/ds-product-template/.claude/hooks')
const FULL = '/tmp/ds-fork-full'
const flowResults = []
function buildFullFixture() {
  if (existsSync(FULL)) rmSync(FULL, { recursive: true, force: true })
  mkdirSync(join(FULL, 'apps/demo/src'), { recursive: true })
  mkdirSync(join(FULL, '.claude/hooks'), { recursive: true })
  const npmFork = join(FULL, 'node_modules/@qijenchen/design-system/ds-canonical/fork')
  mkdirSync(npmFork, { recursive: true })
  // committed 啟動器
  for (const h of readdirSync(TPL_HOOKS).filter((f) => f.endsWith('.sh'))) copyFileSync(join(TPL_HOOKS, h), join(FULL, '.claude/hooks', h))
  // npm fork corpus(hooks + manifest + preamble)
  execSync(`cp -R '${join(ROOT, 'packages/design-system/ds-canonical/fork')}/.' '${npmFork}/'`)
  writeFileSync(join(FULL, 'apps/demo/src/App.tsx'), 'export const App = () => <div>x</div>\n')
}
function runTpl(hookFile, payload) {
  const r = spawnSync('bash', [join(FULL, '.claude/hooks', hookFile)], { input: payload, encoding: 'utf8', cwd: FULL, env: { ...process.env, CLAUDE_PROJECT_DIR: FULL } })
  return { exit: r.status == null ? 127 : r.status, out: (r.stdout || ''), err: (r.stderr || '') }
}
buildFullFixture()
// injection:preamble 在 → 輸出 valid additionalContext 含設計紀律
{
  const r = runTpl('inject_fork_governance_preamble.sh', '{"hook_event_name":"SessionStart"}')
  let ok = false
  try { const j = JSON.parse(r.out); ok = (j.hookSpecificOutput.additionalContext || '').includes('item-anatomy') } catch (e) { ok = false }
  if (!ok) { flowResults.push('  inject_preamble: ❌ 未輸出含 item-anatomy 的 valid additionalContext'); fail++ }
  else flowResults.push('  inject_preamble: ✅ 注入 valid additionalContext(含設計紀律)')
}
// dispatcher:PostToolUse 違規(手刻 table)→ 轉發 exit 2
{
  const v = runTpl('fork-governance-dispatcher.sh', JSON.stringify({ hook_event_name: 'PostToolUse', tool_name: 'Write', tool_input: { file_path: 'apps/demo/src/App.tsx', new_string: 'export const X=()=><table><thead><th>a</th></thead></table>' } }))
  if (v.exit !== 2) { flowResults.push(`  dispatcher(PostToolUse 違規): ❌ 未轉發攔截(exit=${v.exit})`); fail++ }
  else flowResults.push('  dispatcher(PostToolUse 違規): ✅ 轉發 exit 2')
}
// dispatcher:manifest 缺 → 不 brick(exit 0)
{
  rmSync(join(FULL, 'node_modules/@qijenchen/design-system/ds-canonical/fork/manifest.json'), { force: true })
  const v = runTpl('fork-governance-dispatcher.sh', JSON.stringify({ hook_event_name: 'PostToolUse', tool_name: 'Write', tool_input: { file_path: 'apps/demo/src/App.tsx', new_string: 'x' } }))
  if (v.exit !== 0) { flowResults.push(`  dispatcher(manifest 缺): ❌ brick(exit=${v.exit},應 0)`); fail++ }
  else flowResults.push('  dispatcher(manifest 缺): ✅ exit 0 不 brick')
  const b = runTpl('check_governance_bootstrap.sh', '{"hook_event_name":"SessionStart"}')
  if (b.exit !== 0) { flowResults.push(`  bootstrap(本體缺): ❌ exit ${b.exit}(應 0 fail-open)`); fail++ }
  else flowResults.push('  bootstrap(本體缺): ✅ exit 0 fail-open(notice 不 brick)')
}

// 4) sync-all 接線骨架刷新(refresh-fork-launchers:idempotent + 不 clobber user hook + opt-out)
// 既有 fork 的「接線層完全同步」命脈。模擬既有 fork(有 user 自有 hook + 舊 launcher 註冊)+ npm-current launchers。
const skelResults = []
const SKEL = '/tmp/ds-fork-skel'
function buildSkelFixture(withOptOut) {
  if (existsSync(SKEL)) rmSync(SKEL, { recursive: true, force: true })
  mkdirSync(join(SKEL, '.claude/hooks'), { recursive: true })
  if (withOptOut) { mkdirSync(join(SKEL, '.github'), { recursive: true }); writeFileSync(join(SKEL, '.github/no-governance-sync'), '') }
  const npmLaunchers = join(SKEL, 'node_modules/@qijenchen/design-system/ds-canonical/fork/launchers')
  mkdirSync(npmLaunchers, { recursive: true })
  execSync(`cp -R '${join(ROOT, 'packages/design-system/ds-canonical/fork/launchers')}/.' '${npmLaunchers}/'`)
  // 既有 fork settings:user 自有「非治理」hook + 一個「舊版 launcher 註冊」(模擬 pre-update,測去重)
  writeFileSync(join(SKEL, '.claude/settings.json'), JSON.stringify({
    defaultMode: 'auto',
    hooks: {
      SessionStart: [{ hooks: [{ type: 'command', command: 'bash my-own-hook.sh' }, { type: 'command', command: 'bash "$CLAUDE_PROJECT_DIR/.claude/hooks/check_governance_bootstrap.sh"' }] }],
      // PostToolUse:user 自有 lint + 一個「含啟動器名為子字串但不是啟動器」的 hook(adversarial FINDING 2b 不得誤刪)
      PostToolUse: [{ matcher: 'Edit', hooks: [{ type: 'command', command: 'bash user-lint.sh' }, { type: 'command', command: 'bash ".claude/hooks/my-fork-governance-dispatcher.sh.bak"' }] }],
    },
  }, null, 2))
}
// 4a 正常刷新
buildSkelFixture(false)
const r1 = refreshLaunchers(SKEL)
{
  const launchersCopied = r1.copied?.length === 3 && existsSync(join(SKEL, '.claude/hooks/fork-governance-dispatcher.sh'))
  const s = JSON.parse(readFileSync(join(SKEL, '.claude/settings.json'), 'utf8'))
  const cmds = JSON.stringify(s.hooks)
  const hasAllLaunchers = ['check_governance_bootstrap.sh', 'fork-governance-dispatcher.sh', 'inject_fork_governance_preamble.sh'].every((l) => cmds.includes(l))
  const events4 = ['SessionStart', 'PreToolUse', 'PostToolUse', 'UserPromptSubmit'].every((ev) => s.hooks[ev])
  const userHookKept = cmds.includes('my-own-hook.sh') && cmds.includes('user-lint.sh')
  const substringHookKept = cmds.includes('my-fork-governance-dispatcher.sh.bak') // FINDING 2b:子字串碰撞不得誤刪
  const noDupBootstrap = (cmds.match(/check_governance_bootstrap\.sh/g) || []).length === 1
  const permUnioned = (s.permissions?.allow || []).length >= 5
  if (!launchersCopied) { skelResults.push('  refresh: ❌ 啟動器未全 copy(應 3 個)'); fail++ }
  else if (!hasAllLaunchers || !events4) { skelResults.push('  refresh: ❌ settings 缺啟動器註冊 / 缺 4-event'); fail++ }
  else if (!userHookKept) { skelResults.push('  refresh: ❌ clobber 了 user 自有非治理 hook'); fail++ }
  else if (!substringHookKept) { skelResults.push('  refresh: ❌ 子字串碰撞 hook 被誤刪(FINDING 2b 回歸)'); fail++ }
  else if (!noDupBootstrap) { skelResults.push('  refresh: ❌ 舊 launcher 註冊沒去重(重複)'); fail++ }
  else if (!permUnioned) { skelResults.push('  refresh: ❌ permissions.allow 未 union'); fail++ }
  else skelResults.push('  refresh: ✅ 啟動器 copy(3)+ 4-event 註冊 + user hook 保留 + 子字串不誤刪 + 去重 + perm union')
}
// 4b idempotent
{
  const before = readFileSync(join(SKEL, '.claude/settings.json'), 'utf8')
  refreshLaunchers(SKEL)
  const after = readFileSync(join(SKEL, '.claude/settings.json'), 'utf8')
  if (before !== after) { skelResults.push('  idempotent: ❌ 第二次刷新改了 settings(非冪等 → 重跑會疊加)'); fail++ }
  else skelResults.push('  idempotent: ✅ 重跑 settings 完全一致')
}
// 4c opt-out
{
  buildSkelFixture(true)
  const r = refreshLaunchers(SKEL)
  if (!r.skipped) { skelResults.push('  opt-out: ❌ 有 .github/no-governance-sync 仍刷新(應 skip)'); fail++ }
  else skelResults.push(`  opt-out: ✅ skip(${r.skipped})`)
}

console.log('=== 假 fork 測試 harness 結果 ===')
console.log(`fixture: ${FIX}(apps/** + node_modules/@qijenchen/design-system/src,NO packages/design-system)`)
console.log(results.join('\n'))
console.log('\n=== committed 模板治理流程(dispatcher/bootstrap/injection)===')
console.log(flowResults.join('\n'))
console.log('\n=== 接線骨架刷新(sync-all refresh-fork-launchers:idempotent / 不 clobber / opt-out)===')
console.log(skelResults.join('\n'))
console.log(`\ncrash 檢查(${allHooks.length} hook):${crashed.length ? '\n  ' + crashed.join('\n  ') : '✅ 無 syntax error / 無 exit-127'}`)
console.log(`\n${fail === 0 ? '✅ FORK-GOVERNANCE HARNESS PASS — 無 false-green / 無 brick / 無 crash' : `❌ ${fail} 項 fail(見上）`}`)
process.exit(fail === 0 ? 0 : 1)
