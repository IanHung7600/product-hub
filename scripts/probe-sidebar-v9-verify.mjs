import { chromium } from 'playwright'
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await c.newPage()
await p.goto('http://localhost:6006/iframe.html?id=design-system-components-appshell-展示--primary-sidebar&viewMode=story', { waitUntil: 'networkidle' })
await p.waitForTimeout(800)

const r = (el) => el ? {
  x: Math.round(el.getBoundingClientRect().x),
  w: Math.round(el.getBoundingClientRect().width),
  cx: Math.round(el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2),
} : null

const css = (el, ...props) => el ? Object.fromEntries(props.map(prop => [prop, window.getComputedStyle(el).getPropertyValue(prop)])) : null

const probe = async (label) => p.evaluate(({ label }) => {
  const outer = document.querySelector('[data-state]')
  const sidebarOuter = document.querySelector('[data-state] > div:nth-child(2)')
  const inner = document.querySelector('[data-sidebar="sidebar"]')
  const header = document.querySelector('[data-sidebar="header"]')
  const headerSpan = header?.querySelector('span')
  const avatar = header?.querySelector('div > div, div > img, [aria-label]')
  // Find first menu button
  const menuBtn = document.querySelector('[data-sidebar="menu-button"]')
  const menuIcon = menuBtn?.querySelector('svg')
  const menuLabel = menuBtn?.querySelector('[data-sidebar="menu-label"]')

  const r = (el) => el ? {
    x: Math.round(el.getBoundingClientRect().x),
    w: Math.round(el.getBoundingClientRect().width),
    cx: Math.round(el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2),
  } : null

  const css = (el, ...props) => el ? Object.fromEntries(props.map(p => [p, window.getComputedStyle(el).getPropertyValue(p)])) : null

  return {
    label,
    state: outer?.getAttribute('data-state'),
    sidebarOuter: { ...r(sidebarOuter), ...css(sidebarOuter, 'overflow-x', 'border-right-width', 'border-right-color', 'width') },
    inner: { ...r(inner), ...css(inner, 'width') },
    header: { ...r(header), ...css(header, 'padding-left', 'padding-right', 'justify-content') },
    headerSpan: { ...r(headerSpan), text: headerSpan?.textContent, ...css(headerSpan, 'font-weight', 'font-size', 'font-family', 'color') },
    avatar: r(avatar),
    menuBtn: { ...r(menuBtn), ...css(menuBtn, 'font-weight', 'font-size', 'color', 'padding-left') },
    menuLabel: menuLabel ? { ...r(menuLabel), text: menuLabel.textContent, ...css(menuLabel, 'display') } : null,
    menuIcon: r(menuIcon),
  }
}, { label })

const expanded = await probe('EXPANDED')
await p.screenshot({ path: 'snapshots/2026-05-21-session/sidebar-v9-expanded.png' })
await p.locator('[data-sidebar="trigger"]').first().click({ force: true })
await p.waitForTimeout(500)
const collapsed = await probe('COLLAPSED')
await p.screenshot({ path: 'snapshots/2026-05-21-session/sidebar-v9-collapsed.png' })

console.log(JSON.stringify({ expanded, collapsed }, null, 2))
await b.close()
