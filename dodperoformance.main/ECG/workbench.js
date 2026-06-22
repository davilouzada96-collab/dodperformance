import { analyzeEcgRecording, createDemoRecording, parseEcgText } from "./ecg-signal.js?v=20260617-local-signal";

const AXIS_SELECTOR = "[data-axis]";

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function isSignalFile(file) {
  return /\.(csv|txt)$/i.test(file.name) || file.type === "text/csv" || file.type === "text/plain";
}

function percentile(values, ratio) {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor(sorted.length * ratio)));
  return sorted[index];
}

function drawSignal(canvas, samples, samplingRate, peaks = []) {
  const context = canvas.getContext("2d");
  const width = 1_000;
  const height = 260;
  const visibleCount = Math.min(samples.length, Math.round(samplingRate * 5));
  const visible = samples.slice(0, visibleCount);
  const low = percentile(visible, 0.02);
  const high = percentile(visible, 0.98);
  const range = Math.max(1e-9, high - low);

  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#071221";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(66, 232, 255, 0.08)";
  context.lineWidth = 1;
  for (let x = 0; x <= width; x += 20) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 0; y <= height; y += 20) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  context.strokeStyle = "#42e8ff";
  context.lineWidth = 2;
  context.beginPath();
  visible.forEach((value, index) => {
    const x = (index / Math.max(1, visibleCount - 1)) * width;
    const y = height - 20 - ((value - low) / range) * (height - 40);
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();

  context.fillStyle = "#ffb35c";
  peaks.filter((peak) => peak < visibleCount).forEach((peak) => {
    const x = (peak / Math.max(1, visibleCount - 1)) * width;
    context.beginPath();
    context.arc(x, 14, 3, 0, Math.PI * 2);
    context.fill();
  });
}

export function initEcgWorkbench() {
  const fileInput = document.querySelector("#ecgFile");
  const preview = document.querySelector("#ecgPreview");
  const samplingRateInput = document.querySelector("#ecgSamplingRate");
  const leadSelect = document.querySelector("#ecgLead");
  const analyzeButton = document.querySelector("#ecgAnalyzeSignal");
  const demoButton = document.querySelector("#ecgLoadDemo");
  const analysis = document.querySelector("#ecgAnalysis");
  const analysisStatus = document.querySelector("#ecgAnalysisStatus");
  const analysisMetrics = document.querySelector("#ecgAnalysisMetrics");
  const analysisFindings = document.querySelector("#ecgAnalysisFindings");
  const form = document.querySelector("#ecgAxisForm");
  const summary = document.querySelector("#ecgSummary");
  const summaryText = document.querySelector("#ecgSummaryText");
  const copyButton = document.querySelector("#ecgCopySummary");
  const resetButton = document.querySelector("#ecgResetWorkbench");

  const required = [fileInput, preview, samplingRateInput, leadSelect, analyzeButton, demoButton, analysis,
    analysisStatus, analysisMetrics, analysisFindings, form, summary, summaryText, copyButton, resetButton];
  if (required.some((element) => !element)) return;

  let previewUrl = "";
  let currentRecording = null;
  let currentAnalysis = null;
  let currentRawText = "";
  let currentFileLabel = "não informado";

  function releasePreview() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = "";
    }
  }

  function resetAutomaticState() {
    currentRecording = null;
    currentAnalysis = null;
    currentRawText = "";
    leadSelect.replaceChildren(new Option("Detectada automaticamente", ""));
    leadSelect.disabled = true;
    analyzeButton.disabled = true;
    analysis.hidden = true;
    analysisMetrics.replaceChildren();
    analysisFindings.replaceChildren();
  }

  function showPreviewMessage(message, tone = "") {
    preview.replaceChildren();
    const text = createElement("span", tone ? `ecg-upload__message ecg-upload__message--${tone}` : "ecg-upload__message", message);
    preview.append(text);
  }

  function populateLeads(recording) {
    leadSelect.replaceChildren();
    recording.leads.forEach((lead) => leadSelect.append(new Option(lead.name, lead.name)));
    const preferred = recording.leads.find((lead) => lead.name === "II") || recording.leads[0];
    leadSelect.value = preferred.name;
    leadSelect.disabled = false;
  }

  function renderSignalPreview(recording, label, peaks = []) {
    preview.replaceChildren();
    const selected = recording.leads.find((lead) => lead.name === leadSelect.value)
      || recording.leads.find((lead) => lead.name === "II")
      || recording.leads[0];
    const head = createElement("div", "ecg-signal-preview__head");
    head.append(
      createElement("strong", "", `${label} · derivação ${selected.name}`),
      createElement("span", "", `${recording.duration.toFixed(1)} s · ${Math.round(recording.samplingRate)} Hz · ${recording.leads.length} canal(is)`),
    );
    const canvas = createElement("canvas", "ecg-signal-preview__canvas");
    canvas.setAttribute("aria-label", `Prévia dos primeiros cinco segundos da derivação ${selected.name}`);
    preview.append(head, canvas);
    drawSignal(canvas, selected.samples, recording.samplingRate, peaks);
  }

  async function loadFile(file) {
    releasePreview();
    resetAutomaticState();

    if (!file) {
      currentFileLabel = "não informado";
      showPreviewMessage("Nenhum traçado selecionado.");
      return;
    }

    currentFileLabel = file.name;
    if (isSignalFile(file)) {
      showPreviewMessage("Lendo amostras localmente…");
      try {
        currentRawText = await file.text();
        currentRecording = parseEcgText(currentRawText, samplingRateInput.value, file.size);
        samplingRateInput.value = String(Math.round(currentRecording.samplingRate));
        populateLeads(currentRecording);
        analyzeButton.disabled = false;
        renderSignalPreview(currentRecording, file.name);
      } catch (error) {
        showPreviewMessage(error.message || "Não foi possível ler o sinal.", "error");
      }
      return;
    }

    if (file.type.startsWith("image/")) {
      previewUrl = URL.createObjectURL(file);
      preview.replaceChildren();
      const image = createElement("img");
      image.src = previewUrl;
      image.alt = "Prévia local do eletrocardiograma selecionado";
      preview.append(image, createElement("span", "", file.name));
      return;
    }

    if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
      preview.replaceChildren(
        createElement("strong", "", "PDF selecionado"),
        createElement("span", "", file.name),
      );
      return;
    }

    showPreviewMessage("Formato não reconhecido. Use CSV, TXT, PNG, JPG ou PDF.", "error");
  }

  function addMetric(label, value, detail) {
    const card = createElement("div", "ecg-analysis__metric");
    card.append(
      createElement("span", "", label),
      createElement("strong", "", value),
      createElement("small", "", detail),
    );
    analysisMetrics.append(card);
  }

  function renderAnalysis(result) {
    currentAnalysis = result;
    analysis.hidden = false;
    analysisStatus.textContent = `Confiança ${result.confidence.toLowerCase()}`;
    analysisStatus.dataset.tone = result.confidence === "Moderada" ? "ok" : "limited";
    analysisMetrics.replaceChildren();
    analysisFindings.replaceChildren();

    addMetric("Qualidade", `${result.quality.score}/100`, result.quality.label);
    addMetric("Frequência estimada", result.rate === null ? "—" : `${result.rate} bpm`, result.rate === null ? "batimentos insuficientes" : `RR mediano ${result.medianRr.toFixed(3)} s`);
    addMetric("Regularidade RR", result.rhythmLabel, result.variability === null ? "não calculada" : `variabilidade ${Math.round(result.variability * 100)}%`);
    addMetric("Complexos detectados", String(result.beatCount), `${result.duration.toFixed(1)} s analisados em ${result.lead}`);

    result.findings.forEach((finding) => {
      const item = createElement("div", `ecg-analysis__finding ecg-analysis__finding--${finding.tone}`);
      item.append(createElement("strong", "", finding.title), createElement("p", "", finding.text));
      analysisFindings.append(item);
    });

    form.querySelectorAll(AXIS_SELECTOR).forEach((select) => {
      const automaticValue = result.automaticAxes[select.dataset.axis];
      if (automaticValue) select.value = automaticValue;
    });

    renderSignalPreview(currentRecording, currentFileLabel, result.peaks);
    analysis.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function analyzeCurrentSignal() {
    if (!currentRecording) return;
    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analisando localmente…";
    window.setTimeout(() => {
      try {
        renderAnalysis(analyzeEcgRecording(currentRecording, leadSelect.value));
      } catch (error) {
        analysis.hidden = false;
        analysisStatus.textContent = "Falha na leitura";
        analysisMetrics.replaceChildren();
        analysisFindings.replaceChildren(createElement("p", "ecg-upload__message--error", error.message || "Não foi possível analisar este sinal."));
      } finally {
        analyzeButton.disabled = false;
        analyzeButton.textContent = "Analisar sinal localmente";
      }
    }, 60);
  }

  function buildSummary() {
    const recordType = document.querySelector("#ecgRecordType").value;
    const context = document.querySelector("#ecgContext").value;
    const notes = document.querySelector("#ecgNotes").value.trim();
    const axes = [...form.querySelectorAll(AXIS_SELECTOR)].map((select) => ({
      label: select.dataset.axis,
      value: select.value,
    }));
    const flagged = axes.filter((axis) => axis.value === "Achado a revisar");
    const notAssessed = axes.filter((axis) => axis.value === "Não avaliado");
    const automaticBlock = currentAnalysis ? [
      "",
      "TRIAGEM AUTOMÁTICA EXPERIMENTAL DO SINAL",
      `Derivação analisada: ${currentAnalysis.lead}`,
      `Qualidade: ${currentAnalysis.quality.score}/100 (${currentAnalysis.quality.label})`,
      `Frequência estimada: ${currentAnalysis.rate === null ? "não calculada" : `${currentAnalysis.rate} bpm`}`,
      `Regularidade: ${currentAnalysis.rhythmLabel}`,
      `Complexos detectados: ${currentAnalysis.beatCount}`,
      `Confiança técnica: ${currentAnalysis.confidence}`,
      ...currentAnalysis.findings.map((finding) => `- ${finding.title}: ${finding.text}`),
    ] : [];

    return [
      "LEITURA ACADÊMICA ESTRUTURADA DO ECG",
      "",
      `Arquivo local: ${currentFileLabel}`,
      `Registro: ${recordType}`,
      `Contexto: ${context}`,
      ...automaticBlock,
      "",
      "EIXOS DE REVISÃO",
      ...axes.map((axis) => `- ${axis.label}: ${axis.value}.`),
      "",
      `Achados marcados para revisão: ${flagged.length ? flagged.map((axis) => axis.label).join(", ") : "nenhum"}.`,
      `Eixos não avaliados: ${notAssessed.length ? notAssessed.map((axis) => axis.label).join(", ") : "nenhum"}.`,
      notes ? `Observações: ${notes}` : "Observações: não informadas.",
      "",
      "Limites: análise acadêmica e experimental. As medidas automáticas dependem da qualidade, da amostragem e da derivação escolhida. O resultado não confirma diagnóstico, não estima sozinho risco de AVC, não indica tratamento e exige revisão do traçado por profissional habilitado.",
    ].join("\n");
  }

  fileInput.addEventListener("change", () => { void loadFile(fileInput.files?.[0]); });

  demoButton.addEventListener("click", () => {
    releasePreview();
    resetAutomaticState();
    currentRecording = createDemoRecording();
    currentFileLabel = "sinal demonstrativo sintético";
    samplingRateInput.value = String(currentRecording.samplingRate);
    populateLeads(currentRecording);
    analyzeButton.disabled = false;
    renderSignalPreview(currentRecording, currentFileLabel);
  });

  samplingRateInput.addEventListener("change", () => {
    if (!currentRawText) return;
    try {
      currentRecording = parseEcgText(currentRawText, samplingRateInput.value);
      populateLeads(currentRecording);
      renderSignalPreview(currentRecording, currentFileLabel);
      currentAnalysis = null;
      analysis.hidden = true;
    } catch (error) {
      showPreviewMessage(error.message || "Frequência de amostragem inválida.", "error");
      analyzeButton.disabled = true;
    }
  });

  leadSelect.addEventListener("change", () => {
    if (!currentRecording) return;
    currentAnalysis = null;
    analysis.hidden = true;
    renderSignalPreview(currentRecording, currentFileLabel);
  });

  analyzeButton.addEventListener("click", analyzeCurrentSignal);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    summaryText.textContent = buildSummary();
    summary.hidden = false;
    summary.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(summaryText.textContent);
      copyButton.textContent = "Resumo copiado";
      window.setTimeout(() => { copyButton.textContent = "Copiar resumo"; }, 1_800);
    } catch (error) {
      copyButton.textContent = "Selecione e copie o texto";
    }
  });

  resetButton.addEventListener("click", () => {
    form.reset();
    fileInput.value = "";
    releasePreview();
    resetAutomaticState();
    currentFileLabel = "não informado";
    samplingRateInput.value = "500";
    showPreviewMessage("Nenhum traçado selecionado.");
    summary.hidden = true;
    summaryText.textContent = "";
  });

  window.addEventListener("beforeunload", releasePreview);
}
