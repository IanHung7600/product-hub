import { chromium } from 'playwright'
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 1440, height: 900 } })

const targets = [
  { label: 'PROD', url: 'https://ajenchen.github.io/design-system/iframe.html?id=design-system-components-sidebar-展示--icon-collapse&viewMode=story' },
  { label: 'LOCAL', url: 'http://localhost:6006/iframe.html?id=design-system-components-sidebar-展示--icon-collapse&viewMode=story' },
]

const results = {}
for (const { label, url } of targets) {
  const p = await c.newPage()
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1500)
  // Check what fonts are actually downloaded
  const fonts = await p.evaluate(async () => {
    await document.fonts.ready
    const loadedFamilies = new Set()
    for (const f of document.fonts) {
      if (f.status === 'loaded') loadedFamilies.add(`${f.family}/${f.weight}/${f.style}`)
    }
    // Check if Roboto is actually available (fonts.check)
    const checks = {
      roboto_400: document.fonts.check('400 14px Roboto'),
      roboto_500: document.fonts.check('500 14px Roboto'),
      roboto_700: document.fonts.check('700 14px Roboto'),
      system_ui_500: document.fonts.check('500 14px system-ui'),
    }
    // Get computed font on actual menu button
    const menuBtn = document.querySelector('[data-sidebar="menu-button"]')
    const header = document.querySelector('[data-sidebar="header"]')
    const headerText = header && Array.from(header.querySelectorAll('span')).find(s => s.textContent && s.textContent.length > 2)
    return {
      loadedFamilies: Array.from(loadedFamilies),
      checks,
      menuBtnFamily: menuBtn ? window.getComputedStyle(menuBtn).fontFamily.split(',')[0].trim().replace(/"/g, '') : null,
      headerTextFamily: headerText ? window.getComputedStyle(headerText).fontFamily.split(',')[0].trim().replace(/"/g, '') : null,
    }
  })
  // Screenshot the sidebar region only
  const sidebarBox = await p.evaluate(() => {
    const sb = document.querySelector('[data-state]')
    if (!sb) return null
    const r = sb.getBoundingClientRect()
    return { x: r.x, y: r.y, width: r.width + 20, height: r.height }
  })
  if (sidebarBox) {
    await p.screenshot({ path: `snapshots/2026-05-21-session/font-${label.toLowerCase()}-sidebar.png`, clip: sidebarBox })
  }
  results[label] = fonts
  await p.close()
}

console.log(JSON.stringify(results, null, 2))
await b.close()
