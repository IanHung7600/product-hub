import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage()
await p.goto('http://localhost:6006/?path=/story/design-system-components-segmentedcontrol-%E5%B1%95%E7%A4%BA--icon-only&viewMode=story', { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
const buttons = p.frameLocator('#storybook-preview-iframe').locator('#storybook-root button')
const cnt = await buttons.count()
console.log(`SegmentedControl iconOnly: ${cnt} buttons`)
for (let i = 0; i < Math.min(cnt, 8); i++) {
  const r = await buttons.nth(i).evaluate(el => {
    const cs = getComputedStyle(el)
    const svg = el.querySelector('svg')
    const svgCs = svg ? getComputedStyle(svg) : null
    return { btn: { w: cs.width, h: cs.height, p: cs.padding }, svg: svgCs ? { w: svgCs.width, h: svgCs.height } : null }
  })
  const sq = r.btn.w === r.btn.h
  console.log(`  Btn[${i}]:${r.btn.w}×${r.btn.h} p=${r.btn.p} ${sq?'✓':'✗ NOT square'} | svg ${r.svg?.w}×${r.svg?.h}`)
}
await b.close()
