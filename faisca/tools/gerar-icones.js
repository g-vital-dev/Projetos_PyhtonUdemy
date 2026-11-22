// node tools/gerar-icones.js  -> gera os ícones do app em icons/
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const url = 'file://' + path.resolve(__dirname, 'icone.html');
  const out = f => path.resolve(__dirname, '../icons', f);
  for (const [size, file, seal] of [[512,'icon-512.png',330],[192,'icon-192.png',330],[180,'icon-180.png',330],[512,'icon-maskable-512.png',250]]) {
    const p = await b.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: size / 512 });
    await p.goto(url + '?s=' + seal); await p.waitForTimeout(200);
    await p.screenshot({ path: out(file) }); await p.close();
  }
  await b.close();
})();
