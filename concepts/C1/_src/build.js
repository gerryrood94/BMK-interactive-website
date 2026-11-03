// Сборка концепта C1 «Горизонт»: формула перспективы → инлайн-SVG; CSS и JS вставляются одним блоком.
const fs=require('fs'),path=require('path');
const SRC=__dirname, OUT=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(SRC,'style.css'),'utf8'), js=fs.readFileSync(path.join(SRC,'app.js'),'utf8');
const COL=['#24305F','#5282BE','#97B5DC','#A6B1BE'];
const colOf=c=>COL[Math.min(3,Math.floor(c/3))];
function geo(r,c,k=1.8,H=250){const t=r/7,q=1/(1+k*t),q7=1/(1+k);return{x:280+(c-5.5)*42*q,y:310-H*(1-q)/(1-q7),rx:11*q,ry:7*q,q};}
const f=n=>+n.toFixed(3);
// Планшет 8 × 12. opts: id, title, neg (лунка r0c0 белая), markers {"r,c":{fill,id}}, tilt, hz (линия горизонта), cls
function plate(o){
  let s=`<svg class="${o.cls||'plate__svg'}" viewBox="0 ${o.vy||40} 560 ${o.vh||300}" data-grid="8x12" data-perspective="q=1/(1+k*r/7), k=1.8"${o.tilt?' data-tilt=""':''} role="img" aria-labelledby="${o.id}-t" focusable="false" xmlns="http://www.w3.org/2000/svg">\n<title id="${o.id}-t">${o.title}</title>\n`;
  if(o.hz){const yf=geo(7,0).y-10;s+=`<line data-hz="" x1="0" x2="560" y1="${f(yf)}" y2="${f(yf)}" stroke="#97B5DC" stroke-width="1"/>\n`;}
  for(let r=7;r>=0;r--)for(let c=0;c<12;c++){const g=geo(r,c),key=r+','+c,m=o.markers&&o.markers[key];
    if(o.neg&&r===0&&c===0){s+=`<ellipse class="well well--neg" data-r="0" data-c="0" cx="${f(g.x)}" cy="${f(g.y)}" rx="${f(g.rx-0.75)}" ry="${f(g.ry-0.75)}" fill="#FFFFFF" stroke="#24305F" stroke-width="1.5"/>\n`;continue;}
    s+=`<ellipse class="well" data-r="${r}" data-c="${c}"${m?` id="${m.id}"`:''} cx="${f(g.x)}" cy="${f(g.y)}" rx="${f(g.rx)}" ry="${f(g.ry)}" fill="${m?m.fill:colOf(c)}"/>\n`;}
  return s+'</svg>';
}
// Горизонт-полоса: дальние ряды r=5,6,7 (декоративная)
function horizon(){let s=`<svg viewBox="0 48 560 72" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">\n<line x1="0" x2="560" y1="52" y2="52" stroke="#97B5DC" stroke-width="1"/>\n`;
  for(let r=7;r>=4;r--)for(let c=0;c<12;c++){const g=geo(r,c);s+=`<ellipse cx="${f(g.x)}" cy="${f(g.y)}" rx="${f(g.rx)}" ry="${f(g.ry)}" fill="${colOf(c)}"/>\n`;}
  return s+'</svg>';}
// Линия поения: две трубы по колонкам 2,5 и 8,5 той же сетки, ниппели — те же эллипсы; план — 4 ниппеля ближних рядов левой линии
function line(o){const cols=[2.5,8.5];const depth=r=>COL[Math.min(3,Math.floor(r/2))];
  let s=`<svg class="line__svg" viewBox="0 ${o.vy||40} 560 ${o.vh||300}" data-grid="2x8 nipples on the 8x12 grid, c=2.5 and 8.5" data-perspective="q=1/(1+k*r/7), k=1.8"${o.tilt?' data-tilt=""':''} role="img" aria-labelledby="${o.id}-t" focusable="false" xmlns="http://www.w3.org/2000/svg">\n<title id="${o.id}-t">${o.title}</title>\n`;
  const yf=geo(7,0).y-10;s+=`<line data-hz="" x1="0" x2="560" y1="${f(yf)}" y2="${f(yf)}" stroke="#97B5DC" stroke-width="1"/>\n`;
  for(const col of cols){const pts=[];for(let r=0;r<=7;r++){const g=geo(r,col);pts.push([g.x-7*g.q,g.y-18*g.q]);}for(let r=7;r>=0;r--){const g=geo(r,col);pts.push([g.x+7*g.q,g.y-18*g.q]);}
    s+=`<polygon data-pipe="${col}" points="${pts.map(a=>a[0].toFixed(1)+','+a[1].toFixed(1)).join(' ')}" fill="#EEF2F8" stroke="#24305F" stroke-width="1"/>\n`;}
  for(let r=7;r>=0;r--)for(const col of cols){const g=geo(r,col);
    s+=`<line data-r="${r}" data-c="${col}" x1="${f(g.x)}" x2="${f(g.x)}" y1="${f(g.y-18*g.q)}" y2="${f(g.y-g.ry)}" stroke="#24305F" stroke-width="${f(2.5*g.q)}"/>\n`;
    const id=(col===2.5&&r<4&&o.plan)?` id="${o.plan}${r+1}"`:'';
    s+=`<ellipse class="nip" data-r="${r}" data-c="${col}"${id} cx="${f(g.x)}" cy="${f(g.y)}" rx="${f(g.rx)}" ry="${f(g.ry)}" fill="${depth(r)}"/>\n`;
    if(id)s+=`<text data-r="${r}" data-c="${col}" x="${f(g.x-g.rx-8)}" y="${f(g.y+6)}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="18" font-weight="600" fill="#24305F">${r+1}</text>\n`;}
  return s+'</svg>';}
