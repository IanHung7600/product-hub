// Real source-applied probe (not simulation) after v10 padding-driven animation fix.
// Verify: expanded behavior + collapsed avatar.cx=24 + toggle animation monotonic.
import { chromium } from 'playwright'
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await c.newPage()
await p.goto('http://localhost:6006/iframe.html?id=design-system-components-appshell-展示--primary-sidebar&viewMode=story', { waitUntil: 'networkidle' })
await p.waitForTimeout(1000)

const probe = async (label) => p.evaluate(({ label }) => {
  const r = (el) => el ? { x: Math.round(el.getBoundingClientRect().x), w: Math.round(el.getBoundingClientRect().width), cx: Math.round(el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2) } : null
  const css = (el, ...props) => el ? Object.fromEntries(props.map(p => [p, window.getComputedStyle(el).getPropertyValue(p)])) : null
  const h = document.querySelector('[data-sidebar="header"]')
  const outer = document.querySelector('[data-state]')
  const outerFixed = document.querySelector('[data-state] > div:nth-child(2)')
  return {
    label,
    state: outer?.getAttribute('data-state'),
    collapsible: outer?.getAttribute('data-collapsible'),
    outerFixed: outerFixed ? { ...r(outerFixed), ...css(outerFixed, 'width', 'overflow-x', 'border-right-width', 'border-right-color') } : null,
    h: h ? { ...r(h), ...css(h, 'padding-left', 'padding-right', 'width', 'justify-content') } : null,
    avatar: r(h?.querySelector('[data-prefix-type], img, .rounded-md, [role="img"]')),
    menuIcon: r(document.querySelector('[data-sidebar="menu-button"] svg')),
  }
}, { label })

const expanded_init = await probe('1. expanded init')
// Collapse
await p.locator('[data-sidebar="trigger"]').first().click({ force: true })
await p.waitForTimeout(30)
const collapse_t30 = await probe('2. collapse t=30ms')
await p.waitForTimeout(40)
const collapse_t70 = await probe('3. collapse t=70ms')
await p.waitForTimeout(50)
const collapse_t120 = await probe('4. collapse t=120ms')
await p.waitForTimeout(80)
const collapse_t200 = await probe('5. collapse t=200ms final')
await p.screenshot({ path: 'snapshots/2026-05-21-session/v10-collapsed.png', clip: { x: 0, y: 0, width: 200, height: 400 } })

// Expand
await p.locator('[data-sidebar="trigger"]').first().click({ force: true })
await p.waitForTimeout(30)
const expand_t30 = await probe('6. expand t=30ms')
await p.waitForTimeout(40)
const expand_t70 = await probe('7. expand t=70ms')
await p.waitForTimeout(50)
const expand_t120 = await probe('8. expand t=120ms')
await p.waitForTimeout(80)
const expand_t200 = await probe('9. expand t=200ms final')
await p.screenshot({ path: 'snapshots/2026-05-21-session/v10-expanded.png', clip: { x: 0, y: 0, width: 320, height: 400 } })

// Scenario B - primary-header mode (independent)
const pB = await c.newPage()
await pB.goto('http://localhost:6006/iframe.html?id=design-system-components-appshell-展示--primary-header&viewMode=story', { waitUntil: 'networkidle' })
await pB.waitForTimeout(1000)
const B_expanded = await pB.evaluate(() => {
  const r = (el) => el ? { x: Math.round(el.getBoundingClientRect().x), w: Math.round(el.getBoundingClientRect().width), cx: Math.round(el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2) } : null
  const trigger = document.querySelector('[data-sidebar="trigger"]')
  const rail = Array.from(document.querySelectorAll('header > div')).find(d => { const w = d.getBoundingClientRect().width; return w > 0 && w < 60 })
  return { label: 'B: primary-header expanded', trigger: r(trigger), triggerIcon: r(trigger?.querySelector('svg')), rail: r(rail), menuIcon: r(document.querySelector('[data-sidebar="menu-button"] svg')) }
})
await pB.locator('[data-sidebar="trigger"]').first().click({ force: true })
await pB.waitForTimeout(300)
const B_collapsed = await pB.evaluate(() => {
  const r = (el) => el ? { x: Math.round(el.getBoundingClientRect().x), w: Math.round(el.getBoundingClientRect().width), cx: Math.round(el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2) } : null
  const trigger = document.querySelector('[data-sidebar="trigger"]')
  const rail = Array.from(document.querySelectorAll('header > div')).find(d => { const w = d.getBoundingClientRect().width; return w > 0 && w < 60 })
  return { label: 'B: primary-header collapsed', trigger: r(trigger), triggerIcon: r(trigger?.querySelector('svg')), rail: r(rail), menuIcon: r(document.querySelector('[data-sidebar="menu-button"] svg')) }
})

console.log(JSON.stringify({ expanded_init, collapse_t30, collapse_t70, collapse_t120, collapse_t200, expand_t30, expand_t70, expand_t120, expand_t200, B_expanded, B_collapsed }, null, 2))
await b.close()
