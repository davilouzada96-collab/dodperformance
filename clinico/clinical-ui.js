import { emptyClinicalInput, evaluateClinicalInput } from "./clinical-flow.js?v=20260724-search";

const form = document.querySelector("#clinicalCaseForm");
if (!form) throw new Error("Formulário clínico não encontrado.");

const fields = {
  age: form.querySelector("#clinicalAge"),
  symptom: form.querySelector("#clinicalSymptom"),
  durationDays: form.querySelector("#clinicalDuration"),
  severity: form.querySelector("#clinicalSeverity"),
  fever: form.querySelector("#clinicalFever"),
  dyspnea: form.querySelector("#clinicalDyspnea"),
  chestPain: form.querySelector("#clinicalChestPain"),
  dehydration: form.querySelector("#clinicalDehydration"),
  pregnancy: form.querySelector("#clinicalPregnancy"),
  immunosuppression: form.querySelector("#clinicalImmunosuppression"),
};

const resultEls = {
  status: document.querySelector("#clinicalResultStatus"),
  facts: document.querySelector("#clinicalFacts"),
  interpretation: document.querySelector("#clinicalInterpretation"),
  alerts: document.querySelector("#clinicalAlerts"),
  nextSteps: document.querySelector("#clinicalNextSteps"),
  limits: document.querySelector("#clinicalLimits"),
  evidenceState: document.querySelector("#clinicalEvidenceState"),
  evidenceCount: document.querySelector("#clinicalEvidenceCount"),
  meshTerms: document.querySelector("#clinicalMeshTerms"),
  evidenceList: document.querySelector("#clinicalEvidenceList"),
};

const researchForm = document.querySelector("#researchForm");
const topicInput = document.querySelector("#topicInput");
const searchCaseButton = document.querySelector("#searchClinicalEvidence");
const clearCaseButton = document.querySelector("#clearClinicalCase");

function currentInput() {
  return {
    age: fields.age.value,
    symptom: fields.symptom.value,
    durationDays: fields.durationDays.value,
    severity: fields.severity.value,
    fever: fields.fever.checked,
    dyspnea: fields.dyspnea.checked,
    chestPain: fields.chestPain.checked,
    dehydration: fields.dehydration.checked,
    pregnancy: fields.pregnancy.checked,
    immunosuppression: fields.immunosuppression.checked,
  };
}

function replaceList(element, items) {
  const fragment = document.createDocumentFragment();
  items.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    fragment.append(item);
  });
  element.replaceChildren(fragment);
}

function renderClinicalResult() {
  const result = evaluateClinicalInput(currentInput());
  resultEls.status.textContent = result.statusLabel;
  resultEls.status.dataset.status = result.status;
  replaceList(resultEls.facts, result.facts);
  resultEls.interpretation.textContent = result.interpretation;
  replaceList(resultEls.alerts, result.alerts);
  replaceList(resultEls.nextSteps, result.nextSteps);
  replaceList(resultEls.limits, result.limits);
}

function evidenceTypeLabel(value) {
  const labels = {
    guideline: "Diretriz",
    "systematic-review": "Revisão sistemática",
    "meta-analysis": "Meta-análise",
    review: "Revisão",
    trial: "Ensaio clínico",
    article: "Artigo",
    other: "Registro",
  };
  return labels[value] || "Registro";
}

function evidenceUrl(paper) {
  if (paper.pmid) {
    const pmid = String(paper.pmid).replace(/\D/g, "");
    if (pmid) return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  }
  return paper.sourceUrl || paper.doi || "#";
}

