import { researchCards, researchCategories } from "./research-data.js";

const state = {
  category: "all",
  query: ""
};

let lastFocusedElement = null;

export function initResearchCards() {
  const grid = document.querySelector("[data-research-grid]");
  const filters = document.querySelector("[data-research-filters]");
  const search = document.querySelector("[data-research-search]");
  const modal = document.querySelector("[data-research-modal]");

  if (!grid || !filters || !search || !modal) {
    return;
  }

  renderFilters(filters, grid);
  renderCards(grid);

  search.addEventListener("input", () => {
    state.query = search.value.trim().toLowerCase();
    renderCards(grid);
  });

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-card]");
    if (!button) {
      return;
    }

    const card = researchCards.find((item) => item.id === button.dataset.openCard);
    if (card) {
      openModal(modal, card, button);
    }
  });

  modal.addEventListener("click", (event) => {
    if (event.target.matches("[data-modal-close]")) {
      closeModal(modal);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal(modal);
    }
  });
}

function renderFilters(filters, grid) {
  filters.innerHTML = researchCategories
    .map((category) => `
      <button class="research-filter${category.id === state.category ? " is-active" : ""}" type="button" data-category="${escapeAttribute(category.id)}" aria-pressed="${category.id === state.category}">
        ${escapeHtml(category.label)}
      </button>
    `)
    .join("");

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) {
      return;
    }

    state.category = button.dataset.category;
    filters.querySelectorAll("[data-category]").forEach((item) => {
      const isActive = item.dataset.category === state.category;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    renderCards(grid);
  });
}

function renderCards(grid) {
  const visibleCards = researchCards.filter((card) => {
    const matchesCategory = state.category === "all" || card.category === state.category;
    const category = researchCategories.find((item) => item.id === card.category);
    const searchable = [
      card.title,
      card.summary,
      category?.label,
      card.tags.join(" "),
      card.mesh.term,
      card.mesh.tree,
      card.citation,
      card.body.join(" ")
    ].join(" ").toLowerCase();
    return matchesCategory && searchable.includes(state.query);
  });

  grid.innerHTML = visibleCards.length
    ? visibleCards.map(renderCard).join("")
    : `<p class="research-empty">Nenhum card encontrado para esse filtro.</p>`;
}

function renderCard(card) {
  return `
    <article class="research-card" style="--card-accent: ${escapeAttribute(card.accent)}">
      <div class="research-card__media" aria-hidden="true">${escapeHtml(card.mark)}</div>
      <div class="research-card__tags">${card.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.summary)}</p>
      <div class="research-card__actions">
        <a href="${escapeAttribute(card.source)}" target="_blank" rel="noopener noreferrer">fonte cientifica</a>
        <button type="button" data-open-card="${escapeAttribute(card.id)}">ler</button>
      </div>
    </article>
  `;
}

function openModal(modal, card, trigger) {
  lastFocusedElement = trigger;
  modal.style.setProperty("--modal-accent", card.accent);
  modal.querySelector("[data-modal-media]").textContent = card.mark;
  modal.querySelector("[data-modal-tags]").innerHTML = card.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  modal.querySelector("[data-modal-title]").textContent = card.title;
  modal.querySelector("[data-modal-summary]").textContent = card.summary;
  modal.querySelector("[data-modal-mesh]").innerHTML = `
    <strong>MeSH</strong>
    <a href="${escapeAttribute(card.mesh.uri)}" target="_blank" rel="noopener noreferrer">${escapeHtml(card.mesh.term)}</a>
    <span>${escapeHtml(card.mesh.tree)}</span>
  `;
  modal.querySelector("[data-modal-body]").innerHTML = `
    <h3>Aplicacao DOD</h3>
    <ul>${card.body.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
  `;
  modal.querySelector("[data-modal-source]").href = card.source;
  const copyButton = modal.querySelector("[data-copy-cite]");
  copyButton.textContent = "Copiar citacao";
  copyButton.onclick = async () => {
    const copied = await copyText(card.citation);
    copyButton.textContent = copied ? "Citacao copiada" : "Nao foi possivel copiar";
  };
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modal.querySelector("[data-modal-close]")?.focus();
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocusedElement?.focus();
  lastFocusedElement = null;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      return copyTextFallback(text);
    }
  }

  return copyTextFallback(text);
}

function copyTextFallback(text) {
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();

  try {
    return document.execCommand("copy");
  } catch (error) {
    return false;
  } finally {
    input.remove();
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    };
    return entities[character];
  });
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
