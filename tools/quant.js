// Quantise UI screenshots to 256-colour palette PNGs in place (lossy but legible), print sizes.
const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
(async () => {
  const files = process.argv.slice(2); let before = 0, after = 0;
  for (const f of files) {
    const b = fs.statSync(f).size; before += b;
    const buf = await sharp(f).png({ palette: true, colours: 256, compressionLevel: 9, effort: 7 }).toBuffer();
    if (buf.length < b) { fs.writeFileSync(f, buf); after += buf.length; } else after += b;
  }
  console.log(`${files.length} files: ${(before/1048576).toFixed(1)} MB → ${(after/1048576).toFixed(1)} MB`);
})();
