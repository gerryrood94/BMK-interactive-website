// Render every .html in a folder at 1280 px (desktop) and 390 px (phone emulation),
// full page, DPR 1. Reports horizontal overflow, console errors, JS exceptions,
// external requests other than Google Fonts, and whether the page still works with
// prefers-reduced-motion. Usage: node tools/render.js <folder> [outdir]
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const dir = path.resolve(process.argv[2]);
  const out = path.resolve(process.argv[3] || path.join(dir, 'shots'));
  fs.mkdirSync(out, { recursive: true });
  const files = fs.readdirSync(dir).filter(f => /\.html$/i.test(f));
  const browser = await chromium.launch();
  let problems = 0;
  const say = (lvl, m) => { if (lvl === 'FAIL') problems++; console.log(`  [${lvl}] ${m}`); };
  for (const f of files) {
    const url = 'file://' + path.join(dir, f);
    const base = f.replace(/\.html$/i, '');
    console.log(`\n### ${f}`);
    const variants = [
      { name: '1280', ctx: { viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 } },
      { name: '390', ctx: { ...devices['iPhone 13'], deviceScaleFactor: 1 } },
      { name: '320', ctx: { viewport: { width: 320, height: 700 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } },
      { name: '1280-rm', ctx: { viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' } },
    ];
    for (const v of variants) {
      const context = await browser.newContext(v.ctx);
      const page = await context.newPage();
      const errors = [], ext = [];
      page.on('pageerror', e => errors.push('pageerror: ' + e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
      page.on('request', r => { const u = r.url(); if (/^https?:/.test(u) && !/fonts\.(googleapis|gstatic)\.com/.test(u)) ext.push(u); });
      await page.goto(url, { waitUntil: 'load' });
      await page.waitForTimeout(600);
      // scroll through so lazy / scroll-driven effects run
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 700) { await page.evaluate(yy => window.scrollTo(0, yy), y); await page.waitForTimeout(60); }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      const m = await page.evaluate(() => {
        const d = document.documentElement;
        const over = [];
        document.querySelectorAll('body *').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.right > d.clientWidth + 1 && getComputedStyle(el).position !== 'fixed') {
            if (over.length < 5) over.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '') + ' right=' + Math.round(r.right));
          }
        });
        return { sw: d.scrollWidth, cw: d.clientWidth, sh: d.scrollHeight, over };
      });
      const shot = path.join(out, `${base}_${v.name}.png`);
      await page.screenshot({ path: shot, fullPage: true });
      const ok = m.sw <= m.cw + 1 && m.over.length === 0;
      say(ok ? 'OK' : 'FAIL', `${v.name}: scrollWidth ${m.sw} / clientWidth ${m.cw}, height ${m.sh}${m.over.length ? ' overflow: ' + m.over.join('; ') : ''} → ${path.relative(process.cwd(), shot)}`);
      if (errors.length) say('FAIL', `${v.name}: ${errors.length} JS/console error(s): ${errors.slice(0, 3).join(' | ')}`);
      if (ext.length) say('FAIL', `${v.name}: external request(s) beyond Google Fonts: ${[...new Set(ext)].slice(0, 3).join(', ')}`);
      await context.close();
    }
  }
  await browser.close();
  console.log(`\n=> ${problems} render problem(s)`);
  process.exit(problems ? 1 : 0);
})();
