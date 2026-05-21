import { chromium } from 'playwright'
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await c.newPage()
await p.goto('http://localhost:6006/iframe.html?id=design-system-components-appshell-展示--primary-sidebar&viewMode=story', { waitUntil: 'networkidle' })
await p.waitForTimeout(800)
const r = await p.evaluate(() => {
  const el = document.querySelector('[data-sidebar="menu-button"]')
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const walk = (rules) => {
        if (!rules) return null
        for (const rule of Array.from(rules)) {
          if (rule.cssRules) { const r = walk(rule.cssRules); if (r) return r }
          if (rule.type !== 1) continue
          if (!rule.selectorText?.includes('px-')) continue
          if (!rule.selectorText.includes('layout-space-loose')) continue
          let m = false
          try { m = el.matches(rule.selectorText) } catch { continue }
          if (!m) continue
          const cssText = rule.style.cssText
          const decls = cssText.split(';').map(s=>s.trim()).filter(Boolean)
          return { sel: rule.selectorText, cssText, parsed: decls }
        }
        return null
      }
      const r = walk(sheet.cssRules)
      if (r) return r
    } catch {}
  }
})
console.log(JSON.stringify(r, null, 2))
await b.close()
