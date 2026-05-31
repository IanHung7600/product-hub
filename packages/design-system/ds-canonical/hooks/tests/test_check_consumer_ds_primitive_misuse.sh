#!/bin/bash
# Tests for check_consumer_ds_primitive_misuse.sh(P0 BLOCKER,2026-05-27 user verbatim
# 「做產品真的要能使用跟 ds repo 一模一樣的元件」)
#
# Hook 契約(PreToolUse,tool=Edit|Write|MultiEdit):
#   - Scope:tool_input.file_path 必匹配 `/(apps|consumer)/.*\.(tsx|ts)$`
#            (Claude Code 永遠傳 absolute path → leading slash 前綴 apps/consumer)
#            排除 `packages/design-system/src/` + `node_modules/`
#   - Content:tool_input.new_string // tool_input.content
#   - Global escape:content 含 `@ds-misuse-allow:` → silent exit 0
#   - 6 anti-patterns(P1-P5 任何 .tsx/.ts;P6 僅 .stories.tsx):
#       P1 <DS.CircularProgress size={N}> literal number override default 24
#       P2 <DS.RadioGroupItem> 沒 wrap SelectionItem 且無 label=
#       P3 <DS.DataTable columns={[single-col]}> minimal one-column
#       P4 <DS.LinkInput placeholder=...> 沒 value/defaultValue
#       P5 <DS.Empty title=...> 無 icon 且無 description
#       P6 (.stories.tsx only) overlay trigger 無 defaultOpen
#   - BLOCKER:exit 2 + stderr 含 "CONSUMER-DS-PRIMITIVE-MISUSE BLOCKER"
#   - 非觸發 tool / out-of-scope path / 空 content → silent exit 0
#
# Broad-vs-narrow symmetry(M34):每 pattern 同時測 fire(over-narrow guard)
# + near-miss(over-broad guard,canonical 用法不可誤攔)。

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOK="$SCRIPT_DIR/../check_consumer_ds_primitive_misuse.sh"

if [ ! -x "$HOOK" ]; then
  echo "FATAL: hook not executable: $HOOK"
  exit 1
fi

PASS=0
FAIL=0
FAILED_TESTS=""

# Override CLAUDE_PROJECT_DIR so _log-fire.sh 寫進 TMP_DIR,不污染 repo .claude/logs/
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT
export CLAUDE_PROJECT_DIR="$TMP_DIR"
mkdir -p "$TMP_DIR/.claude/logs"

# 真實契約:Claude Code 傳 absolute path。Consumer app prod tsx / story tsx 各一條 base。
PROD_TSX="/Users/x/proj/apps/web/src/App.tsx"
STORY_TSX="/Users/x/proj/apps/web/src/Demo.stories.tsx"

run_hook() {
  local file_path="$1"; local content="$2"; local tool="${3:-Write}"
  local payload
  if [ "$tool" = "Edit" ]; then
    # Edit 走 new_string field
    payload=$(jq -n --arg fp "$file_path" --arg c "$content" --arg t "$tool" \
      '{tool_name:$t, tool_input:{file_path:$fp, new_string:$c}}')
  else
    payload=$(jq -n --arg fp "$file_path" --arg c "$content" --arg t "$tool" \
      '{tool_name:$t, tool_input:{file_path:$fp, content:$c}}')
  fi
  STDOUT=$(mktemp); STDERR=$(mktemp)
  set +e
  printf '%s' "$payload" | bash "$HOOK" >"$STDOUT" 2>"$STDERR"
  EXIT=$?
  set -e
  STDERR_TEXT=$(cat "$STDERR" 2>/dev/null)
  rm -f "$STDOUT" "$STDERR"
}

