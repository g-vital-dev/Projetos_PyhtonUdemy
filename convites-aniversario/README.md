# Convitei — protótipo de site de convites de aniversário

Site para **vender convites de aniversário digitais**: o cliente escolhe um modelo,
personaliza, paga (Pix ou cartão) e envia o link pelo WhatsApp. Os convidados
abrem o convite, veem contagem regressiva, mapa, salvam na agenda e confirmam presença.

## Como rodar

Não precisa instalar nada. Na pasta `convites-aniversario`:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## O que tem no protótipo

| Tela | Rota | O que faz |
|---|---|---|
| Landing page | `#/` | Hero, como funciona, recursos, **preços**, FAQ, CTA |
| Galeria | `#/modelos` | 18 modelos + **“Use a sua arte”**, filtro por categoria, selo ✨ Animado |
| Editor | `#/editor` | Formulário com **prévia ao vivo**, **foto do aniversariante**, envio de arte própria, rascunho salvo automaticamente |
| Checkout | (modal) | Escolha de plano + Pix (QR de demonstração) ou cartão — **simulado** |
| Convite do convidado | `#/c/<código>` | **Abertura de envelope animada + confete** (planos pagos), convite animado, contagem regressiva, mapa, agenda (.ics), compartilhar, **RSVP**, Pix para presentes |
| Sob medida | `#/sob-medida` | Pacotes de convite personalizado, formulário de pedido com fotos, pagamento total ou sinal de 50% (simulado), resumo do pedido para o WhatsApp |
| Encomendas | `#/encomendas` | Área do vendedor: recebido/a receber, status (novo → em produção → aguardando aprovação → entregue), prazo com alerta de atraso, WhatsApp do cliente, montar o convite online a partir do pedido |
| Painel | `#/painel` | Meus convites, estatísticas de confirmação, lista de convidados, exportar CSV, editar, excluir |
| Termos | `#/termos` | Texto provisório (LGPD / reembolso) |

### Planos (modelo de negócio)

| Plano | Preço | Inclui |
|---|---|---|
| Grátis | R$ 0 | Modelos básicos, marca d’água, mapa e agenda |
| Festa | R$ 14,90/convite | Convite animado, todos os modelos, sem marca d’água, confirmação de presença, contagem regressiva |
| Festa+ | R$ 29,90/convite | Tudo do Festa + Pix e lista de presentes + exportar convidados |

### Convite sob medida (preços sugeridos, para testar)

| Pacote | Preço | Prazo | Inclui |
|---|---|---|---|
| Personalizado | R$ 89 | 3 dias úteis | Arte exclusiva, 2 ajustes, convite online com confirmação |
| Personalizado Animado | R$ 149 | 4 dias úteis | + convite animado + vídeo de 15s para Status/Stories |
| Kit Festa Animado | R$ 249 | 5 dias úteis | + kit para imprimir (topo de bolo, tags, rótulos) e arte de painel |
| Urgência | + R$ 39 | 1 dia útil | |

Configure o número que recebe os pedidos em `CONTATO_WHATS`, no topo de `app.js`.

O plano grátis funciona como isca: o convite circula com “feito com Convitei” e
um link “Crie o seu” — cada festa vira divulgação.

## Como o protótipo funciona por dentro

- HTML + CSS + JavaScript puro, sem dependências nem build (`index.html`, `styles.css`, `app.js`).
- Os dados do convite vão **codificados no próprio link** — por isso o link funciona em
  qualquer celular mesmo sem servidor.
- Painel, rascunho e confirmações ficam no `localStorage` do navegador.
- A confirmação também gera uma mensagem pronta para o WhatsApp do anfitrião, então
  **o anfitrião recebe as respostas de verdade** mesmo nesta versão.

## Referência: FestaLab (concorrente)

- Cerca de 984 modelos infantis, com **arte ilustrada** e foto do aniversariante na maioria.
- Convite em formato de site grátis; cobram pela imagem para baixar (a partir de R$ 14,90).
- Muitos modelos usam personagens licenciados (Disney, Marvel, Bluey etc.). **Não copiamos isso**:
  usar personagens sem licença pode gerar notificação e derrubada do site.
- Temas sem personagem que aparecem entre os populares: Fazendinha, Boiadeira, Festa do Pijama,
  Fundo do Mar, Borboletas, Bruxinha e Futebol. Todos já estão aqui.

**Maior lacuna:** nossos modelos usam emojis. Para competir, os modelos de lançamento precisam de
ilustrações próprias (designer ou ilustração gerada por IA com direito de uso comercial).
O modelo “Use a sua arte” já permite subir essas artes sem mexer em código.

## O que falta para vender de verdade

1. **Backend + banco** (também tira as fotos de dentro do link, onde hoje vão comprimidas; sugestão: Supabase) — tabelas `usuarios`, `convites`, `confirmacoes`,
   `pagamentos`. Links curtos (`convitei.com.br/c/abc123`) no lugar do link com os dados.
   Hoje o plano vai dentro do link e poderia ser falsificado; no backend isso some.
2. **Login** (e-mail com link mágico ou Google) para o painel funcionar em qualquer aparelho.
3. **Pagamento real**: Mercado Pago ou Stripe (ambos têm Pix) com webhook confirmando
   o pagamento antes de liberar o plano.
4. **Domínio + hospedagem**: o site é estático, sobe direto no Netlify/Vercel/Cloudflare Pages.
5. **Imagem de prévia no WhatsApp** (Open Graph) por convite — aumenta muito o clique.
6. **Termos de uso e política de privacidade** revisados (LGPD), CNPJ/MEI e emissão de nota.
7. Analytics + pixel de anúncios (Meta/Google) para medir conversão.

## Próximas ideias de produto

- Música de fundo
- Lembrete automático para convidados 1 dia antes
- Mais modelos (chá de bebê, casamento, formatura = mais mercados com o mesmo sistema)
