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

  const PROFILE_KEY = "dodAcademicProfile";
  const currentYear = new Date().getFullYear();
  graduationYear.max = String(currentYear + 15);

  function looksLikeEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setError(message) {
    errorEl.textContent = message || "";
  }

  function validate() {
    if (!role.value) return "Selecione se você é estudante ou profissional da saúde.";
    if (!looksLikeEmail(email.value.trim())) return "Informe um e-mail institucional válido.";
    if (!institution.value.trim()) return "Informe sua universidade, instituição ou conselho.";

    const year = Number(graduationYear.value);
    if (!Number.isInteger(year) || year < 1950 || year > currentYear + 15) {
      return "Informe um ano de formação ou conclusão válido.";
    }
    if (!declare.checked) return "Confirme a declaração acadêmica para continuar.";
    return "";
  }

  function roleLabel(value) {
    return value === "profissional" ? "Profissional da saúde" : "Estudante da saúde";
  }

  function updateRoleCopy() {
    const isProfessional = role.value === "profissional";
    emailLabel.textContent = isProfessional
      ? "E-mail profissional ou institucional"
      : "E-mail da universidade ou institucional";
    email.placeholder = isProfessional
      ? "voce@hospital.org.br"
      : "voce@universidade.edu.br";
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
    overlay.hidden = true;

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
      setError(problem);
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
    overlay.hidden = false;
    email.focus();
  });

  function restoreProfile() {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (!saved) return;
      const profile = JSON.parse(saved);
      if (
        profile &&
        (profile.role === "estudante" || profile.role === "profissional") &&
        profile.institution &&
        profile.graduationYear
      ) {
        enterAcademicArea(profile);
      }
    } catch (error) {
      try {
        localStorage.removeItem(PROFILE_KEY);
      } catch (storageError) {}
    }
  }

  updateRoleCopy();
  restoreProfile();
})();
