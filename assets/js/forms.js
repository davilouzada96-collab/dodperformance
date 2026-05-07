export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");

  if (!form || !status) {
    return;
  }

  form.addEventListener("submit", () => {
    status.textContent = "Abrindo seu aplicativo de e-mail.";
  });
}
