/* Горизонт — вся интерактивность страницы. Одна формула перспективы, та же, что в разметке:
   q = 1/(1+k·t), t = r/7; x = 280 + (c − 5,5)·42·q; y = 310 − H·(1 − q)/(1 − q7); rx = 11q, ry = 7q.
   k = 1,0 + 1,8·s, H = 250; s = min(1, scrollY / (yПланшета + h/2)) — камера опускается к горизонту по мере прокрутки. */
(function(){
  'use strict';
  var d=document, root=d.documentElement;
  root.className=root.className.replace(/\bno-js\b/,'')+' js';
  var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function geo(r,c,k,H){var t=r/7,q=1/(1+k*t),q7=1/(1+k);return{x:280+(c-5.5)*42*q,y:310-H*(1-q)/(1-q7),rx:11*q,ry:7*q,q:q};}
  function setPlate(svg,s){
    var k=1.0+1.8*s,H=250,els=svg.querySelectorAll('[data-r]');
    for(var i=0;i<els.length;i++){var e=els[i],r=+e.getAttribute('data-r'),c=+e.getAttribute('data-c'),g=geo(r,c,k,H);
      if(e.tagName==='ellipse'){var neg=e.classList.contains('well--neg');e.setAttribute('cx',g.x.toFixed(2));e.setAttribute('cy',g.y.toFixed(2));e.setAttribute('rx',(neg?g.rx-0.75:g.rx).toFixed(2));e.setAttribute('ry',(neg?g.ry-0.75:g.ry).toFixed(2));}
      else if(e.tagName==='line'){e.setAttribute('x1',(g.x).toFixed(2));e.setAttribute('x2',(g.x).toFixed(2));e.setAttribute('y1',(g.y-18*g.q).toFixed(2));e.setAttribute('y2',(g.y-g.ry).toFixed(2));}
      else if(e.tagName==='text'){e.setAttribute('x',(g.x-g.rx-8).toFixed(2));e.setAttribute('y',(g.y+6).toFixed(2));}
    }
    var hz=svg.querySelector('[data-hz]');if(hz){var yf=geo(7,0,k,H).y-10;hz.setAttribute('y1',yf.toFixed(2));hz.setAttribute('y2',yf.toFixed(2));}
    var pipes=svg.querySelectorAll('[data-pipe]');for(var p=0;p<pipes.length;p++){var col=+pipes[p].getAttribute('data-pipe'),pts=[];
      for(var r=0;r<=7;r++){var g2=geo(r,col,k,H);pts.push([g2.x-7*g2.q,g2.y-18*g2.q]);}
      for(var r2=7;r2>=0;r2--){var g3=geo(r2,col,k,H);pts.push([g3.x+7*g3.q,g3.y-18*g3.q]);}
      pipes[p].setAttribute('points',pts.map(function(a){return a[0].toFixed(1)+','+a[1].toFixed(1)}).join(' '));}
  }
  /* 1. Наклон планшета по прокрутке */
  var tilts=d.querySelectorAll('svg[data-tilt]');
  if(tilts.length&&!RM){
    var ticking=false;
    function frame(){ticking=false;var vh=window.innerHeight||800;
      var sy=window.pageYOffset||root.scrollTop;for(var i=0;i<tilts.length;i++){var b=tilts[i].getBoundingClientRect();var top=b.top+sy;var s=sy/(top+b.height/2);s=Math.max(0,Math.min(1,s));setPlate(tilts[i],s);}}
    function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(frame);}}
    window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);frame();
  }
  /* 2. Таблица КП ↔ лунки планшета */
  var kpt=d.querySelector('.kpt');
  if(kpt){var read=d.getElementById('plate-read'),base=read?read.textContent:'';
    var rows=kpt.querySelectorAll('.tbl__r[data-well]');
    function lit(row){for(var i=0;i<rows.length;i++){rows[i].classList.toggle('is-on',rows[i]===row);
        var w=d.getElementById(rows[i].getAttribute('data-well'));if(w)w.classList.toggle('is-on',rows[i]===row);}
      if(read)read.textContent=row?row.getAttribute('data-read'):base;}
    for(var j=0;j<rows.length;j++){(function(row){row.addEventListener('mouseenter',function(){lit(row)});row.addEventListener('focus',function(){lit(row)});
      row.addEventListener('mouseleave',function(){lit(null)});row.addEventListener('blur',function(){lit(null)});
      var w=d.getElementById(row.getAttribute('data-well'));if(w){w.addEventListener('mouseenter',function(){lit(row)});w.addEventListener('mouseleave',function(){lit(null)});}})(rows[j]);}
  }
  /* 3. Хроника: ползунок выбирает запись */
  var chron=d.querySelector('.chron');
  if(chron){var rng=chron.querySelector('input[type=range]'),items=chron.querySelectorAll('.tl>li'),out=chron.querySelector('.chron__out'),dots=chron.querySelectorAll('.cw');
    function pick(n){for(var i=0;i<items.length;i++){items[i].classList.toggle('is-on',i===n);if(dots[i])dots[i].classList.toggle('is-on',i===n);}
      if(out&&items[n])out.textContent=items[n].querySelector('.tl__d').textContent+' — '+items[n].querySelector('b').textContent;}
    if(rng){rng.addEventListener('input',function(){pick(+rng.value)});pick(+rng.value);}
    for(var q=0;q<dots.length;q++){(function(i){dots[i].addEventListener('click',function(){if(rng){rng.value=i;}pick(i);});})(q);}
  }
  /* 4. Фильтр матрицы методик по нормативному документу */
  var flt=d.querySelector('[data-filter]');
  if(flt){var fb=flt.querySelectorAll('button'),tbl=d.querySelector(flt.getAttribute('data-filter')),frows=tbl.querySelectorAll('.tbl__r'),fo=d.getElementById('filter-out');
    for(var f=0;f<fb.length;f++){(function(btn){btn.addEventListener('click',function(){var key=btn.getAttribute('data-key'),n=0;
      for(var b=0;b<fb.length;b++)fb[b].setAttribute('aria-pressed',fb[b]===btn?'true':'false');
      for(var r=0;r<frows.length;r++){var ok=key==='all'||(frows[r].getAttribute('data-norm')||'').split('|').indexOf(key)>=0;frows[r].hidden=!ok;if(ok)n++;}
      if(fo)fo.textContent=key==='all'?'Показаны все 9 методик':'Показано: '+n+' из 9 методик — '+btn.textContent;});})(fb[f]);}
  }
  /* 5. Партнёрам: «кто я» выдвигает свою карточку */
  var who=d.querySelector('.who');
  if(who){var wb=who.querySelectorAll('.seg button'),cards=who.querySelectorAll('.card');
    for(var w=0;w<wb.length;w++){(function(btn){btn.addEventListener('click',function(){var key=btn.getAttribute('data-key'),on=btn.getAttribute('aria-pressed')==='true';
      for(var b=0;b<wb.length;b++)wb[b].setAttribute('aria-pressed',(!on&&wb[b]===btn)?'true':'false');
      for(var c=0;c<cards.length;c++){var mine=cards[c].getAttribute('data-key')===key;cards[c].classList.toggle('is-on',!on&&mine);cards[c].classList.toggle('is-off',!on&&!mine);}
      if(!on){var card=who.querySelector('.card[data-key="'+key+'"]');if(card){card.setAttribute('tabindex','-1');card.focus({preventScroll:true});}}});})(wb[w]);}
  }
  /* 6. Цикл ИФА: шаги */
  var cyc=d.querySelector('.cycle');
  if(cyc){var tiles=cyc.querySelectorAll('li'),nav=d.querySelector('.cycle__nav'),cur=0;
    function go(n){cur=(n+tiles.length)%tiles.length;for(var i=0;i<tiles.length;i++)tiles[i].classList.toggle('is-on',i===cur);
      var bs=nav?nav.querySelectorAll('.seg button'):[];for(var b=0;b<bs.length;b++)bs[b].setAttribute('aria-pressed',b===cur?'true':'false');
      var co=d.getElementById('cycle-out');if(co)co.textContent=tiles[cur].querySelector('.cycle__t').textContent+' — '+tiles[cur].querySelector('.cycle__s').textContent;}
    if(nav){var sb=nav.querySelectorAll('.seg button');for(var s2=0;s2<sb.length;s2++){(function(i){sb[i].addEventListener('click',function(){go(i)});})(s2);}
      var prev=nav.querySelector('[data-prev]'),next=nav.querySelector('[data-next]');if(prev)prev.addEventListener('click',function(){go(cur-1)});if(next)next.addEventListener('click',function(){go(cur+1)});}
    for(var t=0;t<tiles.length;t++){(function(i){tiles[i].addEventListener('click',function(){go(i)});})(t);}
    go(0);
  }
  /* 7. План вакцин для кур ↔ ниппели линии поения */
  var plan=d.querySelector('.steps[data-line]');
  if(plan){var st=plan.querySelectorAll('.step[data-nip]');
    function nip(step){for(var i=0;i<st.length;i++){st[i].classList.toggle('is-on',st[i]===step);var n=d.getElementById(st[i].getAttribute('data-nip'));if(n)n.classList.toggle('is-on',st[i]===step);}}
    for(var u=0;u<st.length;u++){(function(s){s.addEventListener('mouseenter',function(){nip(s)});s.addEventListener('focus',function(){nip(s)});s.addEventListener('mouseleave',function(){nip(null)});s.addEventListener('blur',function(){nip(null)});})(st[u]);}
  }
})();
