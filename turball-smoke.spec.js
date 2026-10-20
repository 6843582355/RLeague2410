const { test, expect } = require('@playwright/test');

test('turball load smoke test', async ({ page }) => {
  const failures = [];
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('decal') || text.includes('Session: Error') || text.includes('download')) {
      console.log('CONSOLE', msg.type(), text);
    }
  });
  page.on('pageerror', err => {
    console.log('PAGEERROR', err.message);
    failures.push(err.message);
  });
  page.on('response', res => {
    if (res.status() >= 400) {
      const url = res.url();
      if (url.includes('png') || url.includes('glb') || url.includes('api') || url.includes('decal')) {
        console.log('BAD_RESPONSE', res.status(), url);
        failures.push(`${res.status()} ${url}`);
      }
    }
  });

  await page.goto('http://127.0.0.1:4173', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(8000);

  const buttons = await page.locator('button').evaluateAll(nodes => nodes.map(n => n.textContent.trim()).filter(Boolean));
  console.log('BUTTONS', buttons.slice(0, 30));

  const bodyText = await page.locator('body').innerText();
  console.log('BODY_TEXT_START');
  console.log(bodyText.slice(0, 1500));
  console.log('BODY_TEXT_END');

  expect(failures).toHaveLength(0);
});
