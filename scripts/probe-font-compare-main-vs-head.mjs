// Compare font-weight rendering between deployed (main) GitHub Pages Storybook vs local HEAD.
// User asked: "字體粗細並非視覺錯位，你自己去截圖比較看到底根因是什麼"
import { chromium } from 'playwright'
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 1440, height: 900 } })

const targets = [
  { label: 'PROD_MAIN_GHPAGES', url: 'https://ajenchen.github.io/design-system/iframe.html?id=design-system-components-sidebar-展示--icon-collapse&viewMode=story' },
  { label: 'LOCAL_HEAD', url: 'http://localhost:6006/iframe.html?id=design-system-components-sidebar-展示--icon-collapse&viewMode=story' },
]

const results = {}
for (const { label, url } of targets) {
  const p = await c.newPage()
  try {
    await p.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  } catch (e) {
    results[label] = { error: e.message }
    await p.close()
    continue
  }
  await p.waitForTimeout(1500)
  const data = await p.evaluate(() => {
    const css = (el, ...props) => el ? Object.fromEntries(props.map(p => [p, window.getComputedStyle(el).getPropertyValue(p)])) : null
    const r = (el) => el ? { x: Math.round(el.getBoundingClientRect().x), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) } : null
    // header span containing workspace name
    const header = document.querySelector('[data-sidebar="header"]')
    const headerWorkspaceText = header ? Array.from(header.querySelectorAll('span')).find(s => s.textContent && s.textContent.trim().length > 1 && !/^\s*[A-Z]\s*$/.test(s.textContent.trim())) : null
    const menuBtn = document.querySelector('[data-sidebar="menu-button"]')
    // menu button label - the text inside menu button (not menu-label data attr, but visible text)
    const menuBtnText = menuBtn?.childNodes && Array.from(menuBtn.childNodes).find(n => n.nodeType === 3 || (n.nodeType === 1 && !n.matches('svg') && !n.hasAttribute('data-sidebar')))

    // Compute font fallback chain actually rendering — get first available font
    const headerActualFont = headerWorkspaceText ? document.fonts && document.fonts.check ? Array.from(document.fonts).filter(f => f.status === 'loaded').map(f => f.family).slice(0, 5) : 'fonts API unavail' : null

    return {
      headerWorkspaceText: headerWorkspaceText ? {
        text: headerWorkspaceText.textContent,
        ...r(headerWorkspaceText),
        ...css(headerWorkspaceText, 'font-weight', 'font-size', 'font-family', 'letter-spacing', 'line-height'),
      } : null,
      menuBtn: menuBtn ? {
        ...r(menuBtn),
        ...css(menuBtn, 'font-weight', 'font-size', 'font-family', 'letter-spacing', 'line-height'),
      } : null,
      loadedFonts: headerActualFont,
      htmlFontSize: window.getComputedStyle(document.documentElement).getPropertyValue('font-size'),
      htmlFontFamily: window.getComputedStyle(document.documentElement).getPropertyValue('font-family'),
      bodyFontWeight: window.getComputedStyle(document.body).getPropertyValue('font-weight'),
    }
  })
  await p.screenshot({ path: `snapshots/2026-05-21-session/font-compare-${label.toLowerCase()}.png`, clip: { x: 0, y: 0, width: 320, height: 600 } })
  results[label] = data
  await p.close()
}

console.log(JSON.stringify(results, null, 2))
await b.close()
