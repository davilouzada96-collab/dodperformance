/* ==========================================================================
   gate.js — porta de acesso ao clínico
   Cruzar esta porta é "entrar no clínico": só então a bancada libera e a
   regra forte (honestidade) reativa.

   Interruptor único:
     CLINICO_API = ""            -> modo demonstração (confirmação simulada)
     CLINICO_API = "/api/clinico"-> verificação real pelo Cloudflare Worker

   No modo real, o fluxo é: pedir link -> e-mail -> clicar -> sessão -> entra.
   ========================================================================== */

const CLINICO_API = ""; // troque para "/api/clinico" depois de deployar o Worker

(function gate() {
  "use strict";

  const overlay = document.getElementById("gateOverlay");
  if (!overlay) return;

  const form = document.getElementById("gateForm");
  const email = document.getElementById("gateEmail");
  const role = document.getElementById("gateRole");
  const council = document.getElementById("gateCouncil");
  const declare = document.getElementById("gateDeclare");
  const errorEl = document.getElementById("gateError");
  const submit = document.getElementById("gateSubmit");
  const sent = document.getElementById("gateSent");
  const sentText = document.getElementById("gateSentText");
  const demoEnter = document.getElementById("gateDemoEnter");

  const SESSION_KEY = "dodClinicoVerified";
  const REAL = !!CLINICO_API;

  function looksLikeEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  function validate() {
    if (!declare.checked) return "Confirme a declaração para continuar.";
    if (!looksLikeEmail(email.value.trim())) return "Informe um e-mail válido.";
    if (!role.value) return "Selecione seu papel.";
    return "";
  }
  function setError(m) { errorEl.textContent = m || ""; }

  function enterClinico(profile) {
    window.__clinicoVerified = true;
    window.__clinicoProfile = profile;
    const strip = document.querySelector(".gate-strip .demo-note");
    if (strip && profile) {
      strip.textContent = "Entrou como " +
        (profile.role === "profissional" ? "profissional" : "estudante") +
        (REAL ? "" : " · modo demonstração");
    }
    overlay.hidden = true;
    if (typeof window.__clinicoActivateHonesty === "function") {
      window.__clinicoActivateHonesty();
    }
    if (!REAL) {
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile)); } catch (e) {}
    }
  }

  // No modo demonstração, o botão de simular confirmação aparece; no real, não.
  if (REAL && demoEnter) demoEnter.style.display = "none";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const problem = validate();
    if (problem) { setError(problem); return; }
    setError("");

    if (!REAL) {
      sentText.textContent =
        "Enviamos um link de acesso para " + email.value.trim() +
        ". Abra seu e-mail e confirme para entrar. (No modo demonstração, use o botão abaixo.)";
      sent.hidden = false;
      submit.disabled = true;
      submit.textContent = "Link enviado";
      return;
    }

    // Modo real: pede o link ao Worker.
    submit.disabled = true;
    submit.textContent = "Enviando...";
    try {
      const res = await fetch(CLINICO_API + "/request", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.value.trim(),
          role: role.value,
          council: council.value.trim(),
        }),
      });
      if (!res.ok) throw new Error("falha");
      sentText.textContent =
        "Enviamos um link de acesso para " + email.value.trim() +
        ". Abra seu e-mail e clique para entrar. O link expira em alguns minutos.";
      sent.hidden = false;
      submit.textContent = "Link enviado";
    } catch (e) {
      setError("Não foi possível enviar agora. Tente de novo em instantes.");
      submit.disabled = false;
      submit.textContent = "Receber link de acesso";
    }
  });

  if (demoEnter) {
    demoEnter.addEventListener("click", () => {
      enterClinico({
        role: role.value,
        council: council.value.trim(),
        email: email.value.trim(),
      });
    });
  }

  // Ao carregar: descobrir se já está verificado.
  async function checkExisting() {
    if (REAL) {
      // Pergunta ao Worker se há sessão válida (cookie first-party).
      try {
        const res = await fetch(CLINICO_API + "/session", { credentials: "include" });
        const data = await res.json();
        if (data && data.verified) {
          enterClinico({ role: data.role });
          return;
        }
      } catch (e) {}
      // Mensagens vindas do redirect do Worker.
      const params = new URLSearchParams(location.search);
      if (params.get("erro") === "link") {
        setError("O link expirou ou é inválido. Peça um novo abaixo.");
      }
    } else {
      try {
        const saved = sessionStorage.getItem(SESSION_KEY);
        if (saved) enterClinico(JSON.parse(saved));
      } catch (e) {}
    }
  }
  checkExisting();
})();
