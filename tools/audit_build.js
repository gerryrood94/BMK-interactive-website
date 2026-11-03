// Automated build audit for one folder of pages. Prints hard data for the build auditor:
//  - no-JS render: visible text length with and without JS, elements hidden only without JS
//  - focusable elements, those without visible focus style, tabindex > 0
//  - animations/transitions still running under prefers-reduced-motion
//  - text contrast: every visible text element sampled, worst ratios reported
//  - canvas / svg counts, page weight, inline script size
// Usage: node tools/audit_build.js <folder>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

function lum(rgb) { const [r, g, b] = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
function ratio(a, b) { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); }

(async () => {
  const dir = path.resolve(process.argv[2]);
  const files = fs.readdirSync(dir).filter(f => /\.html$/i.test(f));
  const browser = await chromium.launch();
  let fails = 0;
  const say = (lvl, m) => { if (lvl === 'FAIL') fails++; console.log(`  [${lvl}] ${m}`); };
  for (const f of files) {
    const url = 'file://' + path.join(dir, f);
    const html = fs.readFileSync(path.join(dir, f), 'utf8');
    console.log(`\n### ${f}  (${(html.length / 1024).toFixed(0)} KB; inline script ${((html.match(/<script[\s\S]*?<\/script>/gi) || []).join('').length / 1024).toFixed(0)} KB; <svg> ${(html.match(/<svg\b/gi) || []).length}; <canvas> ${(html.match(/<canvas\b/gi) || []).length})`);

    // 1. with JS vs without JS
    const textOf = async (js) => {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: js });
      const p = await ctx.newPage();
      await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(500);
      const h = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 700) { await p.evaluate(yy => window.scrollTo(0, yy), y); await p.waitForTimeout(40); }
      const r = await p.evaluate(() => {
        const vis = el => { const cs = getComputedStyle(el); const rect = el.getBoundingClientRect(); return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05 && rect.width > 0 && rect.height > 0; };
        let n = 0, hiddenHeadings = [];
        document.querySelectorAll('h1,h2,h3,h4,p,li,dd,dt,td,th,figcaption,span,a,button,summary,label').forEach(el => { if (vis(el)) n += (el.innerText || '').length; });
        document.querySelectorAll('h1,h2,h3').forEach(el => { if (!vis(el)) hiddenHeadings.push(el.innerText.slice(0, 50)); });
        return { n, hiddenHeadings, h: document.documentElement.scrollHeight };
      });
      await ctx.close(); return r;
    };
    const withJs = await textOf(true), noJs = await textOf(false);
    const drop = withJs.n ? (withJs.n - noJs.n) / withJs.n : 0;
    say(drop > 0.05 || noJs.hiddenHeadings.length ? 'FAIL' : 'OK', `no-JS: visible text ${noJs.n} vs ${withJs.n} with JS (${(drop * 100).toFixed(1)} % lost); hidden headings without JS: ${noJs.hiddenHeadings.length ? noJs.hiddenHeadings.join(' | ') : 'none'}`);
    if (withJs.hiddenHeadings.length) say('WARN', `with JS, headings not visible after scroll: ${withJs.hiddenHeadings.join(' | ')}`);

    // 2. focus, reduced motion, contrast
    for (const rm of [false, true]) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: rm ? 'reduce' : 'no-preference' });
      const p = await ctx.newPage();
      await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(800);
      const h = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 700) { await p.evaluate(yy => window.scrollTo(0, yy), y); await p.waitForTimeout(40); }
      await p.waitForTimeout(1500);
      const anim = await p.evaluate(() => {
        const a = document.getAnimations ? document.getAnimations() : [];
        const running = a.filter(x => x.playState === 'running');
        const infinite = running.filter(x => { const t = x.effect && x.effect.getTiming ? x.effect.getTiming() : {}; return t.iterations === Infinity; });
        return { running: running.length, infinite: infinite.length };
      });
      if (rm) say(anim.running ? 'FAIL' : 'OK', `reduced-motion: ${anim.running} animation(s) still running after 1.5 s (${anim.infinite} infinite)`);
      else say(anim.infinite ? 'WARN' : 'OK', `motion: ${anim.running} running, ${anim.infinite} infinite animation(s) 1.5 s after load+scroll`);
      if (!rm) {
        const focus = await p.evaluate(() => {
          const els = [...document.querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex]')].filter(el => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden'; });
          const pos = els.filter(el => parseInt(el.getAttribute('tabindex') || '0', 10) > 0).length;
          const noName = els.filter(el => !(el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim()).length;
          return { n: els.length, pos, noName };
        });
        say(focus.pos || focus.noName ? 'WARN' : 'OK', `focusable: ${focus.n}; tabindex>0: ${focus.pos}; without accessible name: ${focus.noName}`);
        // visible focus: tab through first 40 and see if outline/box-shadow/border changes
        let noVisible = 0, checked = 0;
        for (let i = 0; i < Math.min(40, focus.n); i++) {
          await p.keyboard.press('Tab');
          const r = await p.evaluate(() => { const el = document.activeElement; if (!el || el === document.body) return null; const cs = getComputedStyle(el); return { ol: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0, bs: cs.boxShadow !== 'none', tag: el.tagName }; });
          if (!r) continue; checked++; if (!r.ol && !r.bs) noVisible++;
        }
        say(noVisible > checked * 0.3 ? 'FAIL' : noVisible ? 'WARN' : 'OK', `visible focus: ${checked - noVisible}/${checked} of first tab stops show outline or box-shadow`);
        const contrast = await p.evaluate(() => {
          const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(',').map(parseFloat); return v.length === 4 && v[3] === 0 ? null : v.slice(0, 3); };
          const bgOf = el => { let e = el; while (e && e !== document.documentElement) { const b = parse(getComputedStyle(e).backgroundColor); if (b) return b; e = e.parentElement; } const b = parse(getComputedStyle(document.body).backgroundColor); return b || [255, 255, 255]; };
          const out = [];
          document.querySelectorAll('h1,h2,h3,h4,p,li,dd,dt,td,th,figcaption,span,a,button,summary,label,small,b,strong,em,i,text').forEach(el => {
            if (el.closest('svg') && el.tagName !== 'text') return;
            const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
            if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05 || r.width === 0 || r.height === 0) return;
            const txt = (el.childNodes.length ? [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('') : '').trim();
            if (!txt) return;
            const fg = parse(cs.color); if (!fg) return;
            const bg = el.tagName === 'text' ? [255, 255, 255] : bgOf(el);
            out.push({ fg, bg, size: parseFloat(cs.fontSize), weight: cs.fontWeight, txt: txt.slice(0, 40), tag: el.tagName.toLowerCase(), cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').toString().split(' ')[0] });
          });
          return out;
        });
        const rated = contrast.map(c => ({ ...c, r: ratio(c.fg, c.bg) })).sort((a, b) => a.r - b.r);
        const small = rated.filter(c => c.size < 15 && !/^(h[1-6])$/.test(c.tag));
        const low = rated.filter(c => c.r < 4.5);
        say(low.length ? 'FAIL' : 'OK', `contrast: ${rated.length} text elements sampled; ${low.length} below 4.5:1${low.length ? ' — worst: ' + low.slice(0, 5).map(c => `${c.tag}.${c.cls} ${c.r.toFixed(2)}:1 «${c.txt}»`).join('; ') : ''}`);
        const tiny = small.filter(c => c.txt.split(' ').length > 3);
        say(tiny.length ? 'WARN' : 'OK', `type size: ${tiny.length} multi-word text element(s) below 15 px${tiny.length ? ' — e.g. ' + tiny.slice(0, 3).map(c => `${c.tag}.${c.cls} ${c.size}px «${c.txt}»`).join('; ') : ''}`);
      }
      await ctx.close();
    }
  }
  await browser.close();
  console.log(`\n=> ${fails} build-audit failure(s)`);
})();
