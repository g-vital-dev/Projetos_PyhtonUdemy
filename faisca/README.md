# Faísca: jogo de cartas para casais

## O que vai para o cliente
| Entrega | Arquivo | Como o cliente usa |
|---|---|---|
| Jogo no celular | `jogo.html` (link) | Abre no navegador; botão "Instalar" põe o ícone na tela inicial e funciona offline |
| 100 cartas em PDF (4 níveis) | `downloads/faisca-cartas-para-imprimir.pdf` | Imprime frente e verso (borda longa), recorta nas marcas |
| Bônus #1 | `downloads/bonus-1-30-encontros-em-casa.pdf` | Leitura / impressão |
| Bônus #2 | `downloads/bonus-2-ritual-da-massagem.pdf` | Leitura / impressão |
| Bônus #3 | `downloads/bonus-3-bilhetes-secretos.pdf` | Imprime e recorta os bilhetes |

Na plataforma de checkout (Kiwify, Hotmart, Whop…), configure o e-mail de entrega com o link do jogo
e anexe/vincule os 4 PDFs (ou use a área de membros).

## Arquivos
- `index.html`: landing page. Preço e link do checkout no bloco `CONFIG` no fim do arquivo.
- `jogo.html` + `manifest.webmanifest` + `sw.js` + `icons/`: o jogo instalável (PWA).
- `cartas.js`: texto das cartas. `{par}` e `{voce}` viram os nomes do casal.
- `assets/carta.css` / `assets/carta.js`: design das cartas, usado no jogo, na landing e no PDF.
- `print/`: modelos dos PDFs.

## Depois de editar cartas ou bônus
```
node tools/gerar-pdfs.js     # refaz os PDFs em downloads/
node tools/gerar-icones.js   # refaz os ícones do app
```
Se mudar arquivos do jogo, troque `CACHE = "faisca-v1"` em `sw.js` (v2, v3…) para os celulares baixarem a versão nova.

## Publicar
Qualquer hospedagem estática com HTTPS (Netlify, Vercel, GitHub Pages). O botão "Instalar" e o modo offline só
funcionam em HTTPS.

## Nível Proibido (+18)
- Fica em `cartas.js` com `restrito: true`.
- No jogo, só abre depois que os dois confirmam +18, vontade e palavra de segurança.
- Na landing page aparece só trancado e desfocado, sem nenhum texto das cartas (página segura para anúncio).
- Nos anúncios, mostre apenas cartas dos níveis 1 a 3.
