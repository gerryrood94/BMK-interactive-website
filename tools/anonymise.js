// Copy concepts/<X>/{index,rd}.html into panel/draft_N/ under a seeded shuffle, strip HTML
// comments (authors' notes) so reviewers judge blind. Writes panel/_key.txt (the mapping) —
// never hand that file to a reviewer. Usage: node tools/anonymise.js <seed>
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const seed = parseInt(process.argv[2] || '7', 10);
let s = seed;
const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
const concepts = fs.readdirSync(path.join(root, 'concepts')).filter(d => fs.existsSync(path.join(root, 'concepts', d, 'index.html'))).sort();
const order = concepts.slice();
for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
fs.rmSync(path.join(root, 'panel'), { recursive: true, force: true });
fs.mkdirSync(path.join(root, 'panel'));
const key = [];
order.forEach((c, i) => {
  const d = `draft_${i + 1}`;
  const dst = path.join(root, 'panel', d);
  fs.mkdirSync(dst);
  for (const f of ['index.html', 'rd.html']) {
    const src = path.join(root, 'concepts', c, f);
    if (!fs.existsSync(src)) continue;
    let h = fs.readFileSync(src, 'utf8');
    h = h.replace(/<!--[\s\S]*?-->/g, '');            // authors' comments
    h = h.replace(/\/\*[\s\S]*?\*\//g, m => /\n/.test(m) ? '' : m); // multi-line CSS comments
    fs.writeFileSync(path.join(dst, f), h);
  }
  const shots = path.join(root, 'concepts', c, 'shots');
  if (fs.existsSync(shots)) { fs.mkdirSync(path.join(dst, 'shots')); for (const p of fs.readdirSync(shots)) fs.copyFileSync(path.join(shots, p), path.join(dst, 'shots', p)); }
  key.push(`${d} = concepts/${c}`);
});
fs.writeFileSync(path.join(root, 'panel', '_key.txt'), `seed ${seed}\n` + key.join('\n') + '\n');
console.log(key.join('\n'));
