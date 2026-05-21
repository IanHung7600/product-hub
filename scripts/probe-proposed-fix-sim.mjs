// Properly simulate `!pl-3 !pr-0` + remove `!justify-center` + remove `!w-[var(--sidebar-width-icon)]`
// by injecting CSS that wins specificity battle.
import { chromium } from 'playwright'
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await c.newPage()
await p.goto('http://localhost:6006/iframe.html?id=design-system-components-appshell-展示--primary-sidebar&viewMode=story', { waitUntil: 'networkidle' })
await p.waitForTimeout(1000)

// Inject HIGH-specificity rule that beats group-data-[collapsible=icon]:!px-0
// Use combined chain: .group[data-collapsible="icon"] selector matches Tailwind's emitted form
await p.addStyleTag({ content: `
  /* override-collapsed-header */
  .group[data-collapsible="icon"] [data-sidebar="header"][data-sidebar="header"][data-sidebar="header"] {
    padding-left: 0.75rem !important;
    padding-right: 0 !important;
    width: auto !important;
    justify-content: normal !important;
  }
`})

const probe = async (label) => p.evaluate(({ label }) => {
  const r = (el) => el ? {
    x: Math.round(el.getBoundingClientRect().x),
    w: Math.round(el.getBoundingClientRect().width),
    cx: Math.round(el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2),
  } : null
  const css = (el, ...props) => el ? Object.fromEntries(props.map(p => [p, window.getComputedStyle(el).getPropertyValue(p)])) : null
  const sbHeader = document.querySelector('[data-sidebar="header"]')
  const sbHeaderAvatar = sbHeader?.querySelector('[data-prefix-type], img, .rounded-md, [role="img"]')
  const menuBtn = document.querySelector('[data-sidebar="menu-button"]')
  const menuIcon = menuBtn?.querySelector('svg')
  return {
    label,
    state: document.querySelector('[data-state]')?.getAttribute('data-state'),
    sbHeader: sbHeader ? { ...r(sbHeader), ...css(sbHeader, 'padding-left', 'padding-right', 'width', 'justify-content') } : null,
    avatar: r(sbHeaderAvatar),
    menuIcon: r(menuIcon),
  }
}, { label })

const collapsed = await probe('PROPOSED collapsed')
// Animation frames
await p.locator('[data-sidebar="trigger"]').first().click({ force: true })
await p.waitForTimeout(30)
const t30 = await probe('expand t=30ms')
await p.waitForTimeout(40)
const t70 = await probe('expand t=70ms')
await p.waitForTimeout(50)
const t120 = await probe('expand t=120ms')
await p.waitForTimeout(50)
const t170 = await probe('expand t=170ms')
await p.waitForTimeout(50)
const t220 = await probe('expand t=220ms')

console.log(JSON.stringify({ collapsed, t30, t70, t120, t170, t220 }, null, 2))
await b.close()
