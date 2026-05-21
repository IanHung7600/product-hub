// Probe ALL scenarios user asked about + simulate proposed fix without committing.
import { chromium } from 'playwright'

const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 1440, height: 900 } })

const probeData = async (p, label) => p.evaluate(({ label }) => {
  const r = (el) => el ? {
    x: Math.round(el.getBoundingClientRect().x),
    w: Math.round(el.getBoundingClientRect().width),
    cx: Math.round(el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2),
  } : null
  const css = (el, ...props) => el ? Object.fromEntries(props.map(p => [p, window.getComputedStyle(el).getPropertyValue(p)])) : null

  // primary-sidebar mode: SidebarHeader render
  const sbHeader = document.querySelector('[data-sidebar="header"]')
  // primary-header mode: GlobalHeader leadingRail = first ChromeHeader of page
  const rails = document.querySelectorAll('header')
  const leadingRailContainer = Array.from(document.querySelectorAll('header > div')).find(d => {
    const w = d.getBoundingClientRect().width
    return w > 0 && w < 60 // sidebar-width-icon = 48
  })

  const trigger = document.querySelector('[data-sidebar="trigger"]')
  const triggerIcon = trigger?.querySelector('svg')

  // Avatar / logo in SidebarHeader
  const sbHeaderAvatar = sbHeader?.querySelector('[data-prefix-type], img, .rounded-md, [role="img"]')
  // Avatar in GlobalHeader's WorkspaceBrand (children area, not leadingRail)
  const globalHeaderInner = leadingRailContainer?.parentElement
  const globalHeaderMainArea = globalHeaderInner ? globalHeaderInner.children[1] : null
  const globalHeaderAvatar = globalHeaderMainArea?.querySelector('[data-prefix-type], img, .rounded-md, [role="img"]')

  // First sidebar menu button + its icon
  const menuBtn = document.querySelector('[data-sidebar="menu-button"]')
  const menuIcon = menuBtn?.querySelector('svg')

  return {
    label,
    sidebarState: document.querySelector('[data-state]')?.getAttribute('data-state'),
    sidebarCollapsible: document.querySelector('[data-state]')?.getAttribute('data-collapsible'),
    headerCount: rails.length,
    sbHeader: sbHeader ? { ...r(sbHeader), ...css(sbHeader, 'padding-left', 'padding-right', 'width', 'justify-content') } : null,
    sbHeaderAvatar: r(sbHeaderAvatar),
    leadingRailContainer: leadingRailContainer ? { ...r(leadingRailContainer), ...css(leadingRailContainer, 'width', 'justify-content', 'border-right-width') } : null,
    globalHeaderAvatar: r(globalHeaderAvatar),
    trigger: r(trigger),
    triggerIcon: r(triggerIcon),
    menuBtn: r(menuBtn),
    menuIcon: r(menuIcon),
  }
}, { label })

const inject = async (p, css) => p.addStyleTag({ content: css })

// ── Scenario A: primary-sidebar — current v9 behavior (committed) ─────────
const pA = await c.newPage()
await pA.goto('http://localhost:6006/iframe.html?id=design-system-components-appshell-展示--primary-sidebar&viewMode=story', { waitUntil: 'networkidle' })
await pA.waitForTimeout(1000)
const A_expanded = await probeData(pA, 'A: primary-sidebar EXPANDED (v9 current)')
await pA.locator('[data-sidebar="trigger"]').first().click({ force: true })
await pA.waitForTimeout(500)
const A_collapsed_v9 = await probeData(pA, 'A: primary-sidebar COLLAPSED (v9 current)')
await pA.screenshot({ path: 'snapshots/2026-05-21-session/scenario-A-collapsed-v9.png', clip: { x: 0, y: 0, width: 200, height: 400 } })

// Capture toggle animation snapshots (collapsed → expanded) at 60ms / 120ms / 200ms
await pA.locator('[data-sidebar="trigger"]').first().click({ force: true })
const t0 = await pA.evaluate(() => performance.now())
await pA.waitForTimeout(60)
const A_t60 = await probeData(pA, 'A: toggle expand t=60ms (v9 current — should fly-left-bug)')
await pA.waitForTimeout(60)
const A_t120 = await probeData(pA, 'A: toggle expand t=120ms')
await pA.waitForTimeout(80)
const A_t200 = await probeData(pA, 'A: toggle expand t=200ms')

// ── Scenario B: primary-header — global header leadingRail ──────────────
const pB = await c.newPage()
await pB.goto('http://localhost:6006/iframe.html?id=design-system-components-appshell-展示--primary-header&viewMode=story', { waitUntil: 'networkidle' })
await pB.waitForTimeout(1000)
const B_expanded = await probeData(pB, 'B: primary-header EXPANDED')
await pB.locator('[data-sidebar="trigger"]').first().click({ force: true })
await pB.waitForTimeout(500)
const B_collapsed = await probeData(pB, 'B: primary-header COLLAPSED')
await pB.screenshot({ path: 'snapshots/2026-05-21-session/scenario-B-collapsed.png', clip: { x: 0, y: 0, width: 200, height: 400 } })

// ── Scenario C: SIMULATE proposed fix via injected CSS ──────────────────
const pC = await c.newPage()
await pC.goto('http://localhost:6006/iframe.html?id=design-system-components-appshell-展示--primary-sidebar&viewMode=story', { waitUntil: 'networkidle' })
await pC.waitForTimeout(1000)
// Inject CSS that simulates `!pl-3 !pr-0` + removes `!w / !justify-center` for collapsed state
await inject(pC, `
  [data-collapsible="icon"] [data-sidebar="header"] {
    padding-left: 0.75rem !important; /* 12px (pl-3) */
    padding-right: 0 !important;
    width: auto !important; /* undo !w-[var(--sidebar-width-icon)] */
    justify-content: normal !important; /* undo !justify-center */
  }
`)
await pC.locator('[data-sidebar="trigger"]').first().click({ force: true })
await pC.waitForTimeout(500)
const C_collapsed_proposed = await probeData(pC, 'C: PROPOSED fix COLLAPSED')
await pC.screenshot({ path: 'snapshots/2026-05-21-session/scenario-C-collapsed-proposed.png', clip: { x: 0, y: 0, width: 200, height: 400 } })
await pC.locator('[data-sidebar="trigger"]').first().click({ force: true })
await pC.waitForTimeout(60)
const C_t60 = await probeData(pC, 'C: PROPOSED toggle expand t=60ms')
await pC.waitForTimeout(60)
const C_t120 = await probeData(pC, 'C: PROPOSED toggle expand t=120ms')
await pC.waitForTimeout(80)
const C_t200 = await probeData(pC, 'C: PROPOSED toggle expand t=200ms')

console.log(JSON.stringify({
  A_expanded, A_collapsed_v9, A_t60, A_t120, A_t200,
  B_expanded, B_collapsed,
  C_collapsed_proposed, C_t60, C_t120, C_t200,
}, null, 2))

await b.close()
