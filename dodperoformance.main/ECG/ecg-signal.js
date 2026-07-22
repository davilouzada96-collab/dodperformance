const MAX_FILE_BYTES = 12 * 1024 * 1024;
const MAX_ROWS = 180_000;
const MIN_SAMPLING_RATE = 100;
const MAX_SAMPLING_RATE = 2_000;

const LEAD_NAMES = new Map([
  ["I", "I"], ["DI", "I"], ["LEADI", "I"],
  ["II", "II"], ["DII", "II"], ["LEADII", "II"],
  ["III", "III"], ["DIII", "III"], ["LEADIII", "III"],
  ["AVR", "aVR"], ["AVL", "aVL"], ["AVF", "aVF"],
  ["V1", "V1"], ["V2", "V2"], ["V3", "V3"],
  ["V4", "V4"], ["V5", "V5"], ["V6", "V6"],
]);

const TIME_HEADERS = new Set([
  "TIME", "TEMPO", "TIMESTAMP", "SECONDS", "SECOND", "SEC", "SECS", "MS", "MILLISECONDS", "MILLISECONDS",
]);

function normalizeHeader(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function parseNumber(value, delimiter) {
  const normalized = String(value).trim().replace(/\s/g, "");
  if (!normalized) return Number.NaN;
  const decimalSafe = delimiter === ";" ? normalized.replace(",", ".") : normalized;
  const number = Number(decimalSafe);
  return Number.isFinite(number) ? number : Number.NaN;
}

function detectDelimiter(line) {
  const options = [";", "\t", ","];
  return options
    .map((delimiter) => ({ delimiter, count: line.split(delimiter).length - 1 }))
    .sort((a, b) => b.count - a.count)[0].delimiter;
}

function median(values) {
  if (!values.length) return Number.NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function quantile(values, q) {
  if (!values.length) return Number.NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * q;
  const lower = Math.floor(index);
  const fraction = index - lower;
  return sorted[lower + 1] === undefined
    ? sorted[lower]
    : sorted[lower] + fraction * (sorted[lower + 1] - sorted[lower]);
}

function medianAbsoluteDeviation(values, center = median(values)) {
  return median(values.map((value) => Math.abs(value - center)));
}

function inferSamplingRate(timeValues, header) {
  const differences = [];
  for (let index = 1; index < Math.min(timeValues.length, 5_000); index += 1) {
    const difference = timeValues[index] - timeValues[index - 1];
    if (Number.isFinite(difference) && difference > 0) differences.push(difference);
  }

  const step = median(differences);
  if (!Number.isFinite(step) || step <= 0) return null;

  const normalized = normalizeHeader(header);
  const milliseconds = normalized === "MS" || normalized.includes("MILLI") || step >= 0.5;
  const rate = milliseconds ? 1_000 / step : 1 / step;
  return rate >= MIN_SAMPLING_RATE && rate <= MAX_SAMPLING_RATE ? rate : null;
}

function movingAverage(values, windowSize) {
  const size = Math.max(1, Math.round(windowSize));
  const radius = Math.floor(size / 2);
  const prefix = new Float64Array(values.length + 1);
  const output = new Float64Array(values.length);

  for (let index = 0; index < values.length; index += 1) {
    prefix[index + 1] = prefix[index] + values[index];
  }

  for (let index = 0; index < values.length; index += 1) {
    const start = Math.max(0, index - radius);
    const end = Math.min(values.length, index + radius + 1);
    output[index] = (prefix[end] - prefix[start]) / (end - start);
  }
  return output;
}

function sanitizeSamples(samples) {
  const output = new Float64Array(samples.length);
  let missing = 0;
  let previous = 0;

  for (let index = 0; index < samples.length; index += 1) {
    if (Number.isFinite(samples[index])) {
      previous = samples[index];
      output[index] = samples[index];
    } else {
      missing += 1;
      output[index] = previous;
    }
  }

  return { values: output, missingRatio: missing / Math.max(1, samples.length) };
}

function signalQuality(samples, samplingRate) {
  const { values, missingRatio } = sanitizeSamples(samples);
  const duration = values.length / samplingRate;
  const sample = Array.from(values.slice(0, Math.min(values.length, 30_000)));
  const center = median(sample);
  const deviations = sample.map((value) => value - center);
  const p05 = quantile(deviations, 0.05);
  const p95 = quantile(deviations, 0.95);
  const robustRange = Math.max(1e-12, p95 - p05);
  const differences = [];
  let flatCount = 0;

  for (let index = 1; index < sample.length; index += 1) {
    const difference = Math.abs(sample[index] - sample[index - 1]);
    differences.push(difference);
    if (difference < robustRange * 0.0005) flatCount += 1;
  }

  const min = Math.min(...sample);
  const max = Math.max(...sample);
  const edgeTolerance = robustRange * 0.0001;
  const clipped = sample.filter((value) => Math.abs(value - min) <= edgeTolerance || Math.abs(value - max) <= edgeTolerance).length;
  const noiseIndex = median(differences) / robustRange;
  const flatRatio = flatCount / Math.max(1, differences.length);
  const clippingRatio = clipped / Math.max(1, sample.length);
  const issues = [];
  let score = 100;

  if (duration < 5) {
    issues.push("registro curto: menos de 5 segundos");
    score -= 25;
  }
  if (missingRatio > 0.01) {
    issues.push(`${Math.round(missingRatio * 100)}% das amostras estavam ausentes`);
    score -= Math.min(35, missingRatio * 100);
  }
  if (robustRange <= 1e-10 || flatRatio > 0.55) {
    issues.push("sinal plano ou com pouca variação");
    score -= 55;
  }
  if (clippingRatio > 0.04) {
    issues.push("possível saturação ou recorte de amplitude");
    score -= 20;
  }
  if (noiseIndex > 0.18) {
    issues.push("variação rápida compatível com ruído elevado");
    score -= 20;
  }

  score = Math.max(0, Math.round(score));
  const label = score >= 80 ? "Boa para triagem" : score >= 55 ? "Limitada" : "Não interpretável";
  return { values, score, label, issues, duration, missingRatio, flatRatio, clippingRatio, noiseIndex };
}

function detectRPeaks(samples, samplingRate) {
  const baseline = movingAverage(samples, samplingRate * 0.6);
  const centered = new Float64Array(samples.length);
  for (let index = 0; index < samples.length; index += 1) centered[index] = samples[index] - baseline[index];
  const smoothed = movingAverage(centered, samplingRate * 0.018);
  const absolute = Array.from(smoothed, (value) => Math.abs(value));
  const absoluteSample = absolute.slice(0, Math.min(absolute.length, 30_000));
  const center = median(absoluteSample);
  const mad = medianAbsoluteDeviation(absoluteSample, center);
  const p99 = quantile(absoluteSample, 0.99);
  const threshold = Math.max(center + 5 * mad, center + 0.32 * (p99 - center));
  const refractory = Math.round(samplingRate * 0.28);
  const margin = Math.round(samplingRate * 0.3);
  const peaks = [];

  for (let index = Math.max(1, margin); index < absolute.length - Math.max(1, margin); index += 1) {
    if (absolute[index] < threshold || absolute[index] < absolute[index - 1] || absolute[index] < absolute[index + 1]) continue;

    const lastIndex = peaks[peaks.length - 1];
    if (lastIndex === undefined || index - lastIndex >= refractory) {
      peaks.push(index);
    } else if (absolute[index] > absolute[lastIndex]) {
      peaks[peaks.length - 1] = index;
    }
  }

  return { peaks, filtered: smoothed, threshold };
}

function formatRate(rate) {
  return Number.isFinite(rate) ? Math.round(rate) : null;
}

export function parseEcgText(text, fallbackSamplingRate = 500, fileSize = 0) {
  if (fileSize > MAX_FILE_BYTES) throw new Error("Arquivo maior que 12 MB. Use um trecho de até 5 minutos.");
  if (!String(text).trim()) throw new Error("O arquivo está vazio.");

  const lines = String(text).replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 3) throw new Error("O arquivo precisa ter cabeçalho e pelo menos duas linhas de amostras.");
  if (lines.length > MAX_ROWS + 1) throw new Error("Registro longo demais. Limite: 180 mil amostras.");

  const delimiter = detectDelimiter(lines[0]);
  const firstCells = lines[0].split(delimiter).map((cell) => cell.trim());
  const hasHeader = firstCells.some((cell) => !Number.isFinite(parseNumber(cell, delimiter)));
  const headers = hasHeader ? firstCells : firstCells.map((_, index) => index === 0 ? "Amostra" : `Canal ${index}`);
  const dataLines = hasHeader ? lines.slice(1) : lines;
  const rows = dataLines.map((line) => {
    const cells = line.split(delimiter);
    return headers.map((_, index) => parseNumber(cells[index] ?? "", delimiter));
  });

  const numericRatios = headers.map((_, column) => {
    let numeric = 0;
    for (const row of rows) if (Number.isFinite(row[column])) numeric += 1;
    return numeric / rows.length;
  });

  const timeIndex = headers.findIndex((header, index) => TIME_HEADERS.has(normalizeHeader(header)) && numericRatios[index] > 0.9);
  let samplingRate = Number(fallbackSamplingRate);
  let samplingSource = "informada";
  if (!Number.isFinite(samplingRate) || samplingRate < MIN_SAMPLING_RATE || samplingRate > MAX_SAMPLING_RATE) {
    throw new Error("Informe uma frequência de amostragem entre 100 e 2000 Hz.");
  }

  if (timeIndex >= 0) {
    const inferred = inferSamplingRate(rows.map((row) => row[timeIndex]), headers[timeIndex]);
    if (inferred) {
      samplingRate = inferred;
      samplingSource = "detectada pela coluna de tempo";
    }
  }

  const usedNames = new Set();
  const leads = headers.flatMap((header, column) => {
    if (column === timeIndex || numericRatios[column] < 0.85) return [];
    const normalized = normalizeHeader(header);
    let name = LEAD_NAMES.get(normalized) || header.trim() || `Canal ${column + 1}`;
    if (usedNames.has(name)) name = `${name} ${column + 1}`;
    usedNames.add(name);
    return [{ name, samples: rows.map((row) => row[column]) }];
  });

  if (!leads.length) throw new Error("Nenhuma coluna numérica de ECG foi encontrada.");
  if (rows.length / samplingRate > 300) throw new Error("Use um trecho de até 5 minutos para a análise local.");

  return {
    leads,
    samplingRate,
    samplingSource,
    sampleCount: rows.length,
    duration: rows.length / samplingRate,
    delimiter,
  };
}

export function analyzeEcgRecording(recording, requestedLead = "") {
  const selectedLead = recording.leads.find((lead) => lead.name === requestedLead)
    || recording.leads.find((lead) => lead.name === "II")
    || recording.leads[0];
  const quality = signalQuality(selectedLead.samples, recording.samplingRate);
  const { peaks: detectedPeaks } = detectRPeaks(quality.values, recording.samplingRate);
  const peaks = quality.score >= 55 ? detectedPeaks : [];
  const rrIntervals = [];

  for (let index = 1; index < peaks.length; index += 1) {
    const interval = (peaks[index] - peaks[index - 1]) / recording.samplingRate;
    if (interval >= 0.25 && interval <= 2.5) rrIntervals.push(interval);
  }

  const medianRr = median(rrIntervals);
  const rate = formatRate(60 / medianRr);
  const rrMad = medianAbsoluteDeviation(rrIntervals, medianRr);
  const variability = Number.isFinite(medianRr) && medianRr > 0 ? rrMad / medianRr : null;
  const irregularIntervals = rrIntervals.filter((interval) => Math.abs(interval - medianRr) / medianRr > 0.2).length;
  const irregularRatio = irregularIntervals / Math.max(1, rrIntervals.length);
  const enoughBeats = peaks.length >= 4 && rrIntervals.length >= 3;
  const qualityUsable = quality.score >= 55;
  const rhythmLabel = !enoughBeats
    ? "Dados insuficientes"
    : variability > 0.12 || irregularRatio > 0.25
      ? "Irregularidade relevante"
      : variability > 0.07
        ? "Variabilidade intermediária"
        : "RR predominantemente regular";
  const confidence = !qualityUsable || !enoughBeats
    ? "Baixa"
    : recording.duration >= 10 && recording.leads.length >= 2
      ? "Moderada"
      : "Limitada";

  const findings = [];
  if (quality.label === "Não interpretável") {
    findings.push({ tone: "limited", title: "Sinal não interpretável", text: "A qualidade não permite uma triagem automática confiável." });
  } else {
    findings.push({ tone: quality.score >= 80 ? "ok" : "limited", title: "Qualidade do sinal", text: quality.issues.length ? quality.issues.join("; ") : "Sem limitação técnica importante detectada." });
  }

  if (!enoughBeats) {
    findings.push({ tone: "limited", title: "Ritmo", text: "Poucos complexos foram detectados; revise a derivação e a frequência de amostragem." });
  } else if (rhythmLabel === "Irregularidade relevante") {
    findings.push({ tone: "review", title: "Ritmo a revisar", text: "Os intervalos RR apresentaram irregularidade. Isso não confirma fibrilação atrial e requer inspeção das ondas P e do traçado completo." });
  } else {
    findings.push({ tone: "ok", title: "Regularidade", text: `${rhythmLabel} no trecho analisado.` });
  }

  if (rate !== null && (rate < 50 || rate > 100)) {
    findings.push({ tone: "review", title: "Frequência a revisar", text: `Frequência estimada em ${rate} bpm; correlacionar com contexto, sintomas e registro completo.` });
  }

  if (recording.leads.length < 12) {
    findings.push({ tone: "limited", title: "Cobertura limitada", text: `${recording.leads.length} derivação(ões) encontrada(s). ST-T, eixo, sobrecargas e condução não são classificados automaticamente nesta etapa.` });
  } else {
    findings.push({ tone: "limited", title: "Morfologia ainda não classificada", text: "As 12 derivações foram reconhecidas, mas ST-T, eixo, PR, QRS, QTc e sobrecargas dependem do próximo módulo validado." });
  }

  const automaticAxes = {
    ecg_measurements: qualityUsable && enoughBeats && rate !== null && rate >= 50 && rate <= 100 ? "Sem alteração aparente" : "Achado a revisar",
    ecg_rhythm: enoughBeats && rhythmLabel === "RR predominantemente regular" ? "Sem alteração aparente" : enoughBeats ? "Achado a revisar" : "Não avaliado",
    ecg_conduction_intervals: "Não avaliado",
    ecg_st_t_injury: "Não avaliado",
    ecg_overload_remodeling: "Não avaliado",
    ecg_ectopy_rate: enoughBeats && rate !== null && rate >= 50 && rate <= 100 && irregularRatio <= 0.2 ? "Sem alteração aparente" : enoughBeats ? "Achado a revisar" : "Não avaliado",
  };

  return {
    lead: selectedLead.name,
    leadSamples: Array.from(quality.values),
    samplingRate: recording.samplingRate,
    samplingSource: recording.samplingSource,
    duration: recording.duration,
    leadCount: recording.leads.length,
    quality,
    peaks,
    beatCount: peaks.length,
    rate,
    medianRr: Number.isFinite(medianRr) ? medianRr : null,
    variability,
    irregularRatio,
    rhythmLabel,
    confidence,
    findings,
    automaticAxes,
  };
}

export function createDemoRecording() {
  const samplingRate = 500;
  const duration = 10;
  const sampleCount = samplingRate * duration;
  const leadNames = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"];
  const gaussian = (x, center, width, amplitude) => amplitude * Math.exp(-0.5 * ((x - center) / width) ** 2);

  const leads = leadNames.map((name, leadIndex) => {
    const scale = name === "aVR" ? -0.65 : 0.72 + leadIndex * 0.035;
    const samples = new Array(sampleCount);
    for (let index = 0; index < sampleCount; index += 1) {
      const time = index / samplingRate;
      const cycle = time % (60 / 72);
      const beat = (
        gaussian(cycle, 0.12, 0.025, 0.12)
        + gaussian(cycle, 0.195, 0.009, -0.14)
        + gaussian(cycle, 0.215, 0.011, 1.05)
        + gaussian(cycle, 0.245, 0.012, -0.24)
        + gaussian(cycle, 0.43, 0.055, 0.3)
      );
      const baseline = 0.018 * Math.sin(2 * Math.PI * 0.25 * time);
      const noise = 0.006 * Math.sin(2 * Math.PI * (17 + leadIndex) * time);
      samples[index] = scale * beat + baseline + noise;
    }
    return { name, samples };
  });

  return {
    leads,
    samplingRate,
    samplingSource: "sinal demonstrativo",
    sampleCount,
    duration,
  };
}