expect_block() {
  local name="$1"; local needle="${2:-CONSUMER-DS-PRIMITIVE-MISUSE BLOCKER}"
  if [ "$EXIT" = "2" ] && echo "$STDERR_TEXT" | grep -qF "$needle"; then
    echo "  PASS  $name"; PASS=$((PASS+1))
  else
    echo "  FAIL  $name (expected BLOCK exit=2 + '$needle', got exit=$EXIT)"
    echo "  --- stderr ---"; echo "$STDERR_TEXT" | sed 's/^/    /'; echo "  --- end ---"
    FAIL=$((FAIL+1)); FAILED_TESTS="${FAILED_TESTS}\n  - $name"
  fi
}

expect_silent() {
  local name="$1"
  if [ "$EXIT" = "0" ] && [ -z "$STDERR_TEXT" ]; then
    echo "  PASS  $name"; PASS=$((PASS+1))
  else
    echo "  FAIL  $name (expected silent exit=0, got exit=$EXIT, stderr=$([ -n "$STDERR_TEXT" ] && echo non-empty || echo empty))"
    echo "  --- stderr ---"; echo "$STDERR_TEXT" | sed 's/^/    /'; echo "  --- end ---"
    FAIL=$((FAIL+1)); FAILED_TESTS="${FAILED_TESTS}\n  - $name"
  fi
}

echo "=== check_consumer_ds_primitive_misuse tests ==="

# ── Scope / event gating(NEGATIVE: should NOT fire)──────────────────────────

# 1. 非觸發 tool(Read)→ silent
payload_read=$(jq -n --arg fp "$PROD_TSX" '{tool_name:"Read", tool_input:{file_path:$fp}}')
STDOUT=$(mktemp); STDERR=$(mktemp)
set +e
printf '%s' "$payload_read" | bash "$HOOK" >"$STDOUT" 2>"$STDERR"
EXIT=$?
set -e
STDERR_TEXT=$(cat "$STDERR" 2>/dev/null); rm -f "$STDOUT" "$STDERR"
expect_silent "1. tool=Read → skip"

# 2. Out-of-scope path(DS internal src)→ silent,即使含 anti-pattern
run_hook "/Users/x/proj/packages/design-system/src/Foo.tsx" '<DS.Empty title="無資料" />'
expect_silent "2. packages/design-system/src/ → skip (DS internal)"

# 3. Out-of-scope path(node_modules)→ silent
run_hook "/Users/x/proj/node_modules/@qijenchen/design-system/apps/Foo.tsx" '<DS.Empty title="x" />'
expect_silent "3. node_modules/ → skip"

# 4. Non-consumer path(repo src/ 無 apps|consumer 前綴)→ silent
run_hook "/Users/x/proj/src/lib/util.tsx" '<DS.Empty title="x" />'
expect_silent "4. 非 apps/consumer path → skip"

# 5. 空 content → silent
run_hook "$PROD_TSX" ""
expect_silent "5. empty content → skip"

# 6. Clean innocuous consumer tsx → silent
run_hook "$PROD_TSX" 'export const Card = () => <div className="p-4"><h2>Hello</h2></div>'
expect_silent "6. clean innocuous consumer tsx → silent"

# ── Global escape(NEGATIVE)───────────────────────────────────────────────────

# 7. @ds-misuse-allow escape 即使含 anti-pattern → silent
run_hook "$PROD_TSX" '// @ds-misuse-allow: legacy migration WIP
<DS.Empty title="無資料" />'
expect_silent "7. @ds-misuse-allow escape → silent"

# ── P1 CircularProgress(broad-vs-narrow symmetry)─────────────────────────────

# 8. POSITIVE over-narrow guard:literal size={24} → BLOCK
run_hook "$PROD_TSX" 'export const L = () => <DS.CircularProgress size={24} />'
expect_block "8. P1 <CircularProgress size={24}> → BLOCK"

# 9. NEGATIVE over-broad guard:string variant size="lg" 非 literal number → silent
run_hook "$PROD_TSX" 'export const L = () => <DS.CircularProgress size="lg" />'
expect_silent "9. P1 nearmiss <CircularProgress size=\"lg\"> → silent"

# ── P2 RadioGroupItem(broad-vs-narrow symmetry)───────────────────────────────