function createEvidenceRow(paper) {
  const item = document.createElement("li");
  item.className = "clinical-evidence-row";

  const body = document.createElement("div");
  body.className = "clinical-evidence-body";
  const title = document.createElement("a");
  title.className = "clinical-evidence-title";
  title.href = evidenceUrl(paper);
  title.target = "_blank";
  title.rel = "noopener noreferrer";
  title.textContent = paper.title || "Título não informado";

  const meta = document.createElement("p");
  meta.className = "clinical-evidence-meta";
  const pmid = paper.pmid ? `PMID ${String(paper.pmid).replace(/\D/g, "")}` : "sem PMID";
  meta.textContent = [paper.journal, paper.year, pmid].filter(Boolean).join(" · ");

  const summary = document.createElement("p");
  summary.className = "clinical-evidence-summary";
  const abstract = String(paper.abstract || "").replace(/\s+/g, " ").trim();
  summary.textContent = abstract
    ? `${abstract.slice(0, 280)}${abstract.length > 280 ? "…" : ""}`
    : "Resumo não disponível no registro recuperado. Consulte a fonte original.";

  const badges = document.createElement("div");
  badges.className = "clinical-evidence-badges";
  [evidenceTypeLabel(paper.evidenceType), "PubMed"].forEach((text) => {
    const badge = document.createElement("span");
    badge.textContent = text;
    badges.append(badge);
  });

  body.append(title, meta, summary, badges);
  item.append(body);
  return item;
}

function renderEvidence(detail) {
  const papers = Array.isArray(detail.papers) ? detail.papers : [];
  const mesh = Array.isArray(detail.synthesis?.topMesh) ? detail.synthesis.topMesh : [];
  resultEls.evidenceCount.textContent = String(papers.length);
  resultEls.evidenceList.replaceChildren(...papers.slice(0, 10).map(createEvidenceRow));

  resultEls.meshTerms.replaceChildren();
  mesh.forEach((term) => {
    const chip = document.createElement("span");
    chip.textContent = term;
    resultEls.meshTerms.append(chip);
  });

  if (!papers.length) {
    if (detail.error) {
      resultEls.evidenceState.textContent =
        "O PubMed não respondeu nesta tentativa. Nenhuma base local foi usada como substituição.";
    } else if (detail.hasSearch && Number(detail.totalRetrieved) > 0) {
      resultEls.evidenceState.textContent =
        "Nenhum registro permanece com os filtros atuais. Ajuste o refinamento para rever os resultados recuperados.";
    } else if (detail.hasSearch) {
      resultEls.evidenceState.textContent =
        "O PubMed não retornou registros para esta estratégia. Revise os termos e tente novamente.";
    } else {
      resultEls.evidenceState.textContent =
        "Pesquise um tema ou use a queixa principal para recuperar evidências no PubMed.";
    }
    return;
  }

  resultEls.evidenceState.textContent = mesh.length
    ? `Resultados rastreáveis do PubMed. Os termos MeSH abaixo foram extraídos dos registros recuperados.`
    : "Resultados rastreáveis do PubMed; os registros desta rodada não trouxeram termos MeSH suficientes.";
}

form.addEventListener("input", renderClinicalResult);
form.addEventListener("change", renderClinicalResult);

searchCaseButton.addEventListener("click", () => {
  const symptom = fields.symptom.value.trim();
  if (!symptom) {
    fields.symptom.focus();
    fields.symptom.setAttribute("aria-invalid", "true");
    return;
  }
  fields.symptom.removeAttribute("aria-invalid");
  topicInput.value = symptom;
  researchForm.requestSubmit();
});

clearCaseButton.addEventListener("click", () => {
  form.reset();
  Object.entries(emptyClinicalInput).forEach(([field, value]) => {
    if (typeof value === "boolean") fields[field].checked = value;
    else fields[field].value = value;
  });
  renderClinicalResult();
  window.dispatchEvent(new CustomEvent("dod:clear-evidence"));
  fields.age.focus();
});

researchForm.addEventListener("submit", () => {
  resultEls.evidenceState.textContent = "Consultando PubMed e preparando os termos MeSH…";
});

window.addEventListener("dod:evidence-results", (event) => {
  renderEvidence(event.detail || {});
});

renderClinicalResult();
renderEvidence({ papers: [], synthesis: { topMesh: [] } });
