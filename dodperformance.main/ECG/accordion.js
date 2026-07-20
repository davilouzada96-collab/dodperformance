export function initAccordion() {
  const accordions = document.querySelectorAll("[data-accordion]");

  accordions.forEach((accordion) => {
    accordion.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-accordion-trigger]");

      if (!trigger || !accordion.contains(trigger)) {
        return;
      }

      const item = trigger.closest("[data-accordion-item]");
      const panel = item?.querySelector("[data-accordion-panel]");

      if (!item || !panel) {
        return;
      }

      const isOpen = item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
      panel.hidden = !isOpen;
    });
  });
}