# 10. POSITIVE:RadioGroupItem 裸用,無 SelectionItem 無 label → BLOCK
run_hook "$PROD_TSX" 'export const R = () => <DS.RadioGroupItem value="a" />'
expect_block "10. P2 bare <RadioGroupItem> → BLOCK"

# 11. NEGATIVE:RadioGroupItem wrap 進 SelectionItem(canonical)→ silent
run_hook "$PROD_TSX" 'export const R = () => <DS.SelectionItem control={<DS.RadioGroupItem value="a" />} label="選項 A" />'
expect_silent "11. P2 nearmiss <SelectionItem control={<RadioGroupItem>}> → silent"

# ── P4 LinkInput(broad-vs-narrow symmetry)────────────────────────────────────

# 12. POSITIVE:LinkInput placeholder-only(無 value)→ BLOCK
run_hook "$PROD_TSX" 'export const L = () => <DS.LinkInput placeholder="https://example.com" />'
expect_block "12. P4 <LinkInput placeholder-only> → BLOCK"

# 13. NEGATIVE:LinkInput 有 value prop(canonical link/edit pattern)→ silent
run_hook "$PROD_TSX" 'export const L = () => <DS.LinkInput placeholder="https://example.com" value={url} onChange={setUrl} />'
expect_silent "13. P4 nearmiss <LinkInput value={url}> → silent"

# ── P5 Empty(broad-vs-narrow symmetry)────────────────────────────────────────

# 14. POSITIVE:Empty title 無 icon 無 description → BLOCK
run_hook "$PROD_TSX" 'export const E = () => <DS.Empty title="尚無檔案" />'
expect_block "14. P5 <Empty title-only> → BLOCK"

# 15. NEGATIVE:Empty title + description(canonical「預設只需 description」)→ silent
run_hook "$PROD_TSX" 'export const E = () => <DS.Empty title="尚無檔案" description="點右上角上傳第一份文件" />'
expect_silent "15. P5 nearmiss <Empty title+description> → silent"

# 16. NEGATIVE:Empty title + icon(也滿足 canonical)→ silent
run_hook "$PROD_TSX" 'export const E = () => <DS.Empty title="尚無檔案" icon={<DS.FileIcon />} />'
expect_silent "16. P5 nearmiss <Empty title+icon> → silent"

# ── P6 overlay(.stories.tsx scope-gated;prod tsx 不攔)────────────────────────

# 17. POSITIVE:story 用 Dialog overlay 無 defaultOpen → BLOCK
run_hook "$STORY_TSX" 'export const S = () => <DS.Dialog><DS.DialogContent>內容</DS.DialogContent></DS.Dialog>'
expect_block "17. P6 story <Dialog> 無 defaultOpen → BLOCK"

# 18. NEGATIVE over-broad guard:同 overlay 在 prod .tsx(非 story)→ silent
run_hook "$PROD_TSX" 'export const S = () => <DS.Dialog><DS.DialogContent>內容</DS.DialogContent></DS.Dialog>'
expect_silent "18. P6 prod .tsx <Dialog>(非 story scope)→ silent"

# 19. NEGATIVE:story Dialog 有 defaultOpen(canonical visual-snapshot 用法)→ silent
run_hook "$STORY_TSX" 'export const S = () => <DS.Dialog defaultOpen><DS.DialogContent>內容</DS.DialogContent></DS.Dialog>'
expect_silent "19. P6 nearmiss story <Dialog defaultOpen> → silent"

# ── Edit field-path 契約(new_string 而非 content)────────────────────────────

# 20. POSITIVE:Edit tool 走 tool_input.new_string,anti-pattern → BLOCK
run_hook "$PROD_TSX" 'export const L = () => <DS.CircularProgress size={48} />' "Edit"
expect_block "20. Edit(new_string)<CircularProgress size={48}> → BLOCK"

echo ""
echo "=== Summary ==="
echo "Passed: $PASS / $((PASS + FAIL))"
if [ "$FAIL" -gt 0 ]; then
  printf "Failed:%b\n" "$FAILED_TESTS"
  exit 1
fi
exit 0
