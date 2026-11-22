# Faísca: jogo de cartas digital para casais

- `index.html`: landing page de vendas (hero, dor, 3 níveis, demo grátis, como funciona, 2 planos, garantia, FAQ).
- `jogo.html`: o jogo entregue ao comprador (nomes do casal, nível, perguntas/desafios, timer, 3 pulos por pessoa).
- `cartas.js`: todo o conteúdo das cartas. Edite aqui; `{par}` e `{voce}` viram os nomes.

## Configurar
1. Em `index.html`, edite o bloco `CONFIG` (preços, links de checkout, e-mail).
2. No checkout (Kiwify/Hotmart/etc.), entregue:
   - Completo: `https://seudominio/jogo.html`
   - Essencial: `https://seudominio/jogo.html?plano=essencial` (mostra só níveis 1 e 2)
3. Publique a pasta em qualquer hospedagem estática (Netlify, Vercel, GitHub Pages).

Obs.: o bloqueio por plano é simples (parâmetro na URL). Para proteger de verdade, use a área de membros do checkout.
