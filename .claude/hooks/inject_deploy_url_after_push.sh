#!/bin/bash
# inject_deploy_url_after_push.sh — UserPromptSubmit + PostToolUse: 偵測 git push 後自動 inject deploy URL
#
# Per user verbatim 2026-05-26:「完成部署之後都應該自動回吐部署的連結,每次必定自動回,不論是現在這個 session 還是其他的」
# Per user verbatim 2026-05-27:「不管在任何 repo,只要有部署東西到 netlify 上不管是否是 production 都應該要提供連結」
#
# Mechanism(2026-05-27 v2 expand scope per user complaint — DS GH Pages also auto-provide URL):
#   PostToolUse Bash:tool_input.command 含 `git push origin <branch>` → 偵測 → multi-target URL detection:
#     1. Netlify(scripts/deploy-url.mjs + .netlify/state.json)— PW + fork
#     2. Netlify dashboard-link(netlify.toml exists,no state.json)— PW with Netlify auto-build
#     3. GitHub Pages(.github/workflows/*.yml 含 pages action)— DS repo
#   → output URL list inject into AI context(下個 reply 必看到)
#
# 為何走 Hook(per CLAUDE.md governance 8-home L7 Hook 自動化):
#   - 不靠 AI 記得「每次推完都要 echo URL」(會忘記 — 本 session user 抓「你他媽到底做得怎樣」)
#   - 不靠 user 每次問「部署到哪?」(無聊重複)
#   - Hook 機械保證每 push 必觸發,跨 session / 跨 fork user 自動受惠
#
# Scope expanded(2026-05-27):
#   - Netlify CLI-linked (.netlify/state.json + scripts/deploy-url.mjs) → 直接 script 抓 URL
#   - Netlify dashboard-linked (netlify.toml + branch deploys) → 用 git remote 推導 site name
#   - GitHub Pages (.github/workflows/*.yml 含 pages.yml OR ci.yml deploy-pages) → 推導 GH Pages URL
#
# 對齊:.claude/skills/codex-collab/SKILL.md PostToolUse pattern + check_fork_user_plugin_install.sh detection pattern

source "$(dirname "$0")/_log-fire.sh" 2>/dev/null && log_hook_fire

set -uo pipefail
INPUT=$(cat 2>/dev/null || echo "{}")
EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // ""' 2>/dev/null)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // ""' 2>/dev/null)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // ""' 2>/dev/null)

# Scope:PostToolUse Bash 且 cmd 含 git push to remote(main / branch)
[ "$EVENT" != "PostToolUse" ] && exit 0
[ "$TOOL" != "Bash" ] && exit 0

# Heuristic:detect `git push origin <branch>` patterns
if ! echo "$CMD" | grep -qE '\bgit\s+push\s+(-u\s+)?origin\b'; then
  exit 0
fi

# Skip if push --delete (branch cleanup, not deploy)
if echo "$CMD" | grep -qE 'push\s+origin\s+--delete'; then
  exit 0
fi

CWD=$(pwd)
URLS_FOUND=""
BRANCH=$(echo "$CMD" | grep -oE 'origin\s+\S+' | awk '{print $2}' | head -1)
[ -z "$BRANCH" ] && BRANCH=$(git -C "$CWD" branch --show-current 2>/dev/null || echo "main")

# v3 2026-05-27:curl HEAD verify URL before reporting(per user「你確定有做到」complaint)
# 只把 200 OK 的 URL inject;404 → mark as "unverified" so AI 知道要 ask user
verify_url() {
  local url="$1"
  local code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 5 -I "$url" 2>/dev/null)
  case "$code" in
    200|301|302) echo "OK" ;;
    *) echo "FAIL:$code" ;;
  esac
}

