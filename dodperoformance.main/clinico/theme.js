const STORAGE_KEY = "dod-theme";

export function initTheme() {
  const toggle = document.querySelector("[data-theme-toggle]");

  applyTheme(getStoredTheme());

  if (!toggle) {
    return;
  }

  toggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}

function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEY) || "dark";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}
