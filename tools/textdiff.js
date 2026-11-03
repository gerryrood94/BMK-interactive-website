// usage: node textdiff.js <original.html> <candidate.html> — compares visible text after stripping tags; prints differing lines
const fs=require('fs');const strip=h=>h.replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<svg[\s\S]*?<\/svg>/gi,' ').replace(/<[^>]+>/g,'\n').replace(/&nbsp;/g,' ').split('\n').map(s=>s.replace(/\s+/g,' ').trim()).filter(Boolean);
const a=strip(fs.readFileSync(process.argv[2],'utf8')),b=strip(fs.readFileSync(process.argv[3],'utf8'));
const A=new Set(a),B=new Set(b);const onlyA=a.filter(x=>!B.has(x)),onlyB=b.filter(x=>!A.has(x));
console.log('lines original',a.length,'| candidate',b.length,'| missing from candidate',onlyA.length,'| new in candidate',onlyB.length);
onlyA.slice(0,25).forEach(x=>console.log('  - '+x.slice(0,140)));onlyB.slice(0,25).forEach(x=>console.log('  + '+x.slice(0,140)));
