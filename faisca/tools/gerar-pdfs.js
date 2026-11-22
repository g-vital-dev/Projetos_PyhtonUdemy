// node tools/gerar-pdfs.js  -> gera os PDFs de entrega em downloads/
const { chromium } = require('playwright'); const path = require('path');
const raiz = path.resolve(__dirname, '..');
const pdfs = [
  ['print/cartas.html', 'faisca-cartas-para-imprimir.pdf'],
  ['print/bonus.html#b1', 'bonus-1-30-encontros-em-casa.pdf'],
  ['print/bonus.html#b2', 'bonus-2-ritual-da-massagem.pdf'],
  ['print/bonus.html#b3', 'bonus-3-bilhetes-secretos.pdf'],
];
(async () => {
  const b = await chromium.launch();
  for (const [src, out] of pdfs) {
    const p = await b.newPage();
    await p.goto('file://' + path.join(raiz, src));
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
    await p.pdf({ path: path.join(raiz, 'downloads', out), format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log('ok', out); await p.close();
  }
  await b.close();
})();
