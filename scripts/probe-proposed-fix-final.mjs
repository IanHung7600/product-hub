// Final simulation: classList.remove() unwanted classes + setProperty('padding-left', '12px', 'important')
// on every state mutation (use MutationObserver to react to data-collapsible change).
import { chromium } from 'playwright'
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await c.newPage()
await p.goto('http://localhost:6006/iframe.html?id=design-system-components-appshell-展示--primary-sidebar&viewMode=story', { waitUntil: 'networkidle' })
await p.waitForTimeout(1000)

await p.evaluate(() => {
  const header = document.querySelector('[data-sidebar="header"]')
  const sidebarGroup = document.querySelector('[data-state]')
  if (!header || !sidebarGroup) return
  // Remove discrete-switch classes
  ;['group-data-[collapsible=icon]:!w-[var(--sidebar-width-icon)]',
    'group-data-[collapsible=icon]:!px-0',
    'group-data-[collapsible=icon]:!justify-center'].forEach(cls => header.classList.remove(cls))
  // Apply via inline style based on collapsible state (use MO to track changes)
  const apply = () => {
    const collapsed = sidebarGroup.getAttribute('data-collapsible') === 'icon'
    if (collapsed) {
      header.style.setProperty('padding-left', '12px', 'important')
      header.style.setProperty('padding-right', '0px', 'important')
      header.style.removeProperty('width')
      header.style.removeProperty('justify-content')
    } else {
      header.style.removeProperty('padding-left')
      header.style.removeProperty('padding-right')
    }
  }
  apply()
  new MutationObserver(apply).observe(sidebarGroup, { attributes: true, attributeFilter: ['data-collapsible'] })
  window.__simReady = true
})
await p.waitForTimeout(100)

const probe = async (label) => p.evaluate(({ label }) => {
  const r = (el) => el ? { x: Math.round(el.getBoundingClientRect().x), w: Math.round(el.getBoundingClientRect().width), cx: Math.round(el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2) } : null
  const css = (el, ...props) => el ? Object.fromEntries(props.map(p => [p, window.getComputedStyle(el).getPropertyValue(p)])) : null
  const h = document.querySelector('[data-sidebar="header"]')
  return {
    label,
    state: document.querySelector('[data-state]')?.getAttribute('data-state'),
    h: h ? { ...r(h), ...css(h, 'padding-left', 'padding-right', 'width', 'justify-content') } : null,
    avatar: r(h?.querySelector('[data-prefix-type], img, .rounded-md, [role="img"]')),
    menuIcon: r(document.querySelector('[data-sidebar="menu-button"] svg')),
  }
}, { label })

const expanded = await probe('expanded init')
// Collapse
await p.locator('[data-sidebar="trigger"]').first().click({ force: true })
await p.waitForTimeout(220)
const collapsed = await probe('collapsed final')
await p.screenshot({ path: 'snapshots/2026-05-21-session/proposed-fix-collapsed.png', clip: { x: 0, y: 0, width: 200, height: 400 } })
// Expand — animation frames
await p.locator('[data-sidebar="trigger"]').first().click({ force: true })
await p.waitForTimeout(30)
const t30 = await probe('expand t=30ms')
await p.waitForTimeout(40)
const t70 = await probe('expand t=70ms')
await p.waitForTimeout(50)
const t120 = await probe('expand t=120ms')
await p.waitForTimeout(80)
const t200 = await probe('expand t=200ms')

console.log(JSON.stringify({ expanded, collapsed, t30, t70, t120, t200 }, null, 2))
await b.close()
