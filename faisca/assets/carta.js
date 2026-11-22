// Monta o HTML das cartas Faísca (usado no jogo, na landing page e no PDF).
window.FaiscaCarta = (() => {
  const ROMANO = ["I", "II", "III", "IV"];
  const FLAME = '<svg class="fc-flame" viewBox="0 0 24 32" aria-hidden="true"><path d="M12.6 1c1.2 5.6-2.8 8.4-5 12.2C5.9 16.1 5 18.4 5 21.3 5 26.6 8.1 31 12 31s7-4.4 7-9.6c0-3.3-1.4-5.9-3.3-7.9.3 2.6-.6 4.6-2.4 5.4.9-5.6-.4-12.7-.7-17.9z"/><path d="M12 31c-2.2 0-3.6-1.9-3.6-4.3 0-2.6 1.9-4.2 3.1-6.3.4 1.9 1.5 2.6 2.3 2.6.1 1-.2 2 .1 2.8.9-.4 1.4-1.2 1.6-2.1.6 1 .9 2 .9 3C16.4 29 14.3 31 12 31z" opacity=".55"/></svg>';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // troca {par}/{voce} por nomes, ou por um texto genérico quando não há nomes
  function texto(t, voce, par) {
    if (par) return t.replaceAll("{voce}", voce).replaceAll("{par}", par);
    return t
      .replace(/\bde \{par\}/g, "do seu amor")
      .replace(/\bem \{par\}/g, "no seu amor")
      .replace(/(^|[.!?] )\{par\}/g, "$1Seu amor")
      .replaceAll("{par}", "o seu amor")
      .replaceAll("{voce}", "você");
  }

  const tamanho = t => (t.length > 120 ? "lg" : t.length > 80 ? "md" : "");
  const dots = n => [1, 2, 3].map(i => `<b class="${i <= n ? "on" : ""}"></b>`).join("");

  function frente({ tipo, txt, nivel, nome }) {
    const n = nivel + 1;
    return `<div class="fc-card front lv-${n}"><div class="fc-frame"><i class="fc-corner"></i><i class="fc-corner"></i>
      <div class="fc-top"><span class="fc-type">${tipo === "desafio" ? "Desafio" : "Pergunta"}</span><span class="fc-lv">${ROMANO[nivel]}</span></div>
      <div class="fc-body"><span class="fc-orn">${FLAME}</span><div class="fc-text ${tamanho(txt)}">${esc(txt)}</div></div>
      <div class="fc-bottom"><span class="fc-dots">${dots(n)}</span><span class="fc-brand">${esc(nome || "Faísca")}</span></div>
    </div></div>`;
  }

  function verso({ nivel, nome }) {
    return `<div class="fc-card back lv-${nivel + 1}"><div class="fc-frame"><i class="fc-corner"></i><i class="fc-corner"></i>
      <div class="fc-seal">${FLAME}</div>
      <div class="fc-name">FAÍSCA</div>
      <div class="fc-sub"><b>${esc(nome)}</b>Nível ${ROMANO[nivel]}</div>
    </div></div>`;
  }

  return { frente, verso, texto, FLAME };
})();
