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
| Galeria | `#/modelos` | 8 modelos com filtro (Infantil, 15 anos & Teen, Adulto), 3 Premium |
| Editor | `#/editor` | Formulário com **prévia ao vivo**, rascunho salvo automaticamente |
| Checkout | (modal) | Escolha de plano + Pix (QR de demonstração) ou cartão — **simulado** |
| Convite do convidado | `#/c/<código>` | Convite, contagem regressiva, mapa, agenda (.ics), compartilhar, **RSVP**, Pix para presentes |
| Painel | `#/painel` | Meus convites, estatísticas de confirmação, lista de convidados, exportar CSV, editar, excluir |
| Termos | `#/termos` | Texto provisório (LGPD / reembolso) |

### Planos (modelo de negócio)

| Plano | Preço | Inclui |
|---|---|---|
| Grátis | R$ 0 | Modelos básicos, marca d’água, mapa e agenda |
| Festa | R$ 14,90/convite | Todos os modelos, sem marca d’água, confirmação de presença, contagem regressiva |
| Festa+ | R$ 29,90/convite | Tudo do Festa + Pix e lista de presentes + exportar convidados |

O plano grátis funciona como isca: o convite circula com “feito com Convitei” e
um link “Crie o seu” — cada festa vira divulgação.

## Como o protótipo funciona por dentro

- HTML + CSS + JavaScript puro, sem dependências nem build (`index.html`, `styles.css`, `app.js`).
- Os dados do convite vão **codificados no próprio link** — por isso o link funciona em
  qualquer celular mesmo sem servidor.
- Painel, rascunho e confirmações ficam no `localStorage` do navegador.
- A confirmação também gera uma mensagem pronta para o WhatsApp do anfitrião, então
  **o anfitrião recebe as respostas de verdade** mesmo nesta versão.

## O que falta para vender de verdade

1. **Backend + banco** (sugestão: Supabase) — tabelas `usuarios`, `convites`, `confirmacoes`,
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

- Upload de foto do aniversariante no convite
- Música de fundo
- Lembrete automático para convidados 1 dia antes
- Mais modelos (chá de bebê, casamento, formatura = mais mercados com o mesmo sistema)
