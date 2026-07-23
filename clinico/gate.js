/*
 * Cadastro acadêmico local.
 *
 * Não existe autenticação remota, envio de e-mail, cobrança ou consumo de
 * créditos. O e-mail é apenas validado e não é armazenado; papel, instituição
 * e ano ficam neste navegador para manter a área liberada.
 */

(function academicAccess() {
  "use strict";

  const overlay = document.getElementById("gateOverlay");
  if (!overlay) return;

  const form = document.getElementById("gateForm");
  const email = document.getElementById("gateEmail");
  const emailLabel = document.getElementById("gateEmailLabel");
  const role = document.getElementById("gateRole");
  const institution = document.getElementById("gateInstitution");
  const graduationYear = document.getElementById("gateGraduationYear");
  const declare = document.getElementById("gateDeclare");
  const errorEl = document.getElementById("gateError");
  const profileSummary = document.getElementById("profileSummary");
  const profileReset = document.getElementById("profileReset");
  const gateTitle = document.getElementById("gateTitle");
  const gateCard = overlay.querySelector(".gate-card");
  const backgroundRoots = [
    document.querySelector(".site-header"),
    document.querySelector(".gate-strip"),
    ...document.querySelectorAll(".app-shell > :not(#gateOverlay)"),
  ].filter(Boolean);
  const backgroundState = new Map();

  const PROFILE_KEY = "dodAcademicProfile";
  const currentYear = new Date().getFullYear();
  graduationYear.max = String(currentYear + 15);

  function looksLikeEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setError(message, field = null) {
    form.querySelectorAll("[aria-invalid='true']").forEach((item) => item.removeAttribute("aria-invalid"));
    errorEl.textContent = message || "";
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.focus();
    }
  }

  function validate() {
    if (!role.value) return { message: "Selecione se você é estudante ou profissional da saúde.", field: role };
    if (!looksLikeEmail(email.value.trim())) return { message: "Informe um e-mail em formato válido.", field: email };
    if (!institution.value.trim()) return { message: "Informe sua universidade, instituição ou conselho.", field: institution };

    const year = Number(graduationYear.value);
    if (!Number.isInteger(year) || year < 1950 || year > currentYear + 15) {
      return { message: "Informe um ano de formação ou conclusão válido.", field: graduationYear };
    }
    if (!declare.checked) return { message: "Confirme a declaração acadêmica para continuar.", field: declare };
    return null;
  }

  function roleLabel(value) {
    return value === "profissional" ? "Profissional da saúde" : "Estudante da saúde";
  }

  function updateRoleCopy() {
    const isProfessional = role.value === "profissional";
    emailLabel.textContent = isProfessional
      ? "E-mail profissional ou institucional (não verificado)"
      : "E-mail acadêmico ou institucional (não verificado)";
    email.placeholder = isProfessional
      ? "voce@hospital.org.br"
      : "voce@universidade.edu.br";
  }

  function setBackgroundInert(isInert) {
    backgroundRoots.forEach((element) => {
      if (isInert) {
        if (!backgroundState.has(element)) {
          backgroundState.set(element, {
            inert: element.inert,
            ariaHidden: element.getAttribute("aria-hidden"),
          });
        }
        element.inert = true;
        element.setAttribute("aria-hidden", "true");
        return;
      }

      const previous = backgroundState.get(element);
      element.inert = previous?.inert || false;
      if (previous?.ariaHidden === null || previous?.ariaHidden === undefined) {
        element.removeAttribute("aria-hidden");
      } else {
        element.setAttribute("aria-hidden", previous.ariaHidden);
      }
    });

    if (!isInert) backgroundState.clear();
  }

  function setGateOpen(isOpen) {
    overlay.hidden = !isOpen;
    setBackgroundInert(isOpen);
    document.body.classList.toggle("modal-open", isOpen);
    if (isOpen) requestAnimationFrame(() => gateTitle.focus());
  }

  function enterAcademicArea(profile) {
    const academicProfile = {
      role: profile.role,
      institution: profile.institution,
      graduationYear: profile.graduationYear,
    };
    window.__academicAccess = true;
    window.__academicProfile = academicProfile;
    profileSummary.textContent = `${roleLabel(academicProfile.role)} · ${academicProfile.institution} · ${academicProfile.graduationYear}`;
    setGateOpen(false);

    if (typeof window.__academicActivateHonesty === "function") {
      window.__academicActivateHonesty();
    }
  }

  function saveProfile(profile) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({
        role: profile.role,
        institution: profile.institution,
        graduationYear: profile.graduationYear,
      }));
    } catch (error) {
      // O acesso continua funcionando mesmo se o navegador bloquear storage.
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem.message, problem.field);
      return;
    }

    const profile = {
      role: role.value,
      email: email.value.trim(),
      institution: institution.value.trim(),
      graduationYear: Number(graduationYear.value),
    };

    setError("");
    saveProfile(profile);
    enterAcademicArea(profile);
  });

  role.addEventListener("change", updateRoleCopy);

  profileReset.addEventListener("click", () => {
    try {
      localStorage.removeItem(PROFILE_KEY);
    } catch (error) {}

    window.__academicAccess = false;
    window.__academicProfile = null;
    form.reset();
    updateRoleCopy();
    setError("");
    setGateOpen(true);
  });

  gateCard.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...gateCard.querySelectorAll(
      "button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"
    )].filter((item) => item.getClientRects().length);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (document.activeElement === gateTitle) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function restoreProfile() {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (!saved) return false;
      const profile = JSON.parse(saved);
      if (
        profile &&
        (profile.role === "estudante" || profile.role === "profissional") &&
        profile.institution &&
        profile.graduationYear
      ) {
        enterAcademicArea(profile);
        return true;
      }
    } catch (error) {
      try {
        localStorage.removeItem(PROFILE_KEY);
      } catch (storageError) {}
    }
    return false;
  }

  updateRoleCopy();
  if (!restoreProfile()) setGateOpen(true);
})();
