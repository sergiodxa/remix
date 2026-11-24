// Clicks "Add entry" 2000 times in Chromium and prints the JS heap after a forced garbage
// collection every 250 clicks. The page only ever shows 50 entries, so the heap should stay flat.
import { createServer } from 'vite'
import { chromium } from 'playwright'

const server = await createServer({ logLevel: 'error', server: { port: 5199 } })
await server.listen()
const browser = await chromium.launch()
const page = await browser.newPage()
const cdp = await page.context().newCDPSession(page)
await page.goto('http://localhost:5199/')
await page.waitForSelector('#add')

async function heapMB() {
  await cdp.send('HeapProfiler.collectGarbage')
  await cdp.send('HeapProfiler.collectGarbage')
  let { usedSize } = await cdp.send('Runtime.getHeapUsage')
  return (usedSize / 1e6).toFixed(1)
}

console.log('clicks  heap (MB)  <li> in DOM')
console.log(
  `${'0'.padStart(6)}  ${(await heapMB()).padStart(9)}  ${await page.locator('li').count()}`,
)
for (let round = 1; round <= 8; round++) {
  await page.evaluate(async () => {
    let button = document.getElementById('add')!
    for (let i = 0; i < 250; i++) {
      button.click()
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  })
  let line = `${String(round * 250).padStart(6)}  ${(await heapMB()).padStart(9)}`
  console.log(`${line}  ${await page.locator('li').count()}`)
}

await browser.close()
await server.close()
