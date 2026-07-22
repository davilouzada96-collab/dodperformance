/* ==========================================================================
   bench.js — camada da área acadêmica de saúde
   Carregado DEPOIS de app.js. Não altera o motor; só o orquestra por cima.

   Faz duas coisas:
   1. Revelação progressiva — abre/fecha os painéis sob demanda.
   2. A REGRA FORTE — o aviso de honestidade se revela sozinho quando a
      evidência do conjunto é fraca, usando a própria função de lacunas do
      motor (buildGapText) como fonte única da verdade. Nunca pode ser
      desligado: é a coluna ética do projeto virando comportamento.
   ========================================================================== */

(function bench() {
  "use strict";

  /* ---- 1. Revelação progressiva ------------------------------------------ */
  const toggles = document.querySelectorAll(".disclosure-toggle");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const panel = document.getElementById(toggle.dataset.panel);
      if (!panel) return;
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;
    });
  });

  /* ---- 2. A regra forte: honestidade que se auto-revela ------------------ */
  const HEALTHY = "conjunto saudável para triagem inicial";
  const banner = document.getElementById("honestyBanner");
  const bannerText = document.getElementById("honestyText");

  // Traduz as lacunas cruas do motor numa frase legível, sem suavizar o aviso.
  function phraseFromGaps(gapText) {
    const parts = gapText
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean);
    if (!parts.length) return "";
    const joined = parts.length === 1
      ? parts[0]
      : parts.slice(0, -1).join(", ") + " e " + parts[parts.length - 1];
    return "Neste recorte: " + joined + ".";
  }

  function safeGapRead() {
    // Usa as funções do próprio motor. Se algo não estiver disponível,
    // a falha é silenciosa — nunca um falso "está tudo bem".
    try {
      if (typeof getFilteredPapers !== "function") return null;
      if (typeof buildSynthesis !== "function") return null;
      if (typeof buildGapText !== "function") return null;
      const filtered = getFilteredPapers();
      if (!filtered || !filtered.length) return { empty: true };
      const synthesis = buildSynthesis(filtered);
      return { empty: false, gap: buildGapText(synthesis) };
    } catch (err) {
      return null;
    }
  }

  function refreshHonesty() {
    if (!banner || !bannerText) return;

    // A regra forte só atua depois que o perfil acadêmico é informado.
    if (!window.__academicAccess) {
      banner.hidden = true;
      return;
    }

    const read = safeGapRead();

    // Sem leitura confiável ou sem resultados: não afirma nada.
    if (!read || read.empty) {
      banner.hidden = true;
      return;
    }
    // Conjunto saudável: a tela fica limpa.
    if (read.gap === HEALTHY) {
      banner.hidden = true;
      return;
    }
    // Evidência fraca: o aviso se empurra para frente, sozinho.
    bannerText.textContent = phraseFromGaps(read.gap);
    banner.hidden = false;
  }

  // A porta de acesso chama isto ao entrar no clínico, religando a honestidade.
  window.__academicActivateHonesty = refreshHonesty;

  // Observa o grid de cards: toda vez que uma busca ou filtro re-renderiza,
  // reavaliamos a honestidade. Decoupled do motor, sem tocá-lo.
  const cards = document.getElementById("cards");
  if (cards) {
    let pending = null;
    const observer = new MutationObserver(() => {
      if (pending) clearTimeout(pending);
      pending = setTimeout(refreshHonesty, 120);
    });
    observer.observe(cards, { childList: true });
  }

  // Reavalia também quando os filtros de qualidade mudam (eles re-renderizam
  // os cards, mas garantimos a checagem mesmo que o resultado visual não mude).
  ["strictEvidence", "cleanSources", "minCitations", "yearSelect", "sortSelect"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", () => setTimeout(refreshHonesty, 120));
  });

  // Primeira avaliação após o carregamento inicial da biblioteca.
  setTimeout(refreshHonesty, 800);
})();
