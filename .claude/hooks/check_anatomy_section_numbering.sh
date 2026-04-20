#!/bin/bash
# PostToolUse hook: when editing a *.anatomy.stories.tsx file, verify section
# numbering is contiguous starting from 1 (matches `name: 'N. ...'` to export order).
#
# Why: anatomy stories repeatedly drift — exports get deleted/reordered but the
# `name` prefixes don't resequence, leaving broken TOCs like "1 → 6 → 7 → 3"
# that users see in Storybook sidebar. This is purely mechanical — ordering
# should match export order. No AI judgment needed.
#
# Trigger: PostToolUse on Edit/Write/MultiEdit where file_path ends in
# `.anatomy.stories.tsx`.

set -euo pipefail

FILE_PATH="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

# Only process anatomy stories
case "$FILE_PATH" in
  *.anatomy.stories.tsx) ;;
  *) exit 0 ;;
esac

# File may have been deleted; be defensive
[ -f "$FILE_PATH" ] || exit 0

# Extract numbered section prefixes in file-order. We look for lines like:
#   name: '6. 在 Button loading 狀態內',
# and pull the leading number.
NUMS=$(grep -oE "name:[[:space:]]*'[0-9]+\." "$FILE_PATH" | grep -oE "[0-9]+" | tr '\n' ' ')

# If no numbered sections, skip (some anatomy files use unnumbered names)
if [ -z "${NUMS// }" ]; then
  exit 0
fi

# Check sequence: should be 1, 2, 3, ..., N
EXPECTED=1
BROKEN=0
BROKEN_DETAIL=""
for N in $NUMS; do
  if [ "$N" != "$EXPECTED" ]; then
    BROKEN=1
    BROKEN_DETAIL="${BROKEN_DETAIL} position ${EXPECTED}:got ${N}"
  fi
  EXPECTED=$((EXPECTED+1))
done

if [ "$BROKEN" = "1" ]; then
  cat <<EOF
⚠️  Anatomy story numbering drift — $FILE_PATH

Expected contiguous 1..N in file order, got: $NUMS

Issues:$BROKEN_DETAIL

Fix: renumber the \`name: 'N. ...'\` prefixes to match the actual export order
of \`export const\`s. Storybook sidebar follows export order; mismatched
prefixes show as broken TOC to users (e.g. 1 → 6 → 7 → 3).

This is a mechanical fix — no design judgment needed.
EOF
fi

exit 0
