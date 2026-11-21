/* Convitei — protótipo de site de convites de aniversário.
   SPA em JavaScript puro com roteamento por hash. Sem backend: os dados do
   convite vão codificados no próprio link, e o painel usa localStorage. */
(() => {
  'use strict';

  // ---------- Catálogo ----------
  const PLANS = {
    gratis: {
      id: 'gratis', nome: 'Grátis', preco: 0,
      desc: 'Modelos básicos, com marca d’água',
      recursos: { premium: false, rsvp: false, countdown: false, agenda: true, semMarca: false, pix: false, anim: false },
    },
    festa: {
      id: 'festa', nome: 'Festa', preco: 14.9,
      desc: 'Convite animado, todos os modelos, confirmação de presença e contagem regressiva',
      recursos: { premium: true, rsvp: true, countdown: true, agenda: true, semMarca: true, pix: false, anim: true },
    },
    festaplus: {
      id: 'festaplus', nome: 'Festa+', preco: 29.9,
      desc: 'Tudo do Festa + Pix para presentes, lista de presentes e exportar convidados',
      recursos: { premium: true, rsvp: true, countdown: true, agenda: true, semMarca: true, pix: true, anim: true },
    },
  };

  const CATS = ['Todos', 'Infantil', '15 anos & Teen', 'Adulto'];

  const POS = [ // [top%, left%, tamanho cqw, rotação]
    [3, 4, 12, -15], [4, 80, 13, 18], [80, 3, 13, 12], [82, 80, 14, -12],
    [40, -3, 9, -20], [44, 88, 9, 25], [92, 44, 8, 0],
  ];

  const TEMPLATES = [
    { id: 'arte', nome: 'Use a sua arte', cat: 'Sua arte', premium: false, pre: '', swatch: 'repeating-linear-gradient(45deg,#f4eee8 0 6px,#fff 6px 12px)', icon: '🖼️', decos: [] },
    { id: 'safari', nome: 'Safari Selvagem', cat: 'Infantil', premium: false, pre: 'Venha para a aventura de', swatch: '#f6d58e', icon: '🦁', decos: ['🌿', '🦒', '🌴', '🐘', '🦓', '🐒', '🍃'] },
    { id: 'unicornio', nome: 'Unicórnio Mágico', cat: 'Infantil', premium: false, pre: 'Um dia mágico para', swatch: '#e6d0ff', icon: '🦄', decos: ['✨', '🌈', '⭐', '🦄', '💖', '🎀', '✨'] },
    { id: 'futebol', nome: 'Craque da Festa', cat: 'Infantil', premium: false, pre: 'Entre em campo com', swatch: '#2e9a4a', icon: '⚽', decos: ['⚽', '🏆', '🥅', '⭐', '👟', '🎉', '⚽'] },
    { id: 'dino', nome: 'Dinossauros', cat: 'Infantil', premium: false, pre: 'Uma festa jurássica para', swatch: '#bfe3a5', icon: '🦖', decos: ['🦕', '🌋', '🦖', '🌿', '🥚', '🌴', '🍃'] },
    { id: 'mar', nome: 'Fundo do Mar', cat: 'Infantil', premium: false, pre: 'Mergulhe na festa de', swatch: '#7fd3f0', icon: '🐠', decos: ['🐠', '🐙', '🫧', '🐚', '🐢', '🐳', '🫧'] },
    { id: 'borboletas', nome: 'Borboletas', cat: 'Infantil', premium: false, pre: 'Voe até a festa de', swatch: '#ffe0ef', icon: '🦋', decos: ['🦋', '🌸', '🦋', '🌼', '✨', '🦋', '🌷'] },
    { id: 'corrida', nome: 'Corrida Radical', cat: 'Infantil', premium: false, pre: 'Acelere até a festa de', swatch: '#ff4d3d', icon: '🏎️', decos: ['🏎️', '🏁', '🏆', '🚦', '⭐', '🏁', '💨'] },
    { id: 'fazendinha', nome: 'Fazendinha', cat: 'Infantil', premium: false, pre: 'Vai ter festa na fazendinha de', swatch: '#cfe9ff', icon: '🐄', decos: ['🐄', '🐷', '🌻', '🚜', '🐑', '🐔', '🌾'] },
    { id: 'pijama', nome: 'Festa do Pijama', cat: 'Infantil', premium: false, pre: 'Traga o travesseiro! Festa do pijama de', swatch: '#ffe6f0', icon: '🧸', decos: ['🌙', '🧸', '🍿', '⭐', '💤', '🦄', '🍭'] },
    { id: 'bruxinha', nome: 'Bruxinha', cat: 'Infantil', premium: false, pre: 'Uma festa mágica e assustadora de', swatch: '#ff9f43', icon: '🎃', decos: ['🎃', '🦇', '🧹', '👻', '🕸️', '🌙', '🍬'] },
    { id: 'castelo', nome: 'Reino Encantado', cat: 'Infantil', premium: true, pre: 'Você está convidado ao reino de', swatch: '#f9d9ff', icon: '👑', decos: ['👑', '🏰', '✨', '💎', '🌟', '🎀', '✨'] },
    { id: 'heroi', nome: 'Super-Herói', cat: 'Infantil', premium: true, pre: 'Missão especial: festa de', swatch: '#1f4fd1', icon: '🦸', decos: ['💥', '⚡', '🦸', '⭐', '🛡️', '💫', '⚡'] },
    { id: 'espaco', nome: 'Viagem ao Espaço', cat: 'Infantil', premium: true, pre: 'Missão aniversário de', swatch: '#2a1f6b', icon: '🚀', decos: ['🚀', '🪐', '⭐', '🌙', '👽', '☄️', '✨'] },
    { id: 'boiadeira', nome: 'Boiadeira', cat: '15 anos & Teen', premium: true, pre: 'Aniversário da boiadeira', swatch: '#f7c6d2', icon: '🤠', decos: ['🤠', '👢', '🎸', '⭐', '🌵', '💗', '🐴'] },
    { id: 'floral', nome: 'Jardim Floral', cat: '15 anos & Teen', premium: false, pre: 'Celebre comigo', swatch: '#ffd9df', icon: '🌸', decos: ['🌸', '🌷', '🌿', '🌺', '🍃', '🌸', '🌼'] },
    { id: 'neon', nome: 'Neon Party', cat: '15 anos & Teen', premium: true, pre: 'Bora pra festa de', swatch: '#120b25', icon: '🪩', decos: ['🪩', '🎶', '✨', '🎧', '💜', '⚡', '🎵'] },
    { id: 'dourado', nome: 'Gold Elegance', cat: 'Adulto', premium: true, pre: 'Você é meu convidado especial', swatch: '#111111', icon: '🥂', decos: [] },
    { id: 'confete', nome: 'Confete Clássico', cat: 'Adulto', premium: false, pre: 'Vamos comemorar', swatch: '#ffffff', icon: '🎉', decos: [] },
  ];
  // Número que recebe as encomendas (só dígitos, com DDI). Ex.: '5511999998888'
  const CONTATO_WHATS = '';

  const PACOTES = {
    digital: {
      id: 'digital', nome: 'Personalizado', preco: 89, prazo: 3,
      itens: ['Arte exclusiva feita por designer', '2 rodadas de ajustes', 'Convite online com confirmação de presença', 'Imagem para enviar no WhatsApp'],
    },
    animado: {
      id: 'animado', nome: 'Personalizado Animado', preco: 149, prazo: 4, destaque: true,
      itens: ['Tudo do Personalizado', 'Convite online animado com abertura de envelope', 'Vídeo de 15s com música para Status e Stories', '2 rodadas de ajustes'],
    },
    kit: {
      id: 'kit', nome: 'Kit Festa Animado', preco: 249, prazo: 5,
      itens: ['Tudo do Personalizado Animado', 'Kit para imprimir: topo de bolo, tags e rótulos (PDF)', 'Arte para painel ou banner', '3 rodadas de ajustes'],
    },
  };
  const URGENCIA = 39;
  const STATUS = {
    novo: '🆕 Novo', producao: '🎨 Em produção', aprovacao: '👀 Aguardando aprovação', entregue: '✅ Entregue',
  };

  const tplById = (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];

  const SAMPLES = [
    { id: 'demo1', tpl: 'safari', nome: 'Theo', idade: '5', data: nextDate(25), hora: '15:00', local: 'Buffet Pequenos Exploradores', endereco: 'Av. Paulista, 1000 - São Paulo, SP', msg: 'Traga seu espírito aventureiro!', plano: 'festa' },
    { id: 'demo2', tpl: 'neon', nome: 'Júlia', idade: '15', data: nextDate(40), hora: '21:00', local: 'Espaço Lumière', endereco: 'Rua Augusta, 500 - São Paulo, SP', msg: 'Dress code: brilho!', plano: 'festa' },
    { id: 'demo3', tpl: 'dourado', nome: 'Carlos', idade: '40', data: nextDate(60), hora: '20:00', local: 'Restaurante Villa', endereco: 'Rua Oscar Freire, 200 - São Paulo, SP', msg: 'Um brinde aos 40 com quem faz parte da minha história.', plano: 'festaplus' },
  ];

  // ---------- Utilidades ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const app = $('#app');

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function nextDate(days) {
    const d = new Date(); d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }
  function uid() { return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4); }
  const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  function eventDate(d) {
    if (!d.data) return null;
    const dt = new Date(`${d.data}T${d.hora || '00:00'}:00`);
    return isNaN(dt) ? null : dt;
  }
  function fmtDate(d, long = false) {
    const dt = eventDate(d);
    if (!dt) return 'Data a definir';
    const opts = long ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } : { weekday: 'short', day: 'numeric', month: 'long' };
    let s = dt.toLocaleDateString('pt-BR', opts).replace('.', '');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function fmtHour(d) {
    if (!d.hora) return '';
    const [h, m] = d.hora.split(':');
    return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`;
  }

  // Codifica o convite no link (base64 url-safe com suporte a acentos)
  function encode(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let bin = ''; bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decode(str) {
    let s = str.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  const baseUrl = () => location.href.split('#')[0];
  const inviteUrl = (inv) => `${baseUrl()}#/c/${encode(inv)}`;

  // localStorage protegido
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem('convitei:' + key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    },
    set(key, val) { try { localStorage.setItem('convitei:' + key, JSON.stringify(val)); } catch { /* sem storage */ } },
    del(key) { try { localStorage.removeItem('convitei:' + key); } catch { /* sem storage */ } },
  };
  const getInvites = () => store.get('invites', []);
  const saveInvites = (list) => store.set('invites', list);
  const getRsvps = (id) => store.get('rsvp:' + id, []);
  const getOrders = () => store.get('orders', []);
  const saveOrders = (list) => { try { localStorage.setItem('convitei:orders', JSON.stringify(list)); return true; } catch { return false; } };

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2600);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('Link copiado!'); }
    catch {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('Link copiado!'); } catch { toast('Não foi possível copiar'); }
      ta.remove();
    }
  }

  // ---------- Modal ----------
  const modal = $('#modal');
  function openModal(html) {
    $('#modal-content').innerHTML = html;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const f = modal.querySelector('input, button:not(.modal-x), a'); if (f) f.focus();
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; }
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  // ---------- Cartão do convite ----------
  function decoHTML(t) {
    if (t.id === 'confete') {
      const colors = ['#ff5a7a', '#7c5cff', '#ffc845', '#2ec4b6', '#ff8c42'];
      let s = ''; let seed = 7;
      const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
      for (let i = 0; i < 46; i++) {
        const x = rnd() * 100, y = rnd() * 100;
        if (x > 14 && x < 86 && y > 12 && y < 88) continue; // deixa o centro limpo
        const c = colors[i % colors.length];
        s += rnd() > .5
          ? `<circle cx="${x}" cy="${y}" r="${1 + rnd() * 1.6}" fill="${c}"/>`
          : `<rect x="${x}" y="${y}" width="3" height="1.4" fill="${c}" transform="rotate(${rnd() * 180} ${x} ${y})"/>`;
      }
      return `<svg class="deco" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${s}</svg>`;
    }
    if (t.id === 'dourado') {
      return `<svg class="deco" viewBox="0 0 100 146" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="g-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1c1"/><stop offset=".5" stop-color="#c99a2e"/><stop offset="1" stop-color="#8a6416"/></linearGradient></defs>
        <rect x="5" y="5" width="90" height="136" fill="none" stroke="url(#g-gold)" stroke-width=".8"/>
        <rect x="7.5" y="7.5" width="85" height="131" fill="none" stroke="url(#g-gold)" stroke-width=".3"/>
        <path d="M30 18 H70 M38 21 H62 M30 128 H70 M38 125 H62" stroke="url(#g-gold)" stroke-width=".5"/>
      </svg>`;
    }
    const extra = t.id === 'neon'
      ? `<svg class="deco" viewBox="0 0 100 146" preserveAspectRatio="none" aria-hidden="true"><rect x="4" y="4" width="92" height="138" rx="6" fill="none" stroke="#4ff0ff" stroke-width=".7" style="filter:drop-shadow(0 0 1.5px #4ff0ff)"/></svg>`
      : t.id === 'espaco'
        ? `<svg class="deco" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 37) % 100}" cy="${(i * 53) % 100}" r="${(i % 3) * .25 + .2}" fill="#fff" opacity=".8"/>`).join('')}</svg>`
        : '';
    const items = t.decos.map((e, i) => {
      const [top, left, size, rot] = POS[i % POS.length];
      return `<span style="position:absolute;top:${top}%;left:${left}%;font-size:${size}cqw;--r:${rot}deg;transform:rotate(var(--r));animation-delay:${(i * 0.37).toFixed(2)}s">${e}</span>`;
    }).join('');
    return `${extra}<div class="deco" aria-hidden="true">${items}</div>`;
  }

  // Só aceita imagens embutidas (data:image) para evitar conteúdo malicioso vindo de links
  const safeImg = (src) => typeof src === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(src);

  function cardHTML(d, opts = {}) {
    const t = tplById(d.tpl);
    const plan = PLANS[d.plano] || PLANS.gratis;
    const hour = fmtHour(d);
    const anim = opts.anim && plan.recursos.anim;
    const wm = plan.recursos.semMarca ? '' : '<div class="wm">feito com Convitei</div>';
    if (t.id === 'arte') {
      return `<div class="card-wrap"><div class="invite t-arte${anim ? ' anim' : ''}">
        ${safeImg(d.arte) ? `<img class="arte-img" src="${esc(d.arte)}" alt="Convite de ${esc(d.nome || 'aniversário')}">`
          : '<div class="arte-empty"><b>SUA ARTE AQUI</b><span>Envie a imagem do convite</span><span class="plus">+</span></div>'}
        ${wm}</div></div>`;
    }
    const foto = safeImg(d.foto) ? `<div class="photo"><img src="${esc(d.foto)}" alt="Foto de ${esc(d.nome)}"></div>` : '';
    return `<div class="card-wrap"><div class="invite t-${t.id}${anim ? ' anim' : ''}${foto ? ' has-photo' : ''}">
      ${decoHTML(t)}
      <div class="pre">${esc(d.pre || t.pre)}</div>
      ${foto}
      <div class="name">${esc(d.nome || 'Nome')}</div>
      ${d.idade ? `<div class="age">${esc(d.idade)}<small>${d.idade === '1' ? 'aninho' : 'anos'}</small></div>` : ''}
      ${d.msg ? `<p class="msg">${esc(d.msg)}</p>` : ''}
      <div class="info">
        <span class="date">${esc(fmtDate(d))}</span>${hour ? ` às ${esc(hour)}` : ''}
        ${d.local ? `<span class="place">📍 ${esc(d.local)}</span>` : ''}
      </div>
      ${wm}
    </div></div>`;
  }

  // ---------- Páginas ----------
  function pageHome() {
    const p = PLANS;
    return `
    <section class="hero"><div class="container hero-grid">
      <div>
        <span class="eyebrow">🎈 Convites digitais em 5 minutos</span>
        <h1>O convite de aniversário que seus convidados vão amar abrir</h1>
        <p class="lead">Escolha um modelo, personalize com nome, idade e local e envie pelo WhatsApp. Os convidados confirmam presença com um toque — e você acompanha tudo num só lugar.</p>
        <div class="hero-cta">
          <a href="#/editor" class="btn btn-primary">Criar meu convite grátis</a>
          <a href="${esc(inviteUrl(SAMPLES[0]))}" class="btn">Ver um convite pronto</a>
        </div>
        <ul class="hero-points"><li>Sem instalar nada</li><li>Confirmação de presença</li><li>Pagamento via Pix</li></ul>
      </div>
      <div class="hero-visual">${SAMPLES.map((d) => cardHTML(d, { anim: true })).join('')}</div>
    </div></section>

    <section style="background:var(--surface)"><div class="container">
      <h2 class="center">Como funciona</h2>
      <p class="center muted">Do modelo ao WhatsApp dos convidados em três passos.</p>
      <div class="steps">
        <div class="step"><div class="step-n">1</div><h3>Escolha o modelo</h3><p class="muted">Temas infantis, 15 anos e adultos, prontos para celular.</p></div>
        <div class="step"><div class="step-n">2</div><h3>Personalize</h3><p class="muted">Nome, idade, data, local e uma mensagem especial. Veja o resultado ao vivo.</p></div>
        <div class="step"><div class="step-n">3</div><h3>Envie e acompanhe</h3><p class="muted">Compartilhe o link e receba as confirmações de presença.</p></div>
      </div>
    </div></section>

    <section><div class="container">
      <div class="dash-head"><div><h2>Modelos em destaque</h2><p class="muted">Toque em um modelo para começar a editar.</p></div><a href="#/modelos" class="btn">Ver todos os modelos</a></div>
      <div class="gallery">${TEMPLATES.filter((t) => t.id !== 'arte').slice(0, 4).map(tplItem).join('')}</div>
    </div></section>

    <section style="background:var(--surface)"><div class="container">
      <h2 class="center">Tudo o que a festa precisa</h2>
      <div class="features">
        <div class="feature"><div class="ico">✅</div><h3>Confirmação de presença</h3><p>Convidados respondem quantos adultos e crianças vão.</p></div>
        <div class="feature"><div class="ico">⏳</div><h3>Contagem regressiva</h3><p>Aquele gostinho de expectativa até o grande dia.</p></div>
        <div class="feature"><div class="ico">🗺️</div><h3>Mapa e agenda</h3><p>Um toque abre o GPS ou salva a festa na agenda.</p></div>
        <div class="feature"><div class="ico">💬</div><h3>Feito para WhatsApp</h3><p>Link leve que abre rápido em qualquer celular.</p></div>
        <div class="feature"><div class="ico">🎁</div><h3>Pix para presentes</h3><p>Lista de sugestões e chave Pix na página do convite.</p></div>
        <div class="feature"><div class="ico">📋</div><h3>Lista de convidados</h3><p>Veja quem vai e exporte a lista para o buffet.</p></div>
      </div>
    </div></section>

    <section><div class="container showcase">
      <div>
        <span class="eyebrow">✨ Novo</span>
        <h2>Convites animados que abrem como um envelope</h2>
        <p class="muted">O convidado toca no envelope, ele abre com confete e o convite ganha vida: personagens flutuando, nome surgindo e contagem regressiva. Incluído nos planos Festa e Festa+.</p>
        <div class="hero-cta"><a href="${esc(inviteUrl(SAMPLES[1]))}" class="btn btn-primary">Ver convite animado</a><a href="#/modelos" class="btn">Ver modelos</a></div>
      </div>
      <div class="showcase-card">${cardHTML(SAMPLES[0], { anim: true })}</div>
    </div></section>

    <section style="background:var(--surface)"><div class="container showcase reverse">
      <div class="showcase-card">${cardHTML({ ...SAMPLES[2], tpl: 'castelo', nome: 'Helena', idade: '4', msg: 'Arte exclusiva feita para você' }, { anim: true })}</div>
      <div>
        <span class="eyebrow">🎨 Sob medida</span>
        <h2>Quer um convite único? A gente cria para você</h2>
        <p class="muted">Conte o tema, as cores e mande uma foto. Um designer cria a arte exclusiva, você aprova e recebe o convite online animado e o vídeo para o Status, a partir de ${brl(PACOTES.digital.preco)}.</p>
        <div class="hero-cta"><a href="#/sob-medida" class="btn btn-primary">Encomendar convite personalizado</a></div>
      </div>
    </div></section>

    <section id="precos"><div class="container">
      <h2 class="center">Preços simples, por festa</h2>
      <p class="center muted">Pague uma vez por convite. Sem assinatura, sem surpresa. Quer arte exclusiva? <a href="#/sob-medida">Veja o sob medida</a>.</p>
      <div class="pricing">
        ${planCard(p.gratis, ['1 convite', 'Modelos básicos', 'Link para WhatsApp', 'Mapa e agenda'], ['Convite animado', 'Confirmação de presença', 'Sem marca d’água'])}
        ${planCard(p.festa, ['Convite animado ✨', 'Todos os modelos', 'Sem marca d’água', 'Confirmação de presença', 'Contagem regressiva', 'Mapa e agenda'], ['Pix para presentes'], true)}
        ${planCard(p.festaplus, ['Tudo do plano Festa', 'Pix para presentes', 'Lista de presentes', 'Exportar convidados (CSV)', 'Suporte prioritário'], [])}
      </div>
    </div></section>

    <section id="faq" style="background:var(--surface)"><div class="container">
      <h2 class="center">Dúvidas frequentes</h2>
      <div class="faq">
        <details><summary>Preciso baixar algum aplicativo?</summary><p>Não. Você cria pelo navegador e seus convidados abrem o link direto no WhatsApp, sem instalar nada.</p></details>
        <details><summary>Posso editar depois de enviar?</summary><p>Sim. Pelo painel “Meus convites” você altera dados como horário ou endereço quando precisar.</p></details>
        <details><summary>Como recebo as confirmações?</summary><p>Cada confirmação aparece no seu painel e você também pode recebê-las pelo WhatsApp.</p></details>
        <details><summary>Quais formas de pagamento?</summary><p>Pix (aprovação na hora) e cartão de crédito.</p></details>
        <details><summary>Até quando o convite fica no ar?</summary><p>O link fica ativo até 30 dias depois da data da festa.</p></details>
      </div>
    </div></section>

    <section><div class="container"><div class="cta-band">
      <h2>Bora começar a festa? 🎂</h2>
      <p>Crie grátis e só pague se quiser os recursos completos.</p>
      <a href="#/editor" class="btn">Criar meu convite</a>
    </div></div></section>`;
  }

  function planCard(plan, yes, no, featured = false) {
    return `<div class="plan ${featured ? 'featured' : ''}">
      ${featured ? '<span class="tag">Mais escolhido</span>' : ''}
      <h3>${plan.nome}</h3>
      <p class="muted small">${esc(plan.desc)}</p>
      <div class="price">${plan.preco ? brl(plan.preco) : 'R$ 0'}<small>${plan.preco ? ' /convite' : ''}</small></div>
      <ul>${yes.map((x) => `<li>${x}</li>`).join('')}${no.map((x) => `<li class="no">${x}</li>`).join('')}</ul>
      <a href="#/editor?plano=${plan.id}" class="btn ${featured ? 'btn-primary' : ''} btn-block">${plan.preco ? 'Escolher ' + plan.nome : 'Começar grátis'}</a>
    </div>`;
  }

  function tplItem(t) {
    const demo = { tpl: t.id, nome: t.cat === 'Adulto' ? 'Marina' : t.cat === 'Infantil' ? 'Lucas' : 'Sofia', idade: t.cat === 'Adulto' ? '30' : t.cat === 'Infantil' ? '6' : '15', data: nextDate(30), hora: '16:00', local: 'Salão de Festas', plano: 'festa' };
    if (t.id === 'arte') demo.plano = 'gratis';
    return `<a href="#/editor?tpl=${t.id}" class="tpl-item" style="text-decoration:none">
      ${t.id === 'arte' ? '' : '<span class="ribbon">✨ Animado</span>'}${cardHTML(demo)}
      <div class="tpl-meta"><strong>${esc(t.nome)}</strong><span class="badge ${t.premium ? 'badge-premium' : ''}">${t.premium ? '★ Premium' : t.cat}</span></div>
    </a>`;
  }

  function pageModelos(q) {
    const cat = CATS.includes(q.get('cat')) ? q.get('cat') : 'Todos';
    const list = [tplById('arte'), ...TEMPLATES.filter((t) => t.id !== 'arte' && (cat === 'Todos' || t.cat === cat))];
    return `<section><div class="container">
      <h1>Modelos de convite</h1>
      <p class="muted">Todos os modelos funcionam no celular e podem ser personalizados. Modelos ★ Premium estão nos planos Festa e Festa+, e nesses planos todos os modelos são ✨ animados. Não achou o tema? <a href="#/sob-medida">Peça um convite sob medida</a>.</p>
      <div class="filters">${CATS.map((c) => `<a class="chip ${c === cat ? 'active' : ''}" href="#/modelos?cat=${encodeURIComponent(c)}">${c}</a>`).join('')}</div>
      <div class="gallery">${list.map(tplItem).join('')}</div>
    </div></section>`;
  }

  // ---------- Editor ----------
  const FIELDS = ['tpl', 'nome', 'idade', 'pre', 'msg', 'data', 'hora', 'local', 'endereco', 'whats', 'pix', 'presentes'];
  let draft = null;

  function pageEditor(q) {
    const editId = q.get('edit');
    const existing = editId ? getInvites().find((i) => i.id === editId) : null;
    draft = existing ? { ...existing } : { ...store.get('draft', {}) };
    if (!draft.tpl) draft.tpl = 'safari';
    if (q.get('tpl')) draft.tpl = tplById(q.get('tpl')).id;
    if (q.get('plano') && PLANS[q.get('plano')]) draft.planoDesejado = q.get('plano');
    const pedido = q.get('pedido') && getOrders().find((o) => o.id === q.get('pedido'));
    if (pedido && !existing) {
      Object.assign(draft, { nome: pedido.festa.aniversariante, idade: pedido.festa.idade, data: pedido.festa.data, whats: pedido.cliente.whats, planoDesejado: 'festa' });
    }
    if (!draft.data) draft.data = nextDate(21);
    if (!draft.hora) draft.hora = '16:00';
    const v = (k) => esc(draft[k] || '');

    return `<div class="container editor">
      <form class="panel" id="editor-form" novalidate>
        <h2>${existing ? 'Editar convite' : 'Crie seu convite'}</h2>
        <p class="muted small">Tudo o que você digita aparece na prévia ao lado.</p>

        <div class="section-title">1. Modelo</div>
        <div class="tpl-picker" role="radiogroup" aria-label="Modelo">
          ${TEMPLATES.map((t) => `<button type="button" class="tpl-swatch ${t.id === draft.tpl ? 'active' : ''}" data-tpl="${t.id}" style="background:${t.swatch}" title="${esc(t.nome)}${t.premium ? ' (Premium)' : ''}" role="radio" aria-checked="${t.id === draft.tpl}">${t.icon}${t.premium ? '<span class="lock">★</span>' : ''}</button>`).join('')}
        </div>
        <input type="hidden" name="tpl" value="${v('tpl')}">

        <div class="field" id="fld-arte">
          <label for="f-arte">Imagem do seu convite</label>
          <input id="f-arte" type="file" accept="image/*">
          <span class="hint">Já tem a arte pronta (ou fez com a gente no sob medida)? Envie aqui e ganhe a página com confirmação de presença, mapa e contagem regressiva.</span>
        </div>

        <div class="section-title">2. Aniversariante</div>
        <div class="row">
          <div class="field"><label for="f-nome">Nome *</label><input id="f-nome" name="nome" maxlength="24" required value="${v('nome')}" placeholder="Ex.: Theo"></div>
          <div class="field"><label for="f-idade">Idade</label><input id="f-idade" name="idade" inputmode="numeric" maxlength="3" value="${v('idade')}" placeholder="Ex.: 5"></div>
        </div>
        <div class="field" id="fld-foto">
          <label for="f-foto">Foto do aniversariante</label>
          <div class="photo-row"><input id="f-foto" type="file" accept="image/*"><button type="button" class="btn btn-sm btn-ghost" id="foto-del" ${draft.foto ? '' : 'hidden'}>Remover</button></div>
          <span class="hint">Opcional. Aparece em destaque no convite.</span>
        </div>
        <div class="field"><label for="f-pre">Frase de abertura</label><input id="f-pre" name="pre" maxlength="40" value="${v('pre')}" placeholder="${esc(tplById(draft.tpl).pre)}"></div>
        <div class="field"><label for="f-msg">Mensagem</label><textarea id="f-msg" name="msg" maxlength="140" placeholder="Ex.: Venha brincar e comer muito bolo!">${v('msg')}</textarea><span class="hint">Até 140 caracteres.</span></div>

        <div class="section-title">3. Quando e onde</div>
        <div class="row">
          <div class="field"><label for="f-data">Data *</label><input id="f-data" type="date" name="data" required value="${v('data')}"></div>
          <div class="field"><label for="f-hora">Horário</label><input id="f-hora" type="time" name="hora" value="${v('hora')}"></div>
        </div>
        <div class="field"><label for="f-local">Nome do local</label><input id="f-local" name="local" maxlength="40" value="${v('local')}" placeholder="Ex.: Buffet Alegria"></div>
        <div class="field"><label for="f-end">Endereço</label><input id="f-end" name="endereco" maxlength="120" value="${v('endereco')}" placeholder="Rua, número, bairro, cidade"><span class="hint">Usado para abrir o mapa.</span></div>

        <div class="section-title">4. Confirmações e presentes</div>
        <div class="field"><label for="f-whats">Seu WhatsApp</label><input id="f-whats" name="whats" inputmode="tel" maxlength="20" value="${v('whats')}" placeholder="(11) 99999-9999"><span class="hint">Recebe as confirmações de presença (planos Festa e Festa+).</span></div>
        <div class="field"><label for="f-pix">Chave Pix para presentes</label><input id="f-pix" name="pix" maxlength="80" value="${v('pix')}" placeholder="E-mail, celular ou chave aleatória"><span class="hint">Só no plano Festa+.</span></div>
        <div class="field"><label for="f-pres">Sugestões de presente</label><textarea id="f-pres" name="presentes" maxlength="300" placeholder="Uma sugestão por linha">${v('presentes')}</textarea><span class="hint">Só no plano Festa+.</span></div>
      </form>

      <div class="preview-col">
        <div id="preview"></div>
        <div class="editor-actions">
          <button class="btn btn-primary" id="btn-publish">${existing ? 'Salvar alterações' : 'Publicar convite'}</button>
          <button class="btn" id="btn-anim" type="button">▶ Ver animação</button>
          <button class="btn btn-ghost" id="btn-reset" type="button">Limpar</button>
        </div>
        <p class="muted small center" id="tpl-label"></p>
      </div>
    </div>`;
  }

  function bindEditor(q) {
    const form = $('#editor-form');
    const editing = !!q.get('edit');
    const render = (anim = false) => {
      const t = tplById(draft.tpl);
      const previewPlan = draft.plano || (t.premium ? 'festa' : (draft.planoDesejado || 'gratis'));
      $('#preview').innerHTML = cardHTML({ ...draft, plano: anim ? (PLANS[previewPlan].recursos.anim ? previewPlan : 'festa') : previewPlan }, { anim });
      $('#tpl-label').textContent = `Modelo: ${t.nome}${t.premium ? ' · ★ Premium' : ''}`;
      $('#f-pre').placeholder = t.pre;
      if (!editing) store.set('draft', draft);
    };
    form.addEventListener('input', (e) => {
      if (e.target.name) { draft[e.target.name] = e.target.value; render(); }
    });
    form.addEventListener('submit', (e) => e.preventDefault());
    $('#btn-anim').addEventListener('click', () => { render(true); toast('Prévia da animação (planos Festa e Festa+)'); });
    const sync = () => {
      const arte = draft.tpl === 'arte';
      $('#fld-arte').hidden = !arte;
      $('#fld-foto').hidden = arte;
      $('#foto-del').hidden = !draft.foto;
    };
    $$('.tpl-swatch', form).forEach((b) => b.addEventListener('click', () => {
      draft.tpl = b.dataset.tpl;
      $$('.tpl-swatch', form).forEach((x) => { x.classList.toggle('active', x === b); x.setAttribute('aria-checked', x === b); });
      sync(); render();
    }));
    // Imagens vão comprimidas para caber no link (no produto final, vão para o servidor)
    const loadImg = async (input, key, max, q) => {
      const file = input.files[0]; if (!file) return;
      if (!file.type.startsWith('image/')) { toast('Escolha um arquivo de imagem'); return; }
      try { draft[key] = await resizeImage(file, max, q); sync(); render(); } catch { toast('Não conseguimos ler essa imagem'); }
    };
    $('#f-foto').addEventListener('change', (e) => loadImg(e.target, 'foto', 320, 0.72));
    $('#f-arte').addEventListener('change', (e) => loadImg(e.target, 'arte', 640, 0.7));
    $('#foto-del').addEventListener('click', () => { draft.foto = undefined; $('#f-foto').value = ''; sync(); render(); });
    sync();
    $('#btn-reset').addEventListener('click', () => {
      if (!confirm('Apagar tudo o que foi preenchido?')) return;
      store.del('draft'); draft = { tpl: draft.tpl, data: nextDate(21), hora: '16:00' };
      FIELDS.forEach((k) => { const el = form.elements[k]; if (el && k !== 'tpl') el.value = draft[k] || ''; });
      render();
    });
    $('#btn-publish').addEventListener('click', () => {
      if (!draft.nome || !draft.nome.trim()) { toast('Preencha o nome do aniversariante'); $('#f-nome').focus(); return; }
      if (!draft.data) { toast('Escolha a data da festa'); $('#f-data').focus(); return; }
      if (draft.tpl === 'arte' && !safeImg(draft.arte)) { toast('Envie a imagem do seu convite'); $('#f-arte').focus(); return; }
      if (editing) {
        const list = getInvites().map((i) => (i.id === draft.id ? { ...draft } : i));
        saveInvites(list);
        showPublished(draft, true);
      } else {
        openCheckout();
      }
    });
    render();
  }

  // ---------- Checkout (simulado) ----------
  function openCheckout() {
    const t = tplById(draft.tpl);
    const initial = draft.planoDesejado && !(t.premium && draft.planoDesejado === 'gratis') ? draft.planoDesejado : (t.premium ? 'festa' : 'festa');
    openModal(`
      <h2 id="modal-title">Escolha seu plano</h2>
      <p class="muted small">Convite de <b>${esc(draft.nome)}</b> · modelo ${esc(t.nome)}</p>
      <form id="checkout">
        <div class="plan-options">
          ${Object.values(PLANS).map((p) => {
            const disabled = p.id === 'gratis' && t.premium;
            return `<label class="plan-opt" style="${disabled ? 'opacity:.5' : ''}">
              <input type="radio" name="plano" value="${p.id}" ${p.id === initial ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
              <div><div class="p-name">${p.nome}</div><div class="p-desc">${disabled ? 'Indisponível para modelos Premium' : esc(p.desc)}</div></div>
              <div class="p-price">${p.preco ? brl(p.preco) : 'Grátis'}</div>
            </label>`;
          }).join('')}
        </div>
        <div id="pay-area"></div>
      </form>
      <p class="notice small" style="margin-top:14px">🔒 Protótipo: o pagamento é simulado. Nenhuma cobrança é feita.</p>`);

    const form = $('#checkout');
    const payArea = $('#pay-area');
    let method = 'pix';
    const renderPay = () => {
      const plan = PLANS[form.elements.plano.value];
      if (!plan.preco) {
        payArea.innerHTML = `<button type="button" class="btn btn-primary btn-block" id="pay-go">Publicar grátis</button>`;
      } else {
        const pixCode = `00020126580014BR.GOV.BCB.PIX0136convitei-demo-${draft.nome}5204000053039865406${plan.preco.toFixed(2)}5802BR`;
        payArea.innerHTML = `
          <div class="pay-tabs">
            <button type="button" class="chip ${method === 'pix' ? 'active' : ''}" data-m="pix">Pix</button>
            <button type="button" class="chip ${method === 'cartao' ? 'active' : ''}" data-m="cartao">Cartão</button>
          </div>
          ${method === 'pix' ? `
            <div class="pix-box">
              ${fakeQR(pixCode)}
              <p class="small muted">Escaneie com o app do seu banco ou copie o código</p>
              <div class="copy-row"><input readonly value="${esc(pixCode)}" aria-label="Código Pix copia e cola"><button type="button" class="btn btn-sm" id="copy-pix">Copiar</button></div>
            </div>` : `
            <div class="field"><label for="cc-n">Número do cartão</label><input id="cc-n" inputmode="numeric" placeholder="0000 0000 0000 0000" autocomplete="off"></div>
            <div class="row">
              <div class="field"><label for="cc-v">Validade</label><input id="cc-v" placeholder="MM/AA" autocomplete="off"></div>
              <div class="field"><label for="cc-c">CVV</label><input id="cc-c" inputmode="numeric" placeholder="123" autocomplete="off"></div>
            </div>`}
          <div class="total-row"><span>Total</span><span>${brl(plan.preco)}</span></div>
          <button type="button" class="btn btn-primary btn-block" id="pay-go">${method === 'pix' ? 'Simular Pix pago' : 'Pagar ' + brl(plan.preco)}</button>`;
        $$('[data-m]', payArea).forEach((b) => b.addEventListener('click', () => { method = b.dataset.m; renderPay(); }));
        const cp = $('#copy-pix'); if (cp) cp.addEventListener('click', () => copy(pixCode));
      }
      $('#pay-go').addEventListener('click', (e) => {
        const btn = e.currentTarget; btn.disabled = true; btn.textContent = 'Processando…';
        setTimeout(() => finalize(form.elements.plano.value), plan.preco ? 1100 : 300);
      });
    };
    form.addEventListener('change', (e) => { if (e.target.name === 'plano') renderPay(); });
    renderPay();
  }

  function finalize(planoId) {
    const inv = { ...draft, id: uid(), plano: planoId, criado: new Date().toISOString() };
    delete inv.planoDesejado;
    if (!PLANS[planoId].recursos.pix) { delete inv.pix; delete inv.presentes; }
    const list = getInvites(); list.unshift(inv); saveInvites(list);
    store.del('draft');
    showPublished(inv, false);
  }

  function showPublished(inv, edited) {
    const url = inviteUrl(inv);
    const wa = `https://wa.me/?text=${encodeURIComponent(`🎉 Você está convidado para o aniversário de ${inv.nome}! Veja o convite e confirme presença: ${url}`)}`;
    openModal(`
      <div class="success-box">
        <div class="big">🎉</div>
        <h2 id="modal-title">${edited ? 'Convite atualizado!' : 'Seu convite está no ar!'}</h2>
        <p class="muted">${edited ? 'Envie o novo link para quem ainda não recebeu.' : 'Agora é só enviar para os convidados.'}</p>
        <div class="copy-row" style="margin:16px 0"><input readonly value="${esc(url)}" aria-label="Link do convite"><button class="btn btn-sm" id="copy-link">Copiar</button></div>
        <div style="display:grid;gap:10px">
          <a class="btn btn-primary" href="${esc(wa)}" target="_blank" rel="noopener">Enviar pelo WhatsApp</a>
          <a class="btn" href="#/c/${encode(inv)}" data-close>Ver convite</a>
          <a class="btn btn-ghost" href="#/painel" data-close>Ir para Meus convites</a>
        </div>
      </div>`);
    $('#copy-link').addEventListener('click', () => copy(url));
  }

  // QR "de mentira" para a demonstração (não é um QR válido)
  function fakeQR(text) {
    let h = 0; for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const n = 25; let cells = '';
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#000"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#000"/>`;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if ((x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9)) continue;
      h = (h * 1103515245 + 12345) >>> 0;
      if ((h >> 16) & 1) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
    return `<svg class="pix-qr" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" role="img" aria-label="QR Code Pix (demonstração)">${cells}${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`;
  }

  // ---------- Página do convidado ----------
  let countdownTimer = null;

  function pageConvite(code) {
    let inv;
    try { inv = decode(code); } catch { return notFound('Este link de convite parece estar incompleto.'); }
    const plan = PLANS[inv.plano] || PLANS.gratis;
    const r = plan.recursos;
    const dt = eventDate(inv);
    const mapUrl = inv.endereco ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inv.endereco)}` : null;
    const already = store.get('myrsvp:' + inv.id, null);

    const envelope = r.anim ? `<div class="envelope-screen" id="envelope">
        <p class="env-title">Você recebeu um convite! 💌</p>
        <button class="envelope" id="env-open" aria-label="Abrir convite">
          <span class="env-back"></span><span class="env-letter">${esc(inv.nome)}</span><span class="env-front"></span><span class="env-flap"></span><span class="env-seal">🎉</span>
        </button>
        <p class="muted">Toque no envelope para abrir</p>
      </div>` : '';
    return `${envelope}<div class="container guest">
      <div id="guest-card">${cardHTML(inv)}</div>
      <div>
        <span class="eyebrow">Você foi convidado 💌</span>
        <h1 style="font-size:clamp(1.8rem,4vw,2.6rem)">Aniversário ${inv.idade ? `de ${esc(inv.idade)} anos ` : ''}de ${esc(inv.nome)}</h1>
        <p class="muted" style="font-size:1.05rem">📅 ${esc(fmtDate(inv, true))}${inv.hora ? ` às ${esc(fmtHour(inv))}` : ''}<br>
        ${inv.local ? `📍 ${esc(inv.local)}` : ''}${inv.endereco ? ` — ${esc(inv.endereco)}` : ''}</p>

        ${r.countdown && dt ? `<div class="countdown" id="countdown" data-t="${dt.getTime()}"></div>` : ''}

        <div class="quick-actions">
          ${mapUrl ? `<a class="btn" href="${esc(mapUrl)}" target="_blank" rel="noopener"><span>🗺️</span>Como chegar</a>` : ''}
          ${r.agenda && dt ? `<button class="btn" id="btn-ics"><span>📆</span>Salvar na agenda</button>` : ''}
          <button class="btn" id="btn-share"><span>📤</span>Compartilhar</button>
        </div>

        ${r.rsvp ? `<div class="panel" id="rsvp-panel">${already ? rsvpDone(inv, already) : rsvpForm()}</div>` : ''}

        ${r.pix && (inv.pix || inv.presentes) ? `<div class="panel" style="margin-top:20px">
          <h2 style="font-size:1.3rem">🎁 Presentes</h2>
          ${inv.presentes ? `<ul>${inv.presentes.split('\n').filter((x) => x.trim()).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
          ${inv.pix ? `<p class="small muted">Prefere dar um presente via Pix?</p><div class="copy-row"><input readonly value="${esc(inv.pix)}" aria-label="Chave Pix"><button class="btn btn-sm" id="copy-pixkey">Copiar chave</button></div>` : ''}
        </div>` : ''}

        ${!r.semMarca ? `<p class="notice" style="margin-top:20px">Convite criado grátis com Convitei. <a href="#/editor">Crie o seu →</a></p>` : ''}
      </div>
    </div>`;
  }

  function rsvpForm() {
    return `<h2 style="font-size:1.3rem">Confirme sua presença</h2>
      <form id="rsvp">
        <div class="field"><label for="r-nome">Seu nome *</label><input id="r-nome" name="nome" required maxlength="50" autocomplete="name"></div>
        <div class="field"><span style="font-weight:600;font-size:.9rem">Você vai?</span>
          <div class="radio-group">
            <label><input type="radio" name="vai" value="sim" checked><span>🎉 Vou sim</span></label>
            <label><input type="radio" name="vai" value="talvez"><span>🤔 Talvez</span></label>
            <label><input type="radio" name="vai" value="nao"><span>😢 Não vou</span></label>
          </div>
        </div>
        <div class="row" id="r-qtd">
          <div class="field"><label for="r-ad">Adultos</label><input id="r-ad" name="adultos" type="number" min="0" max="20" value="1"></div>
          <div class="field"><label for="r-cr">Crianças</label><input id="r-cr" name="criancas" type="number" min="0" max="20" value="0"></div>
        </div>
        <div class="field"><label for="r-obs">Recado (opcional)</label><input id="r-obs" name="obs" maxlength="120" placeholder="Ex.: Alergia a amendoim"></div>
        <button class="btn btn-primary btn-block">Enviar confirmação</button>
      </form>`;
  }

  function rsvpDone(inv, r) {
    const label = { sim: 'Presença confirmada! 🎉', talvez: 'Resposta registrada: talvez 🤔', nao: 'Que pena! Resposta registrada 😢' }[r.vai];
    const txt = `Olá! Aqui é ${r.nome}. ${r.vai === 'sim' ? `Confirmo presença no aniversário de ${inv.nome}` : r.vai === 'talvez' ? `Talvez eu vá ao aniversário de ${inv.nome}` : `Infelizmente não poderei ir ao aniversário de ${inv.nome}`}${r.vai !== 'nao' ? ` (${r.adultos} adulto(s), ${r.criancas} criança(s))` : ''}.${r.obs ? ' ' + r.obs : ''}`;
    const phone = (inv.whats || '').replace(/\D/g, '');
    const wa = phone ? `https://wa.me/${phone.length <= 11 ? '55' + phone : phone}?text=${encodeURIComponent(txt)}` : null;
    return `<div class="success-box">
      <div class="big">${r.vai === 'nao' ? '💌' : '🥳'}</div>
      <h2 style="font-size:1.3rem">${label}</h2>
      ${wa ? `<p class="muted small">Avise também pelo WhatsApp:</p><a class="btn btn-primary" href="${esc(wa)}" target="_blank" rel="noopener">Enviar para o anfitrião</a>` : ''}
      <p style="margin-top:12px"><button class="btn btn-ghost btn-sm" id="rsvp-change">Alterar resposta</button></p>
    </div>`;
  }

  function bindConvite(code) {
    let inv; try { inv = decode(code); } catch { return; }
    const dt = eventDate(inv);
    const env = $('#envelope');
    if (env) {
      document.body.style.overflow = 'hidden';
      $('#env-open').addEventListener('click', () => {
        env.classList.add('opening');
        setTimeout(() => {
          env.classList.add('gone');
          document.body.style.overflow = '';
          $('#guest-card').innerHTML = cardHTML(inv, { anim: true });
          confetti();
        }, 900);
        setTimeout(() => env.remove(), 1500);
      });
    }
    const cd = $('#countdown');
    if (cd) {
      const tick = () => {
        let ms = Number(cd.dataset.t) - Date.now();
        if (ms <= 0) { cd.outerHTML = '<p class="notice" style="margin:8px 0 24px">🎂 É hoje! Ou a festa já aconteceu. Obrigado a todos!</p>'; clearInterval(countdownTimer); return; }
        const d = Math.floor(ms / 864e5); ms %= 864e5;
        const h = Math.floor(ms / 36e5); ms %= 36e5;
        const m = Math.floor(ms / 6e4); const s = Math.floor((ms % 6e4) / 1e3);
        cd.innerHTML = [[d, 'dias'], [h, 'horas'], [m, 'min'], [s, 'seg']].map(([n, l]) => `<div><b>${String(n).padStart(2, '0')}</b><span>${l}</span></div>`).join('');
      };
      tick(); countdownTimer = setInterval(tick, 1000);
    }
    const ics = $('#btn-ics');
    if (ics) ics.addEventListener('click', () => downloadICS(inv, dt));
    $('#btn-share').addEventListener('click', async () => {
      const url = location.href;
      const text = `Aniversário de ${inv.nome} 🎉`;
      if (navigator.share) { try { await navigator.share({ title: text, text, url }); return; } catch { /* cancelado */ } }
      copy(url);
    });
    const pk = $('#copy-pixkey'); if (pk) pk.addEventListener('click', () => copy(inv.pix));
    bindRsvp(inv);
  }

  function bindRsvp(inv) {
    const panel = $('#rsvp-panel'); if (!panel) return;
    const form = $('#rsvp');
    if (form) {
      const qtd = $('#r-qtd');
      form.addEventListener('change', () => { qtd.style.display = form.elements.vai.value === 'nao' ? 'none' : ''; });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const f = form.elements;
        if (!f.nome.value.trim()) { toast('Digite seu nome'); f.nome.focus(); return; }
        const r = {
          nome: f.nome.value.trim(), vai: f.vai.value,
          adultos: f.vai.value === 'nao' ? 0 : Math.max(0, Number(f.adultos.value) || 0),
          criancas: f.vai.value === 'nao' ? 0 : Math.max(0, Number(f.criancas.value) || 0),
          obs: f.obs.value.trim(), em: new Date().toISOString(),
        };
        // Sem backend: grava no navegador (no produto real isso vai para a API)
        const list = getRsvps(inv.id).filter((x) => x.nome.toLowerCase() !== r.nome.toLowerCase());
        list.push(r); store.set('rsvp:' + inv.id, list);
        store.set('myrsvp:' + inv.id, r);
        panel.innerHTML = rsvpDone(inv, r); bindRsvp(inv);
        toast('Resposta enviada!');
      });
    }
    const ch = $('#rsvp-change');
    if (ch) ch.addEventListener('click', () => { store.del('myrsvp:' + inv.id); panel.innerHTML = rsvpForm(); bindRsvp(inv); });
  }

  function confetti() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = document.createElement('div'); box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
    const colors = ['#ff5a7a', '#7c5cff', '#ffc845', '#2ec4b6', '#ff8c42', '#4ff0ff'];
    for (let i = 0; i < 90; i++) {
      const c = document.createElement('i');
      c.style.cssText = `left:${Math.random() * 100}%;background:${colors[i % colors.length]};animation-delay:${Math.random() * .6}s;animation-duration:${2.2 + Math.random() * 1.8}s;--x:${(Math.random() - .5) * 200}px;--rot:${Math.random() * 720}deg`;
      box.appendChild(c);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 5000);
  }

  function downloadICS(inv, dt) {
    const pad = (n) => String(n).padStart(2, '0');
    const f = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const end = new Date(dt.getTime() + 4 * 36e5);
    const clean = (s) => String(s || '').replace(/[,;\\]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Convitei//PT-BR', 'BEGIN:VEVENT',
      `UID:${inv.id}@convitei`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(dt)}`, `DTEND:${f(end)}`,
      `SUMMARY:${clean('Aniversário de ' + inv.nome)}`, `LOCATION:${clean([inv.local, inv.endereco].filter(Boolean).join(' - '))}`,
      `DESCRIPTION:${clean(inv.msg)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = `aniversario-${inv.nome.toLowerCase().replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // ---------- Painel ----------
  function pagePainel() {
    const list = getInvites();
    if (!list.length) {
      return `<div class="container dash"><div class="dash-head"><h1>Meus convites</h1></div>
        <div class="empty"><div class="big">💌</div><h2>Você ainda não criou nenhum convite</h2><p class="muted">Leva só alguns minutos.</p><a href="#/editor" class="btn btn-primary">Criar meu primeiro convite</a></div></div>`;
    }
    return `<div class="container dash">
      <div class="dash-head"><div><h1>Meus convites</h1><p class="muted">Acompanhe as confirmações e compartilhe o link.</p></div><a href="#/editor" class="btn btn-primary">+ Novo convite</a></div>
      <div class="dash-list">${list.map((inv) => {
        const rs = getRsvps(inv.id);
        const yes = rs.filter((r) => r.vai === 'sim');
        const pessoas = yes.reduce((a, r) => a + r.adultos + r.criancas, 0);
        const plan = PLANS[inv.plano] || PLANS.gratis;
        return `<div class="dash-item">
          ${cardHTML(inv)}
          <div>
            <h3>${esc(inv.nome)}${inv.idade ? ` · ${esc(inv.idade)} anos` : ''}</h3>
            <div class="muted small">${esc(fmtDate(inv))}${inv.hora ? ' às ' + esc(fmtHour(inv)) : ''} · ${esc(tplById(inv.tpl).nome)} · <span class="badge">${plan.nome}</span></div>
            ${plan.recursos.rsvp ? `<div class="stats"><span>✅ <b>${yes.length}</b> confirmados</span><span>👥 <b>${pessoas}</b> pessoas</span><span>🤔 <b>${rs.filter((r) => r.vai === 'talvez').length}</b> talvez</span><span>😢 <b>${rs.filter((r) => r.vai === 'nao').length}</b> não vão</span></div>` : '<div class="stats muted">Confirmação de presença disponível nos planos pagos</div>'}
          </div>
          <div class="dash-actions">
            <a class="btn btn-sm" href="#/c/${encode(inv)}">Abrir</a>
            <button class="btn btn-sm" data-act="copy" data-id="${inv.id}">Copiar link</button>
            ${plan.recursos.rsvp ? `<button class="btn btn-sm" data-act="guests" data-id="${inv.id}">Convidados</button>` : ''}
            <a class="btn btn-sm" href="#/editor?edit=${inv.id}">Editar</a>
            <button class="btn btn-sm btn-ghost" data-act="del" data-id="${inv.id}" aria-label="Excluir convite de ${esc(inv.nome)}">🗑️</button>
          </div>
        </div>`;
      }).join('')}</div>
      <p class="notice" style="margin-top:24px">ℹ️ Protótipo: os convites e confirmações ficam salvos neste navegador. Na versão final, tudo fica na sua conta.</p>
    </div>`;
  }

  function bindPainel() {
    app.addEventListener('click', onPainelClick);
  }
  function onPainelClick(e) {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const inv = getInvites().find((i) => i.id === b.dataset.id); if (!inv) return;
    if (b.dataset.act === 'copy') copy(inviteUrl(inv));
    if (b.dataset.act === 'del') {
      if (!confirm(`Excluir o convite de ${inv.nome}?`)) return;
      saveInvites(getInvites().filter((i) => i.id !== inv.id)); store.del('rsvp:' + inv.id);
      render(); toast('Convite excluído');
    }
    if (b.dataset.act === 'guests') showGuests(inv);
  }

  function showGuests(inv) {
    const rs = getRsvps(inv.id);
    const lbl = { sim: '✅ Vai', talvez: '🤔 Talvez', nao: '😢 Não vai' };
    const canExport = PLANS[inv.plano]?.recursos.pix; // exportar = Festa+
    openModal(`<h2 id="modal-title">Convidados de ${esc(inv.nome)}</h2>
      ${rs.length ? `<div style="overflow:auto"><table class="guests"><thead><tr><th>Nome</th><th>Resposta</th><th>Adultos</th><th>Crianças</th><th>Recado</th></tr></thead><tbody>
        ${rs.map((r) => `<tr><td>${esc(r.nome)}</td><td>${lbl[r.vai]}</td><td>${r.adultos}</td><td>${r.criancas}</td><td>${esc(r.obs)}</td></tr>`).join('')}
      </tbody></table></div>` : '<p class="muted">Ainda não há respostas. Compartilhe o link com seus convidados!</p>'}
      <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">
        ${rs.length ? (canExport ? '<button class="btn btn-primary btn-sm" id="csv">Exportar CSV</button>' : '<span class="muted small">Exportar CSV disponível no plano Festa+</span>') : ''}
      </div>`);
    const csv = $('#csv');
    if (csv) csv.addEventListener('click', () => {
      const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
      const body = [['Nome', 'Resposta', 'Adultos', 'Criancas', 'Recado'].join(';'), ...rs.map((r) => [q(r.nome), r.vai, r.adultos, r.criancas, q(r.obs)].join(';'))].join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob(['﻿' + body], { type: 'text/csv' }));
      a.download = `convidados-${inv.nome}.csv`; document.body.appendChild(a); a.click(); a.remove();
    });
  }


  // ---------- Sob medida (encomendas) ----------
  let orderDraft = null;

  function pageSobMedida(q) {
    const sel = PACOTES[q.get('pacote')] ? q.get('pacote') : 'animado';
    return `<section class="hero" style="padding-bottom:24px"><div class="container center">
      <span class="eyebrow">🎨 Convite sob medida</span>
      <h1>Uma arte exclusiva, criada para a sua festa</h1>
      <p class="lead" style="margin-inline:auto">Você conta como imagina, nosso designer cria, você aprova e recebe tudo pronto para enviar. Sem modelo repetido.</p>
    </div></section>

    <section style="padding-top:0"><div class="container">
      <div class="steps">
        <div class="step"><div class="step-n">1</div><h3>Escolha o pacote e conte sua ideia</h3><p class="muted">Tema, cores, foto do aniversariante e referências.</p></div>
        <div class="step"><div class="step-n">2</div><h3>Pague com Pix</h3><p class="muted">Valor total ou 50% de sinal. Começamos na hora.</p></div>
        <div class="step"><div class="step-n">3</div><h3>Aprove e receba</h3><p class="muted">Você recebe a prévia no WhatsApp, pede ajustes e recebe o convite final.</p></div>
      </div>

      <h2 class="center" style="margin-top:64px">Pacotes</h2>
      <div class="pricing">${Object.values(PACOTES).map((pk) => `
        <div class="plan ${pk.destaque ? 'featured' : ''}">
          ${pk.destaque ? '<span class="tag">Mais pedido</span>' : ''}
          <h3>${esc(pk.nome)}</h3>
          <p class="muted small">Entrega em até ${pk.prazo} dias úteis</p>
          <div class="price">${brl(pk.preco)}</div>
          <ul>${pk.itens.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          <a href="#/sob-medida?pacote=${pk.id}#pedido" class="btn ${pk.destaque ? 'btn-primary' : ''} btn-block">Quero este</a>
        </div>`).join('')}
      </div>
      <p class="center muted small" style="margin-top:16px">⚡ Precisa com urgência? Entrega em 1 dia útil por + ${brl(URGENCIA)}.</p>
    </div></section>

    <section id="pedido" style="background:var(--surface)"><div class="container" style="max-width:760px">
      <h2>Faça seu pedido</h2>
      <p class="muted">Quanto mais detalhes, mais a arte fica com a sua cara.</p>
      <form class="panel" id="order-form" novalidate>
        <div class="section-title">Pacote</div>
        <div class="plan-options" style="margin-top:0">${Object.values(PACOTES).map((pk) => `
          <label class="plan-opt"><input type="radio" name="pacote" value="${pk.id}" ${pk.id === sel ? 'checked' : ''}>
            <div><div class="p-name">${esc(pk.nome)}</div><div class="p-desc">Até ${pk.prazo} dias úteis</div></div>
            <div class="p-price">${brl(pk.preco)}</div></label>`).join('')}
          <label class="plan-opt"><input type="checkbox" name="urgente">
            <div><div class="p-name">⚡ Urgente</div><div class="p-desc">Entrega em 1 dia útil</div></div>
            <div class="p-price">+ ${brl(URGENCIA)}</div></label>
        </div>

        <div class="section-title">A festa</div>
        <div class="row">
          <div class="field"><label for="o-aniv">Nome do aniversariante *</label><input id="o-aniv" name="aniversariante" maxlength="30" required></div>
          <div class="field"><label for="o-idade">Idade</label><input id="o-idade" name="idade" inputmode="numeric" maxlength="3"></div>
        </div>
        <div class="row">
          <div class="field"><label for="o-data">Data da festa *</label><input id="o-data" name="data" type="date" required></div>
          <div class="field"><label for="o-tema">Tema *</label><input id="o-tema" name="tema" maxlength="60" required placeholder="Ex.: Dinossauros, Jardim, Neon"></div>
        </div>
        <div class="field"><label for="o-cores">Cores preferidas</label><input id="o-cores" name="cores" maxlength="60" placeholder="Ex.: verde e dourado"></div>
        <div class="field"><label for="o-ref">Como você imagina o convite?</label><textarea id="o-ref" name="referencias" maxlength="600" placeholder="Descreva o estilo, elementos que não podem faltar, textos especiais, links de referência…"></textarea></div>
        <div class="field">
          <label for="o-fotos">Fotos e referências (até 3 imagens)</label>
          <input id="o-fotos" name="fotos" type="file" accept="image/*" multiple>
          <span class="hint">Foto do aniversariante, print de um convite que você gostou, decoração da festa…</span>
          <div class="thumbs" id="thumbs"></div>
        </div>

        <div class="section-title">Seus dados</div>
        <div class="field"><label for="o-nome">Seu nome *</label><input id="o-nome" name="nome" maxlength="50" required autocomplete="name"></div>
        <div class="row">
          <div class="field"><label for="o-whats">WhatsApp *</label><input id="o-whats" name="whats" inputmode="tel" maxlength="20" required autocomplete="tel" placeholder="(11) 99999-9999"></div>
          <div class="field"><label for="o-email">E-mail</label><input id="o-email" name="email" type="email" maxlength="80" autocomplete="email"></div>
        </div>

        <div class="total-row"><span>Total</span><span id="o-total"></span></div>
        <button class="btn btn-primary btn-block" id="o-submit">Continuar para pagamento</button>
        <p class="muted small center" style="margin:12px 0 0">Prefere tirar dúvidas antes? <a href="${esc(waLink('Olá! Tenho uma dúvida sobre o convite personalizado.'))}" target="_blank" rel="noopener">Fale com a gente no WhatsApp</a></p>
      </form>
    </div></section>`;
  }

  function waLink(text, phone = CONTATO_WHATS) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }
  const orderTotal = (f) => PACOTES[f.pacote.value].preco + (f.urgente.checked ? URGENCIA : 0);

  function resizeImage(file, max = 720, quality = 0.78) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(img.src);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  function bindSobMedida() {
    const form = $('#order-form'); if (!form) return;
    const f = form.elements;
    orderDraft = { fotos: [] };
    const upd = () => { $('#o-total').textContent = brl(orderTotal(f)); };
    form.addEventListener('change', upd); upd();
    $('#o-fotos').addEventListener('change', async (e) => {
      const files = [...e.target.files].filter((x) => x.type.startsWith('image/')).slice(0, 3);
      if (e.target.files.length > 3) toast('Enviamos só as 3 primeiras imagens');
      try { orderDraft.fotos = await Promise.all(files.map((x) => resizeImage(x))); } catch { toast('Não conseguimos ler uma das imagens'); orderDraft.fotos = []; }
      $('#thumbs').innerHTML = orderDraft.fotos.map((src) => `<img src="${src}" alt="Imagem enviada">`).join('');
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const need = [['aniversariante', 'o nome do aniversariante'], ['data', 'a data da festa'], ['tema', 'o tema'], ['nome', 'seu nome'], ['whats', 'seu WhatsApp']];
      for (const [k, label] of need) {
        if (!f[k].value.trim()) { toast(`Preencha ${label}`); f[k].focus(); return; }
      }
      if (f.whats.value.replace(/\D/g, '').length < 10) { toast('Confira o número de WhatsApp com DDD'); f.whats.focus(); return; }
      const order = {
        id: 'P' + Date.now().toString(36).toUpperCase().slice(-6),
        pacote: f.pacote.value, urgente: f.urgente.checked, total: orderTotal(f),
        status: 'novo', criado: new Date().toISOString(),
        cliente: { nome: f.nome.value.trim(), whats: f.whats.value.trim(), email: f.email.value.trim() },
        festa: {
          aniversariante: f.aniversariante.value.trim(), idade: f.idade.value.trim(), data: f.data.value,
          tema: f.tema.value.trim(), cores: f.cores.value.trim(), referencias: f.referencias.value.trim(),
        },
        fotos: orderDraft.fotos,
      };
      openOrderCheckout(order);
    });
  }

  function openOrderCheckout(order) {
    const pk = PACOTES[order.pacote];
    let modo = 'total';
    const draw = () => {
      const valor = modo === 'total' ? order.total : Math.ceil(order.total / 2);
      const pixCode = `00020126580014BR.GOV.BCB.PIX0136convitei-pedido-${order.id}5204000053039865406${valor.toFixed(2)}5802BR`;
      openModal(`
        <h2 id="modal-title">Pagamento do pedido</h2>
        <p class="muted small">${esc(pk.nome)}${order.urgente ? ' + Urgente' : ''} · ${esc(order.festa.aniversariante)} · tema ${esc(order.festa.tema)}</p>
        <div class="pay-tabs">
          <button type="button" class="chip ${modo === 'total' ? 'active' : ''}" data-modo="total">Pagar total · ${brl(order.total)}</button>
          <button type="button" class="chip ${modo === 'sinal' ? 'active' : ''}" data-modo="sinal">Sinal de 50% · ${brl(Math.ceil(order.total / 2))}</button>
        </div>
        <div class="pix-box">${fakeQR(pixCode)}
          <p class="small muted">Pix copia e cola</p>
          <div class="copy-row"><input readonly value="${esc(pixCode)}" aria-label="Código Pix"><button type="button" class="btn btn-sm" id="copy-pix">Copiar</button></div>
        </div>
        ${modo === 'sinal' ? `<p class="small muted">O restante (${brl(order.total - Math.ceil(order.total / 2))}) é pago na aprovação da arte.</p>` : ''}
        <div class="total-row"><span>Agora</span><span>${brl(valor)}</span></div>
        <button class="btn btn-primary btn-block" id="order-pay">Simular Pix pago</button>
        <p class="notice small" style="margin-top:14px">🔒 Protótipo: pagamento simulado, nenhuma cobrança é feita.</p>`);
      $$('[data-modo]').forEach((b) => b.addEventListener('click', () => { modo = b.dataset.modo; draw(); }));
      $('#copy-pix').addEventListener('click', () => copy(pixCode));
      $('#order-pay').addEventListener('click', (e) => {
        e.currentTarget.disabled = true; e.currentTarget.textContent = 'Confirmando pagamento…';
        setTimeout(() => {
          const final = { ...order, pagamento: modo, pago: valor };
          let list = [final, ...getOrders()];
          if (!saveOrders(list)) { final.fotos = []; list = [final, ...getOrders()]; saveOrders(list); }
          orderDone(final);
        }, 1100);
      });
    };
    draw();
  }

  function orderDone(o) {
    const pk = PACOTES[o.pacote];
    const prazo = o.urgente ? 1 : pk.prazo;
    const msg = `Olá! Acabei de fazer o pedido ${o.id} no Convitei 🎉\n` +
      `Pacote: ${pk.nome}${o.urgente ? ' (URGENTE)' : ''}\nAniversariante: ${o.festa.aniversariante}${o.festa.idade ? ', ' + o.festa.idade + ' anos' : ''}\n` +
      `Data da festa: ${fmtDate({ data: o.festa.data })}\nTema: ${o.festa.tema}${o.festa.cores ? '\nCores: ' + o.festa.cores : ''}\n` +
      `Pago: ${brl(o.pago)} (${o.pagamento === 'total' ? 'valor total' : 'sinal de 50%'})`;
    openModal(`<div class="success-box">
      <div class="big">🎨</div>
      <h2 id="modal-title">Pedido ${esc(o.id)} recebido!</h2>
      <p class="muted">Pagamento confirmado. Nosso designer começa agora e você recebe a primeira prévia no WhatsApp em até <b>${prazo} dia${prazo > 1 ? 's' : ''} út${prazo > 1 ? 'eis' : 'il'}</b>.</p>
      ${o.fotos.length === 0 ? '<p class="small muted">Se tiver fotos ou referências, mande pelo WhatsApp.</p>' : ''}
      <div style="display:grid;gap:10px;margin-top:16px">
        <a class="btn btn-primary" href="${esc(waLink(msg))}" target="_blank" rel="noopener">Enviar resumo pelo WhatsApp</a>
        <a class="btn" href="#/" data-close>Voltar ao início</a>
      </div>
    </div>`);
  }

  // ---------- Encomendas (visão do vendedor) ----------
  function pageEncomendas(q) {
    const all = getOrders();
    const filtro = STATUS[q.get('status')] ? q.get('status') : '';
    const list = filtro ? all.filter((o) => o.status === filtro) : all;
    const receita = all.reduce((a, o) => a + (o.pago || 0), 0);
    const aReceber = all.reduce((a, o) => a + (o.total - (o.pago || 0)), 0);
    const count = (st) => all.filter((o) => o.status === st).length;
    return `<div class="container dash">
      <div class="dash-head"><div><h1>Encomendas</h1><p class="muted">Pedidos de convites sob medida. Área do vendedor.</p></div><a href="#/sob-medida" class="btn">Ver página de pedidos</a></div>
      <div class="kpis">
        <div class="kpi"><span>Recebido</span><b>${brl(receita)}</b></div>
        <div class="kpi"><span>A receber</span><b>${brl(aReceber)}</b></div>
        ${Object.entries(STATUS).map(([k, v]) => `<div class="kpi"><span>${v}</span><b>${count(k)}</b></div>`).join('')}
      </div>
      <div class="filters">
        <a class="chip ${!filtro ? 'active' : ''}" href="#/encomendas">Todas (${all.length})</a>
        ${Object.entries(STATUS).map(([k, v]) => `<a class="chip ${filtro === k ? 'active' : ''}" href="#/encomendas?status=${k}">${v}</a>`).join('')}
      </div>
      ${list.length ? `<div class="dash-list">${list.map(orderItem).join('')}</div>` : `<div class="empty"><div class="big">📭</div><h2>Nenhuma encomenda ${filtro ? 'neste status' : 'ainda'}</h2><p class="muted">Os pedidos feitos na página Sob medida aparecem aqui.</p></div>`}
      <p class="notice" style="margin-top:24px">ℹ️ Protótipo: os pedidos ficam salvos neste navegador. Na versão final esta área tem login só para você e recebe pedidos de qualquer cliente.</p>
    </div>`;
  }

  function orderItem(o) {
    const pk = PACOTES[o.pacote];
    const prazo = new Date(o.criado); let dias = o.urgente ? 1 : pk.prazo;
    while (dias > 0) { prazo.setDate(prazo.getDate() + 1); if (prazo.getDay() % 6 !== 0) dias--; }
    const atrasado = o.status !== 'entregue' && prazo < new Date();
    const phone = o.cliente.whats.replace(/\D/g, '');
    const wa = waLink(`Olá, ${o.cliente.nome}! Aqui é do Convitei, sobre o pedido ${o.id} (convite de ${o.festa.aniversariante}).`, phone.length <= 11 ? '55' + phone : phone);
    return `<details class="order">
      <summary>
        <div><b>${esc(o.id)}</b> · ${esc(o.festa.aniversariante)}${o.festa.idade ? ` (${esc(o.festa.idade)})` : ''} · ${esc(o.festa.tema)}</div>
        <div class="order-meta">
          <span class="badge">${esc(pk.nome)}</span>${o.urgente ? '<span class="badge badge-premium">⚡ Urgente</span>' : ''}
          <span class="badge ${atrasado ? 'badge-late' : ''}">Entrega ${prazo.toLocaleDateString('pt-BR')}${atrasado ? ' · atrasado' : ''}</span>
          <span class="badge">${STATUS[o.status]}</span>
        </div>
      </summary>
      <div class="order-body">
        <div>
          <p><b>Cliente:</b> ${esc(o.cliente.nome)} · ${esc(o.cliente.whats)}${o.cliente.email ? ' · ' + esc(o.cliente.email) : ''}</p>
          <p><b>Festa:</b> ${esc(fmtDate({ data: o.festa.data }))}${o.festa.cores ? ` · Cores: ${esc(o.festa.cores)}` : ''}</p>
          ${o.festa.referencias ? `<p><b>Ideia:</b> ${esc(o.festa.referencias)}</p>` : ''}
          <p><b>Pagamento:</b> ${brl(o.pago)} de ${brl(o.total)} ${o.pago < o.total ? `<span class="badge badge-premium">falta ${brl(o.total - o.pago)}</span>` : '<span class="badge">quitado</span>'}</p>
          ${o.fotos && o.fotos.length ? `<div class="thumbs">${o.fotos.map((src) => `<a href="${src}" download="${esc(o.id)}.jpg"><img src="${src}" alt="Referência do cliente"></a>`).join('')}</div>` : ''}
        </div>
        <div class="order-actions">
          <label class="small muted" for="st-${o.id}">Status</label>
          <select id="st-${o.id}" data-status="${o.id}">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${k === o.status ? 'selected' : ''}>${v}</option>`).join('')}</select>
          <a class="btn btn-sm btn-primary" href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp do cliente</a>
          <a class="btn btn-sm" href="#/editor?pedido=${o.id}">Montar convite online</a>
          ${o.pago < o.total ? `<button class="btn btn-sm" data-quitar="${o.id}">Marcar como quitado</button>` : ''}
        </div>
      </div>
    </details>`;
  }

  function onEncomendasChange(e) {
    const sel = e.target.closest('[data-status]'); if (!sel) return;
    saveOrders(getOrders().map((o) => (o.id === sel.dataset.status ? { ...o, status: sel.value } : o)));
    toast('Status atualizado'); render();
  }
  function onEncomendasClick(e) {
    const b = e.target.closest('[data-quitar]'); if (!b) return;
    saveOrders(getOrders().map((o) => (o.id === b.dataset.quitar ? { ...o, pago: o.total } : o)));
    toast('Pagamento quitado'); render();
  }

  function pageTermos() {
    return `<div class="container page">
      <h1>Termos e privacidade</h1>
      <p class="notice">Texto provisório do protótipo. Antes de lançar, substitua por termos revisados por um profissional, de acordo com a LGPD.</p>
      <h2 style="font-size:1.3rem;margin-top:24px">Dados que coletamos</h2>
      <p class="muted">Informações do convite (nome do aniversariante, data, local) e as respostas de confirmação dos convidados (nome e quantidade de pessoas).</p>
      <h2 style="font-size:1.3rem">Como usamos</h2>
      <p class="muted">Apenas para exibir o convite e mostrar as confirmações ao anfitrião. Não vendemos dados.</p>
      <h2 style="font-size:1.3rem">Reembolso</h2>
      <p class="muted">Pedidos de reembolso em até 7 dias após a compra, conforme o Código de Defesa do Consumidor.</p>
    </div>`;
  }

  function notFound(msg = 'Página não encontrada.') {
    return `<div class="container dash"><div class="empty"><div class="big">🎈</div><h2>Ops!</h2><p class="muted">${esc(msg)}</p><a href="#/" class="btn btn-primary">Voltar ao início</a></div></div>`;
  }

  // ---------- Roteador ----------
  function render() {
    clearInterval(countdownTimer);
    document.body.style.overflow = '';
    $$('.confetti').forEach((c) => c.remove());
    app.removeEventListener('click', onPainelClick);
    app.removeEventListener('change', onEncomendasChange);
    app.removeEventListener('click', onEncomendasClick);
    const raw = location.hash.replace(/^#/, '') || '/';
    const [pathAndQuery, anchor] = raw.split('#');
    const [path, qs] = pathAndQuery.split('?');
    const q = new URLSearchParams(qs || '');
    const parts = path.split('/').filter(Boolean);
    const isGuest = parts[0] === 'c';
    document.body.classList.toggle('guest-mode', isGuest);

    let title = 'Convitei — Convites de Aniversário';
    if (!parts.length) { app.innerHTML = pageHome(); }
    else if (parts[0] === 'modelos') { app.innerHTML = pageModelos(q); title = 'Modelos · Convitei'; }
    else if (parts[0] === 'editor') { app.innerHTML = pageEditor(q); bindEditor(q); title = 'Criar convite · Convitei'; }
    else if (isGuest && parts[1]) {
      app.innerHTML = pageConvite(parts[1]); bindConvite(parts[1]);
      try { const inv = decode(parts[1]); title = `Aniversário de ${inv.nome} 🎉`; } catch { /* link inválido */ }
    }
    else if (parts[0] === 'painel') { app.innerHTML = pagePainel(); bindPainel(); title = 'Meus convites · Convitei'; }
    else if (parts[0] === 'sob-medida') { app.innerHTML = pageSobMedida(q); bindSobMedida(); title = 'Convite sob medida · Convitei'; }
    else if (parts[0] === 'encomendas') {
      app.innerHTML = pageEncomendas(q); title = 'Encomendas · Convitei';
      app.addEventListener('change', onEncomendasChange); app.addEventListener('click', onEncomendasClick);
    }
    else if (parts[0] === 'termos') { app.innerHTML = pageTermos(); title = 'Termos · Convitei'; }
    else { app.innerHTML = notFound(); }
    document.title = title;

    if (anchor) { const el = document.getElementById(anchor); if (el) { el.scrollIntoView(); return; } }
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', () => { if (!modal.hidden) closeModal(); render(); });
  $('#year').textContent = new Date().getFullYear();
  render();
})();