// Хроника: 7 лунок ближнего ряда (c = 1,2,…,7 → x по формуле), как кнопки
function chronStrip(n){let s=`<svg viewBox="0 290 560 40" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">\n<line x1="0" x2="560" y1="300" y2="300" stroke="#97B5DC" stroke-width="1"/>\n`;
  for(let i=0;i<n;i++){const c=i*11/(n-1),g=geo(0,c);s+=`<ellipse class="cw" cx="${f(g.x)}" cy="${f(g.y)}" rx="${f(g.rx*1.3)}" ry="${f(g.ry*1.3)}" fill="${colOf(Math.floor(c))}"/>\n`;}
  return s+'</svg>';}
// Плитки цикла ИФА (160 × 100): все из тех же эллипсов ближнего ряда
function row4(y,hl){let s='';for(let i=0;i<4;i++){const x=44+i*24;s+=`<ellipse cx="${x}" cy="${y}" rx="10" ry="6" fill="${i===hl?'#FFFFFF':COL[i]}" stroke="#24305F" stroke-width="${i===hl?1.5:0}"/>`;}return s;}
const tile={
  1:`<rect x="70" y="30" width="20" height="54" fill="#FFFFFF" stroke="#24305F" stroke-width="1.5"/><rect x="66" y="22" width="28" height="10" fill="#24305F"/><rect x="71.5" y="52" width="17" height="31" fill="#97B5DC"/><ellipse cx="80" cy="52" rx="8.5" ry="3" fill="#5282BE"/>`,
  2:`<polygon points="62,14 74,14 70,44 66,44" fill="#FFFFFF" stroke="#24305F" stroke-width="1.5"/><line x1="68" y1="44" x2="68" y2="58" stroke="#24305F" stroke-width="1.5"/><ellipse cx="68" cy="64" rx="3" ry="4" fill="#5282BE"/>${row4(84,1)}`,
  3:`<circle cx="80" cy="42" r="20" fill="#FFFFFF" stroke="#24305F" stroke-width="1.5"/><path d="M80 42 L80 26 A16 16 0 0 1 94 50 Z" fill="#97B5DC"/><line x1="80" y1="42" x2="80" y2="27" stroke="#24305F" stroke-width="1.5"/><line x1="80" y1="42" x2="90" y2="48" stroke="#24305F" stroke-width="1.5"/>${row4(84,-1)}`,
  4:`<line x1="44" y1="22" x2="44" y2="70" stroke="#5282BE" stroke-width="2" stroke-dasharray="6 4"/><line x1="68" y1="22" x2="68" y2="70" stroke="#5282BE" stroke-width="2" stroke-dasharray="6 4"/><line x1="92" y1="22" x2="92" y2="70" stroke="#5282BE" stroke-width="2" stroke-dasharray="6 4"/><line x1="116" y1="22" x2="116" y2="70" stroke="#5282BE" stroke-width="2" stroke-dasharray="6 4"/>${row4(84,-1)}`,
  5:`<rect x="30" y="18" width="100" height="14" fill="#24305F"/><line x1="68" y1="32" x2="68" y2="76" stroke="#5282BE" stroke-width="2"/><polygon points="63,70 73,70 68,78" fill="#5282BE"/>${row4(84,1)}`,
  6:`<line x1="30" y1="86" x2="134" y2="86" stroke="#24305F" stroke-width="1.5"/><line x1="30" y1="64" x2="134" y2="64" stroke="#24305F" stroke-width="1" stroke-dasharray="3 3"/><text x="134" y="60" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="11" fill="#24305F">3</text>`+
    [[4.4,'#24305F'],[6.2,'#5282BE'],[null,'#749BCD'],[11,'#97B5DC'],[3.8,'#A6B1BE']].map(([v,c],i)=>{const x=36+i*20;if(v===null)return `<rect x="${x}" y="12" width="12" height="74" fill="${c}"/><polygon points="${x},12 ${x+12},12 ${x+6},4" fill="${c}"/>`;const h=v*7.33;return `<rect x="${x}" y="${86-h}" width="12" height="${h}" fill="${c}"/>`;}).join('')
};
function tileSvg(n){return `<svg viewBox="0 0 160 100" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${tile[n]}</svg>`;}
function expand(html){
  let out='',i=0;
  while(true){const a=html.indexOf('{{',i);if(a<0){out+=html.slice(i);break;}
    out+=html.slice(i,a);const m=html.slice(a+2).match(/^(\w+)\s*/);const kind=m[1];let j=a+2+m[0].length,o={};
    if(html[j]==='{'){let depth=0,k=j;for(;k<html.length;k++){if(html[k]==='{')depth++;else if(html[k]==='}'){depth--;if(depth===0)break;}}o=JSON.parse(html.slice(j,k+1));j=k+1;}
    if(html.slice(j,j+2)!=='}}')throw new Error('bad token near '+html.slice(a,a+60));
    switch(kind){case 'CSS':out+=css;break;case 'JS':out+=js;break;case 'PLATE':out+=plate(o);break;case 'HZ':out+=horizon();break;case 'LINE':out+=line(o);break;case 'CHRON':out+=chronStrip(o.n||7);break;case 'TILE':out+=tileSvg(o.n);break;default:throw new Error('unknown '+kind);}
    i=j+2;}
  return out;}
for(const n of ['index','rd']){const out=expand(fs.readFileSync(path.join(SRC,n+'.tpl.html'),'utf8'));fs.writeFileSync(path.join(OUT,n+'.html'),out);console.log(n+'.html',out.length,'bytes');}
