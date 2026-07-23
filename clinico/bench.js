/* ==========================================================================
   bench.js — camada da área acadêmica de saúde
   Carregado DEPOIS de app.js. Não altera o motor; só o orquestra por cima.

   Faz duas coisas:
   1. Revelação progressiva — abre/fecha os painéis sob demanda.
   2. A REGRA FORTE — o aviso de honestidade se revela sozinho quando o motor
      publica lacunas do recorte. Nunca pode ser desligado: é a coluna ética
      do projeto virando comportamento.
   ========================================================================== */

(function bench() {
  "use strict";

  /* ---- 1. Revelação progressiva ------------------------------------------ */
  const toggles = [...document.querySelectorAll(".disclosure-toggle")];
  const panels = toggles
    .map((toggle) => document.getElementById(toggle.dataset.panel))
    .filter(Boolean);

  function closePanels() {
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
    });
    panels.forEach((panel) => {
      panel.hidden = true;
    });
  }

  function openPanel(targetToggle) {
    const targetPanel = document.getElementById(targetToggle.dataset.panel);
    if (!targetPanel) return;

    if (targetToggle.getAttribute("aria-expanded") === "true") {
      closePanels();
      return;
    }

    toggles.forEach((toggle) => {
      const isTarget = toggle === targetToggle;
      toggle.setAttribute("aria-expanded", String(isTarget));
    });
    panels.forEach((panel) => {
      panel.hidden = panel !== targetPanel;
    });
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => openPanel(toggle));
  });

  /* ---- 2. A regra forte: honestidade que se auto-revela ------------------ */
  const HEALTHY = "metadados mínimos presentes para triagem inicial";
  const banner = document.getElementById("honestyBanner");
  const bannerText = document.getElementById("honestyText");
  let latestEvidenceStatus = null;

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

  function refreshHonesty() {
    if (!banner || !bannerText) return;

    // A regra forte só atua depois que o perfil acadêmico é informado.
    if (!window.__academicAccess) {
      banner.hidden = true;
      return;
    }

    const read = latestEvidenceStatus;

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

  // Contrato explícito entre o motor modular e a camada ética.
  window.addEventListener("dod:evidence-status", (event) => {
    latestEvidenceStatus = event.detail || null;
    refreshHonesty();
  });
})();
