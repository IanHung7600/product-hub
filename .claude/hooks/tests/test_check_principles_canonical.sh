#!/bin/bash
# Tests for check_principles_canonical.sh

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOK="$SCRIPT_DIR/../check_principles_canonical.sh"
[ -x "$HOOK" ] || { echo "FATAL: hook not executable"; exit 1; }

PASS=0; FAIL=0; FAILED=""

setup_proj() {
  TMP_PROJ=$(mktemp -d)
  mkdir -p "$TMP_PROJ/.claude/hooks"
  echo 'log_hook_fire() { :; }' > "$TMP_PROJ/.claude/hooks/_log-fire.sh"
}
teardown_proj() { rm -rf "$TMP_PROJ"; }

run_hook() {
  local content="$1"
  local file_path="$2"
  local payload
  payload=$(jq -n \
    --arg fp "$file_path" \
    --arg ct "$content" \
    '{tool_name:"Write", tool_input:{file_path:$fp, content:$ct}}')
  STDOUT=$(echo "$payload" | bash "$HOOK" 2>&1)
  EXIT=$?
}

# ── Test 1: non-principles file → silent pass ───────────────────────────────
echo "Test 1: showcase stories file → silent skip"
setup_proj
run_hook "export const Default = {};" "$TMP_PROJ/foo.stories.tsx"
if [ "$EXIT" = "0" ] && [ -z "$STDOUT" ]; then
  echo "  PASS  Test 1"; PASS=$((PASS+1))
else
  echo "  FAIL  Test 1 (exit=$EXIT, output=${STDOUT:0:100})"
  FAIL=$((FAIL+1)); FAILED="${FAILED}\n  - Test 1"
fi
teardown_proj

# ── Test 2: new principles file with 2 universal core → pass ────────────────
echo "Test 2: new file with WhenToUse + WhenNotToUse → pass"
setup_proj
run_hook "export const WhenToUse = {};
export const WhenNotToUse = {};
export const VsTabsRule = {};" "$TMP_PROJ/foo.principles.stories.tsx"
if [ "$EXIT" = "0" ] && [ -z "$STDOUT" ]; then
  echo "  PASS  Test 2"; PASS=$((PASS+1))
else
  echo "  FAIL  Test 2 (exit=$EXIT, output=${STDOUT:0:200})"
  FAIL=$((FAIL+1)); FAILED="${FAILED}\n  - Test 2"
fi
teardown_proj

# ── Test 3: new file with only 1 core → block P0 ────────────────────────────
echo "Test 3: new file with only WhenToUse → block P0"
setup_proj
run_hook "export const WhenToUse = {};
export const RandomRule = {};" "$TMP_PROJ/foo.principles.stories.tsx"
if [ "$EXIT" = "2" ] && echo "$STDOUT" | grep -q "Universal core ≥ 2"; then
  echo "  PASS  Test 3 universal core blocked"; PASS=$((PASS+1))
else
  echo "  FAIL  Test 3 (exit=$EXIT, output=${STDOUT:0:200})"
  FAIL=$((FAIL+1)); FAILED="${FAILED}\n  - Test 3"
fi
teardown_proj

# ── Test 4: new file with deprecated naming → block P0 ──────────────────────
echo "Test 4: new file with ForbiddenRule → block P0(rename to WhenNotToUse)"
setup_proj
run_hook "export const WhenToUse = {};
export const ForbiddenRule = {};" "$TMP_PROJ/foo.principles.stories.tsx"
if [ "$EXIT" = "2" ] && echo "$STDOUT" | grep -q "Forbidden"; then
  echo "  PASS  Test 4 deprecated naming blocked"; PASS=$((PASS+1))
else
  echo "  FAIL  Test 4 (exit=$EXIT, output=${STDOUT:0:200})"
  FAIL=$((FAIL+1)); FAILED="${FAILED}\n  - Test 4"
fi
teardown_proj

# ── Test 5: existing file with deprecated → P1 warn(non-block)──────────────
echo "Test 5: edit existing file with ForbiddenRule → warn only"
setup_proj
echo 'export const VsTabsRule = {}; export const ForbiddenRule = {};' > "$TMP_PROJ/foo.principles.stories.tsx"
run_hook "export const NewRule = {};" "$TMP_PROJ/foo.principles.stories.tsx"
if [ "$EXIT" = "0" ] && echo "$STDOUT" | grep -q "warn"; then
  echo "  PASS  Test 5 existing deprecated warns"; PASS=$((PASS+1))
else
  echo "  FAIL  Test 5 (exit=$EXIT, output=${STDOUT:0:200})"
  FAIL=$((FAIL+1)); FAILED="${FAILED}\n  - Test 5"
fi
teardown_proj

# ── Test 6: legacy alias UsageScenarioRule counts as WhenToUse ──────────────
echo "Test 6: UsageScenarioRule + WhenNotToUse → pass(legacy alias)"
setup_proj
run_hook "export const UsageScenarioRule = {};
export const WhenNotToUse = {};" "$TMP_PROJ/foo.principles.stories.tsx"
if [ "$EXIT" = "0" ] && [ -z "$STDOUT" ]; then
  echo "  PASS  Test 6 legacy alias accepted"; PASS=$((PASS+1))
else
  echo "  FAIL  Test 6 (exit=$EXIT, output=${STDOUT:0:200})"
  FAIL=$((FAIL+1)); FAILED="${FAILED}\n  - Test 6"
fi
teardown_proj

# ── Test 7: rationale escape ────────────────────────────────────────────────
echo "Test 7: @principles-rationale escape → pass"
setup_proj
run_hook "// @principles-rationale: experimental
export const RandomRule = {};" "$TMP_PROJ/foo.principles.stories.tsx"
if [ "$EXIT" = "0" ] && [ -z "$STDOUT" ]; then
  echo "  PASS  Test 7 rationale escape"; PASS=$((PASS+1))
else
  echo "  FAIL  Test 7 (exit=$EXIT, output=${STDOUT:0:200})"
  FAIL=$((FAIL+1)); FAILED="${FAILED}\n  - Test 7"
fi
teardown_proj

# ── Summary ─────────────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════"
echo "  Results: $PASS PASS, $FAIL FAIL"
echo "════════════════════════════════════════"
if [ "$FAIL" -gt 0 ]; then
  printf "Failed:%b\n" "$FAILED"; exit 1
fi
exit 0