# Detection 1:Netlify CLI-linked(.netlify/state.json + scripts/deploy-url.mjs)
DEPLOY_SCRIPT="$CWD/scripts/deploy-url.mjs"
if [ -f "$DEPLOY_SCRIPT" ] && [ -f "$CWD/.netlify/state.json" ]; then
  URL_INFO=$(node "$DEPLOY_SCRIPT" --json 2>/dev/null)
  if [ -n "$URL_INFO" ]; then
    URL=$(echo "$URL_INFO" | jq -r '.url // ""' 2>/dev/null)
    IS_PROD=$(echo "$URL_INFO" | jq -r '.isProd // false' 2>/dev/null)
    if [ -n "$URL" ]; then
      if [ "$IS_PROD" = "true" ]; then
        URLS_FOUND="${URLS_FOUND}🚀 Netlify PRODUCTION(${BRANCH}): ${URL}\n"
      else
        URLS_FOUND="${URLS_FOUND}🔍 Netlify PREVIEW(${BRANCH}): ${URL}\n"
      fi
    fi
  fi
fi

# Detection 2:Netlify dashboard-linked(netlify.toml + no state.json)
# Derive from git remote(repo name → Netlify auto-assigns subdomain)+ curl HEAD verify
if [ -z "$URLS_FOUND" ] && [ -f "$CWD/netlify.toml" ]; then
  REPO_NAME=$(git -C "$CWD" remote get-url origin 2>/dev/null | sed -E 's|.*/([^/.]+)(\.git)?$|\1|')
  if [ -n "$REPO_NAME" ]; then
    if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
      CANDIDATE="https://${REPO_NAME}.netlify.app"
      VERIFY=$(verify_url "$CANDIDATE")
      if [ "$VERIFY" = "OK" ]; then
        URLS_FOUND="${URLS_FOUND}🚀 Netlify PRODUCTION(${BRANCH}): ${CANDIDATE}  ✅ verified 200\n"
      else
        URLS_FOUND="${URLS_FOUND}🚀 Netlify PRODUCTION 推導 URL: ${CANDIDATE}  ⚠️ ${VERIFY}(可能 dashboard custom subdomain;請手動 share 給 AI)\n"
      fi
    else
      CANDIDATE="https://${BRANCH}--${REPO_NAME}.netlify.app"
      VERIFY=$(verify_url "$CANDIDATE")
      if [ "$VERIFY" = "OK" ]; then
        URLS_FOUND="${URLS_FOUND}🔍 Netlify PREVIEW(${BRANCH}): ${CANDIDATE}  ✅ verified 200\n"
      else
        URLS_FOUND="${URLS_FOUND}🔍 Netlify PREVIEW 推導 URL: ${CANDIDATE}  ⚠️ ${VERIFY}(branch preview 可能未啟 OR Netlify 用 hash-based naming;dashboard verify)\n"
      fi
    fi
  fi
fi

# Detection 3:GitHub Pages(.github/workflows/*.yml deploys to gh-pages OR uses actions/deploy-pages)
if ls "$CWD/.github/workflows/"*.yml >/dev/null 2>&1; then
  if grep -l "actions/deploy-pages\|gh-pages\|github.io" "$CWD/.github/workflows/"*.yml >/dev/null 2>&1; then
    GH_REMOTE=$(git -C "$CWD" remote get-url origin 2>/dev/null)
    OWNER_REPO=$(echo "$GH_REMOTE" | sed -E 's|.*github\.com[:/]([^/]+/[^/.]+)(\.git)?$|\1|')
    OWNER=$(echo "$OWNER_REPO" | cut -d/ -f1)
    REPO=$(echo "$OWNER_REPO" | cut -d/ -f2)
    if [ -n "$OWNER" ] && [ -n "$REPO" ] && { [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; }; then
      CANDIDATE="https://${OWNER}.github.io/${REPO}/"
      VERIFY=$(verify_url "$CANDIDATE")
      if [ "$VERIFY" = "OK" ]; then
        URLS_FOUND="${URLS_FOUND}📄 GitHub Pages(${BRANCH}): ${CANDIDATE}  ✅ verified 200\n"
      else
        URLS_FOUND="${URLS_FOUND}📄 GitHub Pages 推導 URL: ${CANDIDATE}  ⚠️ ${VERIFY}(build ~3-5 min;若仍 404 check Actions tab build status)\n"
      fi
    fi
  fi
fi

# No deploy target detected → silent skip
[ -z "$URLS_FOUND" ] && exit 0

# Inject into AI context
printf '%b' "Deploy URLs auto-detected(per user 2026-05-26 directive「完成部署之後都應該自動回吐連結」+ 2026-05-27「不管 repo 都要提供」):\n${URLS_FOUND}"

exit 0
