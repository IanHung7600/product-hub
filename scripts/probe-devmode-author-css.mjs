// Probe DevMode Author CSS extraction for px-[var(--layout-space-loose)] case
import { chromium } from 'playwright'
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await c.newPage()
await p.goto('http://localhost:6006/iframe.html?id=design-system-components-appshell-展示--primary-sidebar&viewMode=story', { waitUntil: 'networkidle' })
await p.waitForTimeout(800)

const probe = await p.evaluate(() => {
  // Find sidebar menu button (has px-[var(--layout-space-loose)])
  const el = document.querySelector('[data-sidebar="menu-button"]')
  if (!el) return { error: 'no menu button' }

  const results = []
  // Walk all stylesheets, find matching rules
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const walk = (rules) => {
        if (!rules) return
        for (const rule of Array.from(rules)) {
          if (rule.cssRules) walk(rule.cssRules)
          if (rule.type !== 1) continue // CSSStyleRule = 1
          const sel = rule.selectorText
          if (!sel || !sel.includes('layout-space-loose')) continue
          let matches = false
          try { matches = el.matches(sel) } catch (e) { results.push({ sel, err: e.message }); continue }
          if (!matches) {
            results.push({ sel, matches: false })
            continue
          }
          const decl = rule.style
          const props = []
          for (let i = 0; i < decl.length; i++) {
            const prop = decl.item(i)
            props.push({ prop, val: decl.getPropertyValue(prop) })
          }
          results.push({ sel, matches: true, declLength: decl.length, props })
        }
      }
      walk(sheet.cssRules)
    } catch (e) { results.push({ sheetErr: e.message }) }
  }
  return { results, elClass: el.className.slice(0, 200) }
})

console.log(JSON.stringify(probe, null, 2))
await b.close()
