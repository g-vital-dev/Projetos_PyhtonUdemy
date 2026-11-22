/* Cenas dos modelos 3D.
   Cada cena = fundo desenhado (CSS/SVG) + ilustrações 3D posicionadas.
   Ilustrações: Fluent Emoji 3D (Microsoft, licença MIT) — ver assets/3d/CREDITOS.md */
(() => {
  'use strict';

  // Ilustração 3D posicionada em % do cartão. o = { a: animação, d: atraso, r: rotação, flip, z, op }
  function c(nome, left, top, width, o = {}) {
    const st = [
      `left:${left}%`, `top:${top}%`, `width:${width}%`,
      `--r:${o.r || 0}deg`, `--sx:${o.flip ? -1 : 1}`,
      `animation-delay:${o.d || 0}s,${(o.d || 0) + 0.7}s`,
      o.z != null ? `z-index:${o.z}` : '', o.op != null ? `opacity:${o.op}` : '',
    ].filter(Boolean).join(';');
    return `<img class="c3d a-${o.a || 'float'}" src="assets/3d/${nome}.webp" style="${st}" alt="" draggable="false">`;
  }

  // Céu estrelado determinístico
  function estrelas(n, cor = '#fff') {
    let s = '', seed = 11;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < n; i++) {
      s += `<circle cx="${(rnd() * 100).toFixed(1)}" cy="${(rnd() * 150).toFixed(1)}" r="${(rnd() * .5 + .15).toFixed(2)}" fill="${cor}" opacity="${(rnd() * .6 + .4).toFixed(2)}"/>`;
    }
    return `<svg class="bg-svg tw" viewBox="0 0 100 150" preserveAspectRatio="none" aria-hidden="true">${s}</svg>`;
  }
  function confeteDourado(n) {
    let s = '', seed = 5;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const cores = ['#f7d774', '#e6b84a', '#fff1c1', '#c99a2e'];
    for (let i = 0; i < n; i++) {
      const x = rnd() * 100, y = rnd() * 150, cor = cores[i % 4];
      s += rnd() > .5
        ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(rnd() * .9 + .3).toFixed(2)}" fill="${cor}"/>`
        : `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="2.2" height=".9" fill="${cor}" transform="rotate(${(rnd() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
    return `<svg class="bg-svg tw" viewBox="0 0 100 150" preserveAspectRatio="none" aria-hidden="true">${s}</svg>`;
  }
  const svg = (inner, vb = '0 0 100 150') => `<svg class="bg-svg" viewBox="${vb}" preserveAspectRatio="none" aria-hidden="true">${inner}</svg>`;

  window.CENAS = {
    safari: {
      nome: 'Safari Selvagem', cat: 'Infantil', premium: false, pre: 'Venha para a aventura de',
      swatch: 'linear-gradient(#ffe9a8,#ffc970 60%,#7fbf4d 60%)',
      html: () => `
        <div class="bg" style="background:radial-gradient(circle at 50% 30%,#fff6d6 0 18%,transparent 40%),linear-gradient(#ffe9a8,#ffc970 62%,#f5a94a)"></div>
        ${svg(`<path d="M0 104 Q25 92 50 100 T100 96 V150 H0Z" fill="#9fd05a"/><path d="M0 116 Q30 104 60 114 T100 110 V150 H0Z" fill="#6fb03e"/><path d="M0 132 Q40 122 70 132 T100 128 V150 H0Z" fill="#4e8f2d"/>`)}
        ${c('palmeira', -12, -3, 38, { a: 'sway' })}
        ${c('palmeira', 76, -2, 34, { a: 'sway', flip: true, d: .3 })}
        ${c('macaco', 78, 22, 20, { a: 'swing', d: .5 })}
        ${c('girafa', -5, 54, 36, { d: .2 })}
        ${c('elefante', 66, 63, 36, { flip: true, d: .4 })}
        ${c('leao', 30, 64, 40, { a: 'bounce', d: .6, z: 2 })}
        ${c('folha', 4, 90, 14, { a: 'sway', d: .8 })}
        ${c('erva', 84, 88, 16, { a: 'sway', d: .9 })}`,
    },
    unicornio: {
      nome: 'Unicórnio Mágico', cat: 'Infantil', premium: false, pre: 'Um dia mágico para',
      swatch: 'linear-gradient(160deg,#ffd9ec,#e7d9ff 55%,#cdeaff)',
      html: () => `
        <div class="bg" style="background:linear-gradient(170deg,#ffd9ec,#efdcff 45%,#d4ecff)"></div>
        ${c('arcoiris', 0, -16, 100, { a: 'pulse', op: .55 })}
        ${c('brilho', 4, 22, 14, { a: 'twinkle', d: .2 })}
        ${c('brilho', 84, 30, 11, { a: 'twinkle', d: .9 })}
        ${c('estrela', 8, 60, 10, { a: 'twinkle', d: .5 })}
        ${c('coracao', 40, 88, 11, { a: 'bounce', d: 1 })}
        ${c('nuvem', -14, 78, 48, { a: 'drift', z: 2 })}
        ${c('nuvem', 70, 80, 46, { a: 'drift', d: .6, z: 2 })}
        ${c('unicornio', 50, 52, 50, { d: .3, z: 1 })}`,
    },
    futebol: {
      nome: 'Craque da Festa', cat: 'Infantil', premium: false, pre: 'Entre em campo com',
      swatch: 'linear-gradient(#0b1f4d,#1d4fa0 60%,#2f9e4f 60%)',
      html: () => `
        <div class="bg" style="background:linear-gradient(#081638,#123a7a 58%,#1d4fa0 64%)"></div>
        <div class="beam beam-l"></div><div class="beam beam-r"></div>
        ${estrelas(40)}
        <div class="field"></div>
        ${svg(`<ellipse cx="50" cy="128" rx="22" ry="5" fill="none" stroke="rgba(255,255,255,.55)" stroke-width=".6"/><line x1="0" y1="128" x2="100" y2="128" stroke="rgba(255,255,255,.4)" stroke-width=".5"/>`)}
        ${c('trofeu', 3, 64, 26, { d: .3 })}
        ${c('gol', 70, 63, 30, { d: .5 })}
        ${c('bola', 32, 67, 36, { a: 'bounce', d: .7, z: 2 })}
        ${c('medalha', 80, 6, 15, { a: 'swing', d: 1 })}`,
    },
    dino: {
      nome: 'Mundo dos Dinossauros', cat: 'Infantil', premium: false, pre: 'Festa jurássica de',
      swatch: 'linear-gradient(#cdf3d6,#7fd09a 60%,#5aa36a)',
      html: () => `
        <div class="bg" style="background:radial-gradient(circle at 75% 12%,#fff3c4 0 10%,transparent 30%),linear-gradient(#d4f6dc,#9fe0b0 55%,#79c58e)"></div>
        ${c('vulcao', 74, -1, 28, { a: 'pulse', op: .9 })}
        ${svg(`<path d="M0 108 Q20 100 45 106 T100 102 V150 H0Z" fill="#8ccf6b"/><path d="M0 124 Q35 114 65 122 T100 118 V150 H0Z" fill="#5fae4a"/><path d="M0 138 Q40 132 100 136 V150 H0Z" fill="#a8743f"/>`)}
        ${c('palmeira', -14, -2, 40, { a: 'sway' })}
        ${c('sauropode', -6, 58, 46, { d: .3 })}
        ${c('trex', 50, 52, 52, { a: 'stomp', d: .5, z: 2 })}
        ${c('ovo', 38, 86, 13, { a: 'wobble', d: .9, z: 3 })}
        ${c('erva', 86, 88, 16, { a: 'sway', d: .8, z: 3 })}`,
    },
    espaco: {
      nome: 'Viagem ao Espaço', cat: 'Infantil', premium: true, pre: 'Missão aniversário de',
      swatch: 'radial-gradient(circle at 30% 20%,#4b34b0,#0b0a2a 70%)',
      html: () => `
        <div class="bg" style="background:radial-gradient(circle at 80% 70%,rgba(255,79,216,.35),transparent 35%),radial-gradient(circle at 20% 25%,rgba(79,140,255,.45),transparent 40%),linear-gradient(#0b0a2a,#1b1050 60%,#2a1468)"></div>
        ${estrelas(90)}
        ${c('planeta', -12, 1, 34, { a: 'spin', d: .1 })}
        ${c('lua', 78, 1, 20, { a: 'pulse', d: .3 })}
        ${c('cometa', 72, 36, 18, { a: 'fly', d: .6 })}
        ${c('astronauta', -2, 62, 36, { a: 'float', d: .4 })}
        ${c('alien', 42, 84, 15, { a: 'bounce', d: 1 })}
        ${c('foguete', 56, 56, 44, { a: 'fly', d: .7, z: 2 })}`,
    },
    castelo: {
      nome: 'Reino Encantado', cat: 'Infantil', premium: true, pre: 'Você está convidado ao reino de',
      swatch: 'linear-gradient(#ffe0ef,#ffc8dc 55%,#f6dcff)',
      html: () => `
        <div class="bg" style="background:radial-gradient(circle at 50% 70%,#fff 0 12%,transparent 40%),linear-gradient(#ffe3f0,#ffd0e2 50%,#f3dcff)"></div>
        ${c('nuvem', -16, 6, 44, { a: 'drift', op: .9 })}
        ${c('nuvem', 72, 14, 40, { a: 'drift', d: .5, op: .9 })}
        ${c('coroa', 38, 2, 24, { a: 'pulse', d: .2 })}
        ${c('brilho', 10, 34, 12, { a: 'twinkle', d: .4 })}
        ${c('joia', 82, 40, 11, { a: 'twinkle', d: .8 })}
        ${c('castelo', 22, 50, 56, { d: .3, z: 1 })}
        ${c('tulipa', -4, 80, 24, { a: 'sway', d: .7, z: 2 })}
        ${c('flor', 80, 82, 22, { a: 'spin', d: .9, z: 2 })}
        ${c('laco', 40, 90, 18, { a: 'bounce', d: 1.1, z: 2 })}`,
    },
    heroi: {
      nome: 'Super-Heróis', cat: 'Infantil', premium: true, pre: 'Missão especial: festa de',
      swatch: 'repeating-conic-gradient(from 0deg at 50% 40%,#ffd23f 0 10deg,#ffb400 10deg 20deg)',
      html: () => `
        <div class="bg rays"></div>
        <div class="bg halftone"></div>
        ${svg(`<path d="M0 118 h8 v-14 h7 v8 h6 v-18 h9 v12 h6 v-6 h8 v16 h7 v-22 h8 v14 h6 v-10 h9 v18 h6 v-8 h10 V150 H0Z" fill="#1d2f6f"/><path d="M0 130 h100 V150 H0Z" fill="#14214f"/>`)}
        ${c('pow', 62, 1, 34, { a: 'pop', d: .2 })}
        ${c('raio', 2, 6, 20, { a: 'flash', d: .5 })}
        ${c('escudo', 4, 38, 15, { a: 'swing', d: .8 })}
        ${c('heroi', 0, 58, 46, { a: 'fly', d: .4, z: 2 })}
        ${c('heroina', 54, 57, 46, { a: 'fly', flip: true, d: .6, z: 2 })}`,
    },
    neon: {
      nome: 'Noite Neon', cat: '15 anos & Teen', premium: true, pre: 'Bora pra festa de',
      swatch: 'linear-gradient(#12062b,#3a0b5e)',
      html: () => `
        <div class="bg" style="background:radial-gradient(ellipse at 50% 100%,rgba(255,79,216,.45),transparent 45%),linear-gradient(#0d0322,#22073f 55%,#3a0b5e)"></div>
        <div class="spot spot-1"></div><div class="spot spot-2"></div><div class="spot spot-3"></div>
        ${estrelas(50, '#ffb8f0')}
        <div class="hang"></div>
        ${c('globo', 34, 1, 32, { a: 'spin', d: .1 })}
        ${c('brilho', 10, 14, 12, { a: 'twinkle', d: .5 })}
        ${c('brilho', 80, 20, 10, { a: 'twinkle', d: 1.1 })}
        ${c('notas', 76, 44, 18, { a: 'float', d: .8 })}
        ${c('microfone', 0, 66, 30, { r: -18, d: .4, z: 2 })}
        ${c('fone', 70, 70, 28, { a: 'bounce', d: .6, z: 2 })}`,
    },
    boiadeira: {
      nome: 'Boiadeira', cat: '15 anos & Teen', premium: true, pre: 'Aniversário da boiadeira',
      swatch: 'repeating-conic-gradient(from 0deg at 50% 100%,#ffd6e3 0 8deg,#ffc2d6 8deg 16deg)',
      html: () => `
        <div class="bg" style="background:repeating-conic-gradient(from -90deg at 50% 108%,#ffdce8 0 7deg,#ffc9dc 7deg 14deg)"></div>
        ${svg(`<path d="M0 118 Q30 108 55 114 T100 110 V150 H0Z" fill="#f2c39a"/><path d="M0 132 Q45 124 100 130 V150 H0Z" fill="#e0a678"/>`)}
        ${c('girassol', 4, 4, 18, { a: 'spin', d: .3 })}
        ${c('girassol', 80, 6, 16, { a: 'spin', d: .6 })}
        ${c('cacto', -6, 60, 30, { a: 'sway' })}
        ${c('cacto', 78, 62, 26, { a: 'sway', flip: true, d: .4 })}
        ${c('cavalo', 24, 66, 32, { d: .5, z: 2 })}
        ${c('bota', 56, 74, 22, { a: 'stomp', d: .7, z: 2 })}
        ${c('violao', 80, 34, 16, { r: 20, a: 'swing', d: .9 })}`,
    },
    brinde: {
      nome: 'Brinde Dourado', cat: 'Adulto', premium: true, pre: 'Vamos celebrar',
      swatch: 'linear-gradient(#1c1430,#0e0b1a)',
      html: () => `
        <div class="bg" style="background:radial-gradient(circle at 50% 35%,#2b2148,#120d22 60%,#0a0814)"></div>
        ${confeteDourado(70)}
        ${svg(`<rect x="4" y="4" width="92" height="142" rx="3" fill="none" stroke="#d9b45a" stroke-width=".5"/><rect x="6" y="6" width="88" height="138" rx="2" fill="none" stroke="#d9b45a" stroke-width=".2"/>`)}
        ${c('balao', 78, 3, 17, { a: 'float', d: .3 })}
        ${c('confete', 6, 4, 17, { a: 'pop', d: .1 })}
        ${c('tacas', 0, 62, 40, { a: 'swing', d: .5, z: 2 })}
        ${c('champanhe', 60, 56, 40, { r: 14, d: .7, z: 2 })}`,
    },
  };
})();
