const DATA_URL = "./output_data_1779051008.json";
const OPENALEX_URL = "https://api.openalex.org/works";
const PUBMED_BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const PROJECT_STORAGE_KEY = "dodResearchProjects";
const SEARCH_CACHE_KEY = "dodResearchCache";
const SEARCH_CACHE_VERSION = "v2";
const SEARCH_CACHE_TTL_MS = 1000 * 60 * 60 * 12;
const DEFAULT_LIBRARY_TOPIC = "neuroplasticity motor learning headache emergency dizziness vertigo balance sepsis acute respiratory failure clinical assessment muscle recovery muscle strength fatigue sports performance heart rate variability sleep recovery";
const DEFAULT_LIBRARY_TOPICS = [
  "neuroplasticity motor learning pain inflammation muscle recovery",
  "muscle strength fatigue sports performance",
  "heart rate variability sleep recovery",
  "headache emergency dizziness vertigo balance",
  "sepsis acute respiratory failure clinical assessment",
];
const DEFAULT_LIBRARY_LABELS = [
  "neuroplasticidade e recuperação",
  "força, fadiga e performance",
  "HRV, sono e recuperação",
  "cefaleia, vertigem e equilíbrio",
  "sepse e respiração aguda",
];

const noisyDomains = [
  "researchgate.net",
  "academia.edu",
  "elibrary.ru",
  "ebscohost.com",
  "jdaic-journal.org",
  "theamericanjournals.org",
];

const preferredDomains = [
  "nature.com",
  "sciencedirect.com",
  "springer.com",
  "frontiersin.org",
  "mdpi.com",
  "wiley.com",
  "sagepub.com",
  "plos.org",
  "pubmed.ncbi.nlm.nih.gov",
  "tandfonline.com",
  "ieeexplore.ieee.org",
  "bmj.com",
  "nejm.org",
  "thelancet.com",
  "jamanetwork.com",
];

const preferredSourceNames = [
  "nature",
  "springer",
  "frontiers",
  "elsevier",
  "wiley",
  "sage",
  "plos",
  "bmj",
  "lancet",
  "jama",
  "nejm",
  "mdpi",
  "ieee",
  "pubmed",
  "ncbi",
];

const evidenceWeights = {
  guideline: 34,
  "systematic-review": 30,
  "meta-analysis": 30,
  review: 18,
  trial: 16,
  article: 8,
  preprint: -4,
  book: -8,
  other: 0,
};

const searchStopWords = new Set([
  "adult",
  "care",
  "child",
  "children",
  "health",
  "healthcare",
  "pediatric",
  "sport",
  "standard",
  "study",
  "training",
]);

const ptBrSearchTerms = {
  "aprendizado de máquina": "machine learning",
  "aprendizagem de máquina": "machine learning",
  "inteligência artificial": "artificial intelligence",
  "inteligencia artificial": "artificial intelligence",
  "aprendizado profundo": "deep learning",
  "saúde": "healthcare",
  "saude": "healthcare",
  "pediátrica": "pediatric",
  "pediatrica": "pediatric",
  "pediátrico": "pediatric",
  "pediatrico": "pediatric",
  "crianças": "children",
  "criancas": "children",
  "criança": "child",
  "crianca": "child",
  "adultos": "adult",
  "idosos": "elderly",
  "emergência": "emergency",
  "emergencia": "emergency",
  "pronto socorro": "emergency department",
  "cefaleia": "headache",
  "cefaleias": "headache disorders",
  "dor de cabeça": "headache",
  "dor de cabeca": "headache",
  "enxaqueca": "migraine",
  "migrânea": "migraine",
  "migranea": "migraine",
  "tontura": "dizziness",
  "vertigem": "vertigo",
  "vestibular": "vestibular disorders",
  "terapia intensiva": "intensive care",
  "uti": "intensive care unit",
  "sepse": "sepsis",
  "choque séptico": "septic shock",
  "choque septico": "septic shock",
  "insuficiência respiratória aguda": "acute respiratory failure",
  "insuficiencia respiratoria aguda": "acute respiratory failure",
  "falência respiratória aguda": "acute respiratory failure",
  "falencia respiratoria aguda": "acute respiratory failure",
  "falha respiratória aguda": "acute respiratory failure",
  "falha respiratoria aguda": "acute respiratory failure",
  "suporte respiratório": "respiratory support",
  "suporte respiratorio": "respiratory support",
  "diagnóstico": "diagnosis",
  "diagnostico": "diagnosis",
  "acurácia": "accuracy",
  "acuracia": "accuracy",
  "triagem": "triage",
  "avaliação": "assessment",
  "avaliacao": "assessment",
  "avaliação neurológica": "neurological assessment",
  "avaliacao neurologica": "neurological assessment",
  "metas de avaliação": "assessment targets",
  "metas de avaliacao": "assessment targets",
  "estratificação de risco": "risk stratification",
  "estratificacao de risco": "risk stratification",
  "mortalidade": "mortality",
  "sobrevida": "survival",
  "prognóstico": "prognosis",
  "prognostico": "prognosis",
  "tratamento": "treatment",
  "rastreamento": "screening",
  "prevenção": "prevention",
  "prevencao": "prevention",
  "risco": "risk",
  "predição": "prediction",
  "predicao": "prediction",
  "doença": "disease",
  "doenca": "disease",
  "cardiovascular": "cardiovascular",
  "diabetes": "diabetes",
  "asma": "asthma",
  "avc": "stroke",
  "derrame": "stroke",
  "cuidado usual": "standard care",
  "carga": "load",
  "carga de treino": "training load",
  "carga de treinamento": "training load",
  "lesão muscular": "muscle injury",
  "lesao muscular": "muscle injury",
  "reabilitação": "rehabilitation",
  "reabilitacao": "rehabilitation",
  "neuroplasticidade": "neuroplasticity",
  "plasticidade neural": "neural plasticity",
  "aprendizagem motora": "motor learning",
  "aprendizado motor": "motor learning",
  "controle motor": "motor control",
  "córtex motor": "motor cortex",
  "cortex motor": "motor cortex",
  "propriocepção": "proprioception",
  "propriocepcao": "proprioception",
  "dor": "pain",
  "inflamação": "inflammation",
  "inflamacao": "inflammation",
  "recuperação": "recovery",
  "recuperacao": "recovery",
  "recuperação muscular": "muscle recovery",
  "recuperacao muscular": "muscle recovery",
  "força": "strength",
  "forca": "strength",
  "força muscular": "muscle strength",
  "forca muscular": "muscle strength",
  "potência": "power",
  "potencia": "power",
  "fadiga": "fatigue",
  "fadiga neuromuscular": "neuromuscular fatigue",
  "performance esportiva": "sports performance",
  "esporte": "sport",
  "treino": "training",
  "treinamento": "training",
  "variabilidade da frequência cardíaca": "heart rate variability",
  "variabilidade da frequencia cardiaca": "heart rate variability",
  "frequência cardíaca": "heart rate",
  "frequencia cardiaca": "heart rate",
  "sono": "sleep",
  "ritmo circadiano": "circadian rhythm",
  "estresse": "stress",
  "stress": "stress",
  "cortisol": "cortisol",
  "nutrição": "nutrition",
  "nutricao": "nutrition",
  "proteína": "protein",
  "proteina": "protein",
  "tendão": "tendon",
  "tendao": "tendon",
  "equilíbrio": "balance",
  "equilibrio": "balance",
  "postura": "posture",
  "respiração": "breathing",
  "respiracao": "breathing",
  "sistema nervoso autonômico": "autonomic nervous system",
  "sistema nervoso autonomico": "autonomic nervous system",
};

const englishSearchTerms = [
  "artificial intelligence",
  "acute respiratory failure",
  "assessment",
  "assessment targets",
  "autonomic nervous system",
  "balance",
  "breathing",
  "children",
  "circadian rhythm",
  "cortisol",
  "deep learning",
  "fatigue",
  "dizziness",
  "emergency department",
  "heart rate",
  "heart rate variability",
  "headache",
  "headache disorders",
  "inflammation",
  "machine learning",
  "migraine",
  "motor control",
  "motor cortex",
  "motor learning",
  "muscle injury",
  "muscle recovery",
  "muscle strength",
  "neuroplasticity",
  "nutrition",
  "pain",
  "pediatric",
  "posture",
  "power",
  "proprioception",
  "recovery",
  "rehabilitation",
  "sepsis",
  "respiratory support",
  "risk stratification",
  "sleep",
  "sport",
  "sports performance",
  "strength",
  "stress",
  "training load",
  "training",
  "triage",
  "vertigo",
  "vestibular disorders",
  "load",
];

const ptBrUiTerms = {
  guideline: "diretriz",
  "systematic-review": "revisão sistemática",
  "meta-analysis": "meta-análise",
  review: "revisão",
  trial: "ensaio clínico",
  article: "artigo",
  preprint: "pré-print",
  book: "livro",
  other: "outro",
};

const ptBrPhraseTranslations = {
  "acute lung injury": "lesão pulmonar aguda",
  "acute respiratory failure": "insuficiência respiratória aguda",
  "adverse events": "eventos adversos",
  "artificial intelligence": "inteligência artificial",
  "autonomic nervous system": "sistema nervoso autonômico",
  "bloodstream infection": "infecção de corrente sanguínea",
  "cardiorespiratory fitness": "aptidão cardiorrespiratória",
  "chronic pain": "dor crônica",
  "clinical trial": "ensaio clínico",
  "clinical assessment": "avaliação clínica",
  "concussion in sport": "concussão no esporte",
  "critical care": "cuidados críticos",
  "daily prediction": "predição diária",
  "deep learning": "aprendizado profundo",
  "diagnostic accuracy": "acurácia diagnóstica",
  "dizziness and vertigo": "tontura e vertigem",
  "early diagnosis": "diagnóstico precoce",
  "emergency department": "pronto atendimento",
  "exercise training": "treinamento físico",
  "training load": "carga de treinamento",
  "headache disorders": "transtornos de cefaleia",
  "heart rate variability": "variabilidade da frequência cardíaca",
  "intensive care unit": "unidade de terapia intensiva",
  "machine learning": "aprendizado de máquina",
  "meta-analysis": "meta-análise",
  "motor control": "controle motor",
  "motor cortex": "córtex motor",
  "motor learning": "aprendizagem motora",
  "muscle injury": "lesão muscular",
  "muscle recovery": "recuperação muscular",
  "muscle strength": "força muscular",
  "neural plasticity": "plasticidade neural",
  "neurological assessment": "avaliação neurológica",
  "neurological emergency": "emergência neurológica",
  "night shifts": "turnos noturnos",
  "open access": "acesso aberto",
  "pediatric acute lung injury": "lesão pulmonar aguda pediátrica",
  "pediatric sepsis": "sepse pediátrica",
  "physical activity": "atividade física",
  "randomized controlled trial": "ensaio clínico randomizado",
  "recovery days": "dias de recuperação",
  "respiratory support": "suporte respiratório",
  "risk stratification": "estratificação de risco",
  "scoping review": "revisão de escopo",
  "septic shock": "choque séptico",
  "sport performance": "performance esportiva",
  "sports performance": "performance esportiva",
  "supervised machine learning": "aprendizado de máquina supervisionado",
  "systematic review": "revisão sistemática",
  "tendon load adaptation": "adaptação do tendão à carga",
  "vestibular disorders": "distúrbios vestibulares",
};

const ptBrWordTranslations = {
  accuracy: "acurácia",
  acute: "agudo",
  adaptation: "adaptação",
  adult: "adulto",
  analysis: "análise",
  analytics: "análise de dados",
  application: "aplicação",
  assessment: "avaliação",
  associated: "associado",
  balance: "equilíbrio",
  biomarker: "biomarcador",
  biomarkers: "biomarcadores",
  blood: "sangue",
  body: "corpo",
  brain: "cérebro",
  care: "cuidado",
  cardiac: "cardíaco",
  cardiovascular: "cardiovascular",
  children: "crianças",
  clinical: "clínico",
  cohort: "coorte",
  consensus: "consenso",
  control: "controle",
  controlled: "controlado",
  cortisol: "cortisol",
  data: "dados",
  diagnosis: "diagnóstico",
  diagnostic: "diagnóstico",
  disease: "doença",
  dizziness: "tontura",
  early: "precoce",
  emergency: "emergência",
  exercise: "exercício",
  failure: "falência",
  fatigue: "fadiga",
  fitness: "aptidão",
  frequency: "frequência",
  health: "saúde",
  healthcare: "saúde",
  headache: "cefaleia",
  headaches: "cefaleias",
  inflammation: "inflamação",
  injury: "lesão",
  learning: "aprendizado",
  load: "carga",
  model: "modelo",
  mortality: "mortalidade",
  migraine: "enxaqueca",
  neural: "neural",
  nervous: "nervoso",
  neuroplasticity: "neuroplasticidade",
  nutrition: "nutrição",
  pain: "dor",
  patients: "pacientes",
  pediatric: "pediátrico",
  performance: "performance",
  physical: "físico",
  prediction: "predição",
  prognosis: "prognóstico",
  protein: "proteína",
  recovery: "recuperação",
  rehabilitation: "reabilitação",
  response: "resposta",
  respiratory: "respiratório",
  review: "revisão",
  risk: "risco",
  sepsis: "sepse",
  sleep: "sono",
  sport: "esporte",
  strength: "força",
  stress: "estresse",
  study: "estudo",
  autonomic: "autonômico",
  systematic: "sistemática",
  target: "meta",
  targets: "metas",
  tendon: "tendão",
  training: "treinamento",
  trial: "ensaio",
  triage: "triagem",
  variability: "variabilidade",
  vertigo: "vertigem",
  vestibular: "vestibular",
};

const ptBrConceptCatalog = [
  { terms: ["machine learning", "supervised machine learning"], label: "aprendizado de máquina" },
  { terms: ["artificial intelligence", "deep learning"], label: "inteligência artificial" },
  { terms: ["pediatric", "children", "child"], label: "saúde pediátrica" },
  { terms: ["critical care", "intensive care unit"], label: "cuidados críticos" },
  { terms: ["acute lung injury"], label: "lesão pulmonar aguda" },
  { terms: ["acute respiratory failure", "respiratory failure", "respiratory support"], label: "insuficiência respiratória aguda" },
  { terms: ["sepsis", "septic shock"], label: "sepse" },
  { terms: ["headache", "headache disorders", "migraine"], label: "cefaleia e enxaqueca" },
  { terms: ["dizziness", "vertigo", "vestibular disorders"], label: "tontura, vertigem e equilíbrio" },
  { terms: ["heart rate variability", "autonomic nervous system"], label: "variabilidade cardíaca e sistema autonômico" },
  { terms: ["sleep", "circadian rhythm"], label: "sono e ritmo circadiano" },
  { terms: ["recovery", "muscle recovery", "rehabilitation"], label: "recuperação e reabilitação" },
  { terms: ["pain", "chronic pain"], label: "dor" },
  { terms: ["inflammation"], label: "inflamação" },
  { terms: ["motor learning", "motor control", "motor cortex"], label: "controle e aprendizagem motora" },
  { terms: ["neuroplasticity", "neural plasticity"], label: "neuroplasticidade" },
  { terms: ["proprioception", "balance", "posture"], label: "propriocepção e equilíbrio" },
  { terms: ["strength", "muscle strength", "power"], label: "força e potência" },
  { terms: ["training load", "load", "tendon load adaptation"], label: "carga e adaptação" },
  { terms: ["muscle injury", "tendon"], label: "lesão muscular e tendão" },
  { terms: ["fatigue", "neuromuscular fatigue"], label: "fadiga" },
  { terms: ["sport", "sports performance", "exercise training"], label: "performance esportiva" },
  { terms: ["nutrition", "protein"], label: "nutrição" },
  { terms: ["breathing", "ventilation"], label: "respiração" },
  { terms: ["cortisol", "stress"], label: "estresse e cortisol" },
  { terms: ["diagnosis", "early diagnosis", "diagnostic accuracy"], label: "diagnóstico" },
  { terms: ["assessment", "clinical assessment", "neurological assessment", "assessment targets", "triage", "risk stratification"], label: "avaliação clínica e estratificação de risco" },
  { terms: ["prediction", "risk", "prognosis"], label: "predição de risco" },
];

const state = {
  papers: [],
  query: "",
  year: "all",
  sort: "score-desc",
  minCitations: 0,
  cleanSources: false,
  strictEvidence: false,
  dataSource: "local",
  lastTopic: "",
  synthesis: null,
  expandedTopic: "",
  preserveLibraryOrder: false,
};

function buildSearchCacheKey(source, fromYear, limit, expandedTopics) {
  return [SEARCH_CACHE_VERSION, source, fromYear, limit, ...expandedTopics].join("|").toLowerCase();
}

function readSearchCache(cacheKey) {
  try {
    const cache = JSON.parse(localStorage.getItem(SEARCH_CACHE_KEY) || "{}");
    const cached = cache[cacheKey];
    if (!cached || Date.now() - cached.savedAt > SEARCH_CACHE_TTL_MS) return null;
    return Array.isArray(cached.papers) ? cached.papers : null;
  } catch {
    return null;
  }
}

function writeSearchCache(cacheKey, papers) {
  try {
    const cache = JSON.parse(localStorage.getItem(SEARCH_CACHE_KEY) || "{}");
    cache[cacheKey] = {
      savedAt: Date.now(),
      papers: papers.slice(0, 100),
    };

    const entries = Object.entries(cache)
      .sort(([, a], [, b]) => (b.savedAt || 0) - (a.savedAt || 0))
      .slice(0, 20);
    localStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    // Cache is best-effort; failed storage should never block the research flow.
  }
}

const els = {
  cards: document.querySelector("#cards"),
  template: document.querySelector("#cardTemplate"),
  stats: document.querySelector("#stats"),
  researchForm: document.querySelector("#researchForm"),
  topicInput: document.querySelector("#topicInput"),
  sourceSelect: document.querySelector("#sourceSelect"),
  fromYearInput: document.querySelector("#fromYearInput"),
  resultLimit: document.querySelector("#resultLimit"),
  searchButton: document.querySelector("#searchButton"),
  loadLocalButton: document.querySelector("#loadLocalButton"),
  copyStrategyButton: document.querySelector("#copyStrategyButton"),
  exportJsonButton: document.querySelector("#exportJsonButton"),
  exportCsvButton: document.querySelector("#exportCsvButton"),
  exportVancouverButton: document.querySelector("#exportVancouverButton"),
  exportMarkdownButton: document.querySelector("#exportMarkdownButton"),
  inferPicoButton: document.querySelector("#inferPicoButton"),
  applyPicoButton: document.querySelector("#applyPicoButton"),
  picoPopulation: document.querySelector("#picoPopulation"),
  picoIntervention: document.querySelector("#picoIntervention"),
  picoComparator: document.querySelector("#picoComparator"),
  picoOutcome: document.querySelector("#picoOutcome"),
  projectNameInput: document.querySelector("#projectNameInput"),
  saveProjectButton: document.querySelector("#saveProjectButton"),
  projectSelect: document.querySelector("#projectSelect"),
  loadProjectButton: document.querySelector("#loadProjectButton"),
  deleteProjectButton: document.querySelector("#deleteProjectButton"),
  runStatus: document.querySelector("#runStatus"),
  searchInput: document.querySelector("#searchInput"),
  yearSelect: document.querySelector("#yearSelect"),
  sortSelect: document.querySelector("#sortSelect"),
  minCitations: document.querySelector("#minCitations"),
  cleanSources: document.querySelector("#cleanSources"),
  strictEvidence: document.querySelector("#strictEvidence"),
  visibleCount: document.querySelector("#visibleCount"),
  topScore: document.querySelector("#topScore"),
  cleanRatio: document.querySelector("#cleanRatio"),
  emptyState: document.querySelector("#emptyState"),
  synthesisButton: document.querySelector("#synthesisButton"),
  synthesisGrid: document.querySelector("#synthesisGrid"),
  readerModal: document.querySelector("#readerModal"),
  readerBackdrop: document.querySelector("#readerBackdrop"),
  readerClose: document.querySelector("#readerClose"),
  readerTitle: document.querySelector("#readerTitle"),
  readerOriginalTitle: document.querySelector("#readerOriginalTitle"),
  readerTags: document.querySelector("#readerTags"),
  readerAbstract: document.querySelector("#readerAbstract"),
  readerSource: document.querySelector("#readerSource"),
  readerTrace: document.querySelector("#readerTrace"),
  readerAuthors: document.querySelector("#readerAuthors"),
  readerSourceLink: document.querySelector("#readerSourceLink"),
  readerCopy: document.querySelector("#readerCopy"),
};

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "fonte inválida";
  }
}

function stripHtml(text = "") {
  return text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function textFrom(node, selector) {
  return node.querySelector(selector)?.textContent?.trim() || "";
}

function allTextFrom(node, selector) {
  return [...node.querySelectorAll(selector)].map((item) => item.textContent.trim()).filter(Boolean);
}

function abstractFromInvertedIndex(index) {
  if (!index) return "";
  const words = [];
  Object.entries(index).forEach(([word, positions]) => {
    positions.forEach((position) => {
      words[position] = word;
    });
  });
  return words.filter(Boolean).join(" ");
}

function titleCaseEvidence(type, title) {
  const text = `${type || ""} ${title || ""}`.toLowerCase();
  if (/guideline|consensus|recommendation/.test(text)) return "guideline";
  if (/meta-analysis|meta analysis/.test(text)) return "meta-analysis";
  if (/systematic review/.test(text)) return "systematic-review";
  if (/randomized|randomised|clinical trial|\brct\b/.test(text)) return "trial";
  if (/review/.test(text)) return "review";
  if (/preprint/.test(text)) return "preprint";
  if (/book/.test(text)) return "book";
  if (/article/.test(text)) return "article";
  return type || "other";
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sentenceCasePtBr(value) {
  return value
    .split(/([.!?]\s+)/)
    .map((part, index, parts) => {
      if (index > 0 && !/[.!?]\s+$/.test(parts[index - 1] || "")) return part;
      return part.replace(/^(\s*)([a-záéíóúâêôãõç])/, (_, space, letter) => `${space}${letter.toUpperCase()}`);
    })
    .join("");
}

function translateScientificText(value, maxLength = 520) {
  const original = stripHtml(value || "");
  if (!original) return "";

  let translated = original;
  Object.entries(ptBrPhraseTranslations)
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([en, pt]) => {
      translated = translated.replace(new RegExp(escapeRegExp(en), "gi"), pt);
    });

  translated = translated.replace(/\b[A-Za-z][A-Za-z-]*\b/g, (word) => {
    const lower = word.toLowerCase();
    return ptBrWordTranslations[lower] || word;
  });

  translated = translated
    .replace(/\ba\b\s+(?=[aeiouáéíóúâêôãõ])/gi, "uma ")
    .replace(/\ba\b\s+/gi, "um ")
    .replace(/\band\b/gi, "e")
    .replace(/\bof\b/gi, "de")
    .replace(/\bfor\b/gi, "para")
    .replace(/\bin\b/gi, "em")
    .replace(/\bto\b/gi, "para")
    .replace(/\busing\b/gi, "usando")
    .replace(/\bwith\b/gi, "com")
    .replace(/\bafter\b/gi, "após")
    .replace(/\bduring\b/gi, "durante")
    .replace(/\bbetween\b/gi, "entre")
    .replace(/\s+/g, " ")
    .trim();

  const clipped = translated.length > maxLength ? `${translated.slice(0, maxLength).trim()}...` : translated;
  return sentenceCasePtBr(clipped);
}

function conceptFamilies(label) {
  const normalized = normalizeText(label);
  return [
    [/hrv|variabilidade cardiaca|frequencia cardiaca|autonomico/, "hrv"],
    [/sono|circadiano/, "sleep"],
    [/recuperacao|reabilitacao/, "recovery"],
    [/neuroplasticidade|plasticidade/, "neuroplasticity"],
    [/aprendizagem motora|controle motor/, "motor"],
    [/cefaleia|enxaqueca/, "headache"],
    [/tontura|vertigem|equilibrio|propriocepcao|postura/, "balance"],
    [/sepse|septico/, "sepsis"],
    [/respiracao|respiratoria|pulmonar/, "respiration"],
    [/forca|potencia/, "strength"],
    [/fadiga/, "fatigue"],
    [/carga|adaptacao|tendao/, "load"],
    [/dor/, "pain"],
    [/inflamacao/, "inflammation"],
    [/diagnostico|avaliacao|triagem|risco|predicao/, "assessment"],
    [/performance|esportiva|treinamento/, "performance"],
  ]
    .filter(([pattern]) => pattern.test(normalized))
    .map(([, family]) => family);
}

function uniqueConcepts(labels, max) {
  const selected = [];
  const selectedFamilies = new Set();

  labels.filter(Boolean).forEach((label) => {
    const families = conceptFamilies(label);
    const normalized = normalizeText(label);
    const repeatsText = selected.some((item) => normalizeText(item) === normalized);
    const repeatsFamily = families.length && families.every((family) => selectedFamilies.has(family));
    if (repeatsText || repeatsFamily) return;
    selected.push(label);
    families.forEach((family) => selectedFamilies.add(family));
  });

  return selected.slice(0, max);
}

function getPaperConcepts(paper, max = 3) {
  const text = normalizeText(`${paper.title || ""} ${paper.abstract || ""} ${(paper.meshTerms || []).join(" ")}`);
  const originLabel = paper.libraryTopicLabel || "";
  const concepts = ptBrConceptCatalog
    .filter((concept) => concept.terms.some((term) => text.includes(normalizeText(term))))
    .map((concept) => concept.label);
  return uniqueConcepts([originLabel, ...concepts], max);
}

function joinPtBrList(items) {
  if (items.length <= 1) return items[0] || "evidência científica";
  if (items.length === 2) return `${items[0]} e ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} e ${items.at(-1)}`;
}

function buildPtBrTitle(paper) {
  const concepts = getPaperConcepts(paper, 3);
  const subject = joinPtBrList(concepts);
  const type = labelEvidence(paper.evidenceType);
  if (paper.evidenceType === "systematic-review" || paper.evidenceType === "review") return `Revisão sobre ${subject}`;
  if (paper.evidenceType === "meta-analysis") return `Meta-análise sobre ${subject}`;
  if (paper.evidenceType === "trial") return `Ensaio clínico sobre ${subject}`;
  if (paper.evidenceType === "guideline") return `Diretriz sobre ${subject}`;
  return `${type.charAt(0).toUpperCase()}${type.slice(1)} sobre ${subject}`;
}

function evidencePhrasePtBr(type) {
  if (type === "systematic-review" || type === "review") return "esta revisão";
  if (type === "meta-analysis") return "esta meta-análise";
  if (type === "guideline") return "esta diretriz";
  if (type === "trial") return "este ensaio clínico";
  if (type === "preprint") return "este pré-print";
  if (type === "book") return "este livro";
  return "este artigo";
}

function buildPtBrSummary(paper, maxLength = 260) {
  const concepts = getPaperConcepts(paper, 4);
  const subject = joinPtBrList(concepts);
  const source = [paper.journal, paper.year || ""].filter(Boolean).join(", ");
  const id = paper.pmid ? "PMID rastreável" : paper.doi ? "DOI rastreável" : "fonte rastreável";
  const sentence = `Leitura guiada em PT-BR: ${evidencePhrasePtBr(paper.evidenceType)} aborda ${subject}. Use para entender o contexto, conferir a fonte original e decidir se o artigo merece leitura completa. ${source ? `Fonte: ${source}.` : ""} ${id}.`;
  return sentence.length > maxLength ? `${sentence.slice(0, maxLength).trim()}...` : sentence;
}

function expandPortugueseQuery(topic) {
  if (/\bOR\b|\(|\)/i.test(topic)) return topic;
  const normalized = normalizeText(topic);
  const additions = new Set();
  Object.entries(ptBrSearchTerms).sort((a, b) => b[0].length - a[0].length).forEach(([pt, en]) => {
    if (normalized.includes(normalizeText(pt))) additions.add(en);
  });
  englishSearchTerms.forEach((term) => {
    if (normalized.includes(normalizeText(term))) additions.add(term);
  });
  if (additions.size) return [...additions].join(" ");
  return topic;
}

function getSearchTerms(query) {
  const normalized = normalizeText(query);
  const phrases = englishSearchTerms.filter((term) => normalized.includes(normalizeText(term)));
  const tokens = normalized
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9-]/g, ""))
    .filter((term) => term.length > 3 && !searchStopWords.has(term));
  return [...new Set([...phrases, ...tokens])].sort((a, b) => b.length - a.length);
}

function scoreSearchRelevance(paper, query) {
  const terms = getSearchTerms(query);
  if (!terms.length) return 1;

  const title = normalizeText(paper.title || "");
  const abstract = normalizeText(paper.abstract || "");
  const mesh = normalizeText((paper.meshTerms || []).join(" "));
  return terms.reduce((score, term) => {
    const needle = normalizeText(term);
    const titleHit = title.includes(needle) ? 4 : 0;
    const abstractHit = abstract.includes(needle) ? 2 : 0;
    const meshHit = mesh.includes(needle) ? 3 : 0;
    return score + titleHit + abstractHit + meshHit;
  }, 0);
}

function rankBySearchRelevance(papers, query) {
  const ranked = papers.map((paper) => ({
    ...paper,
    searchRelevance: scoreSearchRelevance(paper, query),
  }));
  const relevant = ranked.filter((paper) => paper.searchRelevance > 0);
  const pool = relevant.length >= Math.min(8, ranked.length) ? relevant : ranked;
  return pool.sort((a, b) => b.searchRelevance - a.searchRelevance || b.score - a.score || b.citations - a.citations);
}

function diversifyByConcept(papers) {
  return diversifyByKey(papers, (paper) => getPaperConcepts(paper, 1)[0] || "outros");
}

function diversifyByKey(papers, getKey) {
  const groups = papers.reduce((acc, paper) => {
    const key = getKey(paper);
    if (!acc.has(key)) acc.set(key, []);
    acc.get(key).push(paper);
    return acc;
  }, new Map());
  const diversified = [];
  while ([...groups.values()].some((group) => group.length)) {
    [...groups.keys()].forEach((key) => {
      const item = groups.get(key).shift();
      if (item) diversified.push(item);
    });
  }
  return diversified;
}

function dedupePreservingOrder(papers) {
  const seen = new Set();
  return papers.filter((paper) => {
    const key = (paper.doi || paper.pmid || paper.title).toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function rankDefaultLibraryPapers(papers, expandedTopics) {
  const groups = expandedTopics.map((query, topicIndex) => {
    const group = papers.filter((paper) => paper.libraryTopicIndex === topicIndex);
    return rankBySearchRelevance(dedupePapers(group), query);
  });
  const interleaved = [];
  while (groups.some((group) => group.length)) {
    groups.forEach((group) => {
      const item = group.shift();
      if (item) interleaved.push(item);
    });
  }
  return dedupePreservingOrder(interleaved);
}

function labelEvidence(type) {
  return ptBrUiTerms[type] || type;
}

function bestSourceUrl(paper) {
  if (paper.pmid) {
    const pmid = String(paper.pmid).replace("https://pubmed.ncbi.nlm.nih.gov/", "").replace(/\//g, "");
    return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  }
  if (paper.doi) {
    return paper.doi.startsWith("http") ? paper.doi : `https://doi.org/${paper.doi}`;
  }
  return paper.url || "#";
}

function accessLabel(paper) {
  if (paper.isOpenAccess) return "texto aberto";
  if (paper.pmid) return "PubMed";
  if (paper.doi) return "DOI";
  return "fonte externa";
}

function cardCode(paper) {
  const evidenceCode = {
    guideline: "DIR",
    "systematic-review": "REV",
    "meta-analysis": "MA",
    trial: "RCT",
    review: "REV",
    preprint: "PRE",
  };
  if (evidenceCode[paper.evidenceType]) return evidenceCode[paper.evidenceType];
  const words = paper.title
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !/study|using|based|health|care|with|from|para|sobre/i.test(word));
  return (words[0] || "DOD").slice(0, 3).toUpperCase();
}

function colorPair(paper) {
  const pairs = {
    guideline: ["#2f6b56", "#061017"],
    "systematic-review": ["#4d65a0", "#08101a"],
    "meta-analysis": ["#7452b8", "#0b0d18"],
    trial: ["#8a5c2c", "#111016"],
    review: ["#315f7b", "#08101a"],
    article: ["#53623c", "#08101a"],
    preprint: ["#8a3338", "#100d12"],
  };
  return pairs[paper.evidenceType] || ["#3d4d68", "#08101a"];
}

function scorePaper(paper) {
  const citationScore = Math.min(35, Math.log10(paper.citations + 1) * 14);
  const evidenceScore = evidenceWeights[paper.evidenceType] ?? evidenceWeights.other;
  const yearScore = paper.year ? Math.max(-8, Math.min(16, paper.year - 2018)) : 0;
  const sourceScore = paper.isPreferred ? 12 : paper.isNoisy ? -16 : 2;
  const accessScore = paper.isOpenAccess ? 4 : 0;
  const idScore = paper.doi || paper.pmid ? 6 : -4;
  const pubmedScore = paper.source === "PubMed" ? 8 : 0;
  return Math.round(citationScore + evidenceScore + yearScore + sourceScore + accessScore + idScore + pubmedScore);
}

function enrichPaper(paper) {
  const domain = paper.domainOverride || getDomain(paper.url);
  const sourceText = `${domain} ${paper.journal || ""} ${paper.publisher || ""}`.toLowerCase();
  const normalized = {
    ...paper,
    domain,
    isNoisy:
      noisyDomains.some((item) => domain.includes(item)) ||
      /\.pdf($|\?)/i.test(paper.url || "") ||
      /\/download\//i.test(paper.url || ""),
    isPreferred:
      preferredDomains.some((item) => sourceText.includes(item)) ||
      preferredSourceNames.some((item) => sourceText.includes(item)),
  };
  normalized.score = scorePaper(normalized);
  return normalized;
}

function normalizeLocalPaper(paper) {
  return enrichPaper({
    title: paper.paper_title || "Título não identificado",
    authors: paper.authors || "Autores não identificados",
    year: Number(paper.publication_year) || null,
    journal: paper.journal_name && paper.journal_name !== "null" ? paper.journal_name : "Fonte não identificada",
    citations: Number(paper.citation_count) || 0,
    url: paper.url || "#",
    doi: "",
    pmid: "",
    abstract: "",
    source: "BrowserAct JSON",
    evidenceType: titleCaseEvidence("article", paper.paper_title),
    isOpenAccess: false,
  });
}

function normalizeOpenAlexWork(work) {
  const location = work.primary_location || {};
  const source = location.source || {};
  const url = location.landing_page_url || work.doi || work.id || "#";
  const authors = (work.authorships || [])
    .slice(0, 8)
    .map((item) => item.author?.display_name)
    .filter(Boolean)
    .join(", ");

  return enrichPaper({
    title: work.display_name || "Título não identificado",
    authors: authors || "Autores não identificados",
    year: Number(work.publication_year) || null,
    journal: source.display_name || "Fonte não identificada",
    citations: Number(work.cited_by_count) || 0,
    url,
    domainOverride: source.host_organization_name || source.display_name || "",
    publisher: (source.host_organization_lineage_names || []).join(", "),
    doi: work.doi || "",
    pmid: work.ids?.pmid || "",
    abstract: abstractFromInvertedIndex(work.abstract_inverted_index),
    source: "OpenAlex",
    evidenceType: titleCaseEvidence(work.type, work.display_name),
    isOpenAccess: Boolean(work.open_access?.is_oa),
  });
}

function normalizePubMedArticle(article) {
  const pmid = textFrom(article, "MedlineCitation > PMID");
  const title = textFrom(article, "ArticleTitle") || "Título não identificado";
  const journal = textFrom(article, "Journal > Title") || textFrom(article, "ISOAbbreviation") || "PubMed";
  const year =
    Number(textFrom(article, "JournalIssue PubDate Year")) ||
    Number(textFrom(article, "ArticleDate Year")) ||
    Number(textFrom(article, "DateCompleted Year")) ||
    null;
  const authorNames = [...article.querySelectorAll("AuthorList > Author")]
    .slice(0, 8)
    .map((author) => {
      const collective = textFrom(author, "CollectiveName");
      if (collective) return collective;
      return [textFrom(author, "ForeName"), textFrom(author, "LastName")].filter(Boolean).join(" ");
    })
    .filter(Boolean)
    .join(", ");
  const doi = [...article.querySelectorAll("ArticleId, ELocationID")]
    .find((item) => (item.getAttribute("IdType") || item.getAttribute("EIdType")) === "doi")
    ?.textContent?.trim();
  const abstract = allTextFrom(article, "Abstract AbstractText").join(" ");
  const publicationTypes = allTextFrom(article, "PublicationTypeList PublicationType");
  const meshTerms = allTextFrom(article, "MeshHeading DescriptorName").slice(0, 8);

  return enrichPaper({
    title,
    authors: authorNames || "Autores não identificados",
    year,
    journal,
    citations: 0,
    url: pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : doi ? `https://doi.org/${doi}` : "#",
    domainOverride: "PubMed",
    doi: doi ? `10.${doi.split("10.")[1] || doi}` : "",
    pmid,
    abstract,
    source: "PubMed",
    publisher: "NCBI",
    evidenceType: titleCaseEvidence(publicationTypes.join(" "), title),
    isOpenAccess: false,
    meshTerms,
  });
}

function dedupePapers(papers) {
  const seen = new Map();
  papers.forEach((paper) => {
    const key = (paper.doi || paper.pmid || paper.title).toLowerCase().replace(/[^a-z0-9]+/g, "");
    const previous = seen.get(key);
    if (!previous) {
      seen.set(key, paper);
      return;
    }
    const merged = enrichPaper({
      ...previous,
      ...paper,
      title: previous.title.length >= paper.title.length ? previous.title : paper.title,
      authors: previous.authors !== "Autores não identificados" ? previous.authors : paper.authors,
      year: previous.year || paper.year,
      journal: previous.journal !== "Fonte não identificada" ? previous.journal : paper.journal,
      citations: Math.max(previous.citations, paper.citations),
      url: previous.url !== "#" ? previous.url : paper.url,
      doi: previous.doi || paper.doi,
      pmid: previous.pmid || paper.pmid,
      abstract: previous.abstract.length >= paper.abstract.length ? previous.abstract : paper.abstract,
      source: previous.source === paper.source ? previous.source : `${previous.source} + ${paper.source}`,
      isOpenAccess: previous.isOpenAccess || paper.isOpenAccess,
      meshTerms: [...new Set([...(previous.meshTerms || []), ...(paper.meshTerms || [])])],
    });
    seen.set(key, merged);
  });
  return [...seen.values()];
}

function resetYearOptions() {
  const current = state.year;
  els.yearSelect.innerHTML = '<option value="all">Todos</option>';
  const years = [...new Set(state.papers.map((paper) => paper.year).filter(Boolean))].sort((a, b) => b - a);
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = year;
    els.yearSelect.append(option);
  });
  els.yearSelect.value = years.includes(Number(current)) ? current : "all";
  state.year = els.yearSelect.value;
}

function syncActiveTopicChip(topic) {
  const normalizedTopic = normalizeText(topic);
  document.querySelectorAll("[data-topic]").forEach((button) => {
    const isMatch = normalizeText(button.dataset.topic || "") === normalizedTopic;
    button.classList.toggle("is-active", isMatch);
  });
}

function loadDefaultLibrary() {
  els.topicInput.value = "";
  syncActiveTopicChip("");
  searchScientific({
    fallbackTopic: DEFAULT_LIBRARY_TOPIC,
    fallbackTopics: DEFAULT_LIBRARY_TOPICS,
    publicLabel: "Biblioteca científica DOD",
  });
}

function clearCardsForSearch() {
  state.papers = [];
  state.query = "";
  state.year = "all";
  state.minCitations = 0;
  state.cleanSources = false;
  state.strictEvidence = false;
  state.synthesis = null;
  state.preserveLibraryOrder = false;
  els.searchInput.value = "";
  els.yearSelect.innerHTML = '<option value="all">Todos</option>';
  els.minCitations.value = "0";
  els.cleanSources.checked = false;
  els.strictEvidence.checked = false;
  els.cards.innerHTML = "";
  els.emptyState.hidden = true;
  renderStats([]);
  renderSynthesis();
}

function setupEvents() {
  els.researchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    syncActiveTopicChip(els.topicInput.value.trim());
    if (!els.topicInput.value.trim()) {
      loadDefaultLibrary();
      return;
    }
    searchScientific();
  });

  els.loadLocalButton.addEventListener("click", () => loadLocalData());
  els.copyStrategyButton.addEventListener("click", () => copySearchStrategy());
  els.exportJsonButton.addEventListener("click", () => exportData("json"));
  els.exportCsvButton.addEventListener("click", () => exportData("csv"));
  els.exportVancouverButton.addEventListener("click", () => exportData("vancouver"));
  els.exportMarkdownButton.addEventListener("click", () => exportData("markdown"));
  els.inferPicoButton.addEventListener("click", () => inferPico());
  els.applyPicoButton.addEventListener("click", () => applyPicoToTopic());
  els.saveProjectButton.addEventListener("click", () => saveProject());
  els.loadProjectButton.addEventListener("click", () => loadProject());
  els.deleteProjectButton.addEventListener("click", () => deleteProject());
  els.synthesisButton.addEventListener("click", () => {
    state.synthesis = buildSynthesis(getFilteredPapers());
    renderSynthesis();
  });

  els.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    render();
  });

  els.yearSelect.addEventListener("change", (event) => {
    state.year = event.target.value;
    render();
  });

  els.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  els.minCitations.addEventListener("input", (event) => {
    state.minCitations = Number(event.target.value) || 0;
    render();
  });

  els.cleanSources.addEventListener("change", (event) => {
    state.cleanSources = event.target.checked;
    render();
  });

  els.strictEvidence.addEventListener("change", (event) => {
    state.strictEvidence = event.target.checked;
    state.synthesis = buildSynthesis(getFilteredPapers());
    render();
  });

  document.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      els.topicInput.value = button.dataset.topic || "";
      syncActiveTopicChip(els.topicInput.value.trim());
      if (!els.topicInput.value.trim()) {
        loadDefaultLibrary();
        return;
      }
      searchScientific({
        queryTopic: button.dataset.queryTopic || "",
        displayTopic: els.topicInput.value.trim(),
      });
    });
  });

  els.readerClose.addEventListener("click", closeReader);
  els.readerBackdrop.addEventListener("click", closeReader);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.readerModal.hidden) closeReader();
  });

  refreshProjectSelect();
}

async function fetchOpenAlex(topic, fromYear, limit) {
  const params = new URLSearchParams({
    search: topic,
    per_page: String(Math.min(limit, 200)),
    filter: `from_publication_date:${fromYear}-01-01`,
  });
  const response = await fetch(`${OPENALEX_URL}?${params.toString()}`);
  if (!response.ok) throw new Error(`OpenAlex HTTP ${response.status}`);
  const payload = await response.json();
  return (payload.results || []).map(normalizeOpenAlexWork);
}

async function fetchPubMed(topic, fromYear, limit) {
  const searchParams = new URLSearchParams({
    db: "pubmed",
    term: topic,
    retmode: "json",
    retmax: String(Math.min(limit, 200)),
    mindate: String(fromYear),
    datetype: "pdat",
    sort: "relevance",
  });
  const searchResponse = await fetch(`${PUBMED_BASE_URL}/esearch.fcgi?${searchParams.toString()}`);
  if (!searchResponse.ok) throw new Error(`PubMed search HTTP ${searchResponse.status}`);
  const searchPayload = await searchResponse.json();
  const ids = searchPayload.esearchresult?.idlist || [];
  if (!ids.length) return [];

  const fetchParams = new URLSearchParams({
    db: "pubmed",
    id: ids.join(","),
    retmode: "xml",
  });
  const fetchResponse = await fetch(`${PUBMED_BASE_URL}/efetch.fcgi?${fetchParams.toString()}`);
  if (!fetchResponse.ok) throw new Error(`PubMed fetch HTTP ${fetchResponse.status}`);
  const xml = await fetchResponse.text();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  return [...doc.querySelectorAll("PubmedArticle")].map(normalizePubMedArticle);
}

async function searchScientific(options = {}) {
  const displayTopic = els.topicInput.value.trim();
  const topic = options.queryTopic || displayTopic || options.fallbackTopic || "";
  if (!topic) return;
  const rawTopics = options.fallbackTopics?.length && !displayTopic && !options.queryTopic ? options.fallbackTopics : [topic];
  const expandedTopics = rawTopics.map(expandPortugueseQuery);
  const expandedTopic = expandedTopics.join(" ");
  const publicLabel = options.publicLabel || options.displayTopic || displayTopic || topic;

  const fromYear = Math.max(1900, Math.min(2026, Number(els.fromYearInput.value) || 2020));
  const limit = Math.max(1, Math.min(200, Number(els.resultLimit.value) || 50));
  const source = els.sourceSelect.value;
  const cacheKey = buildSearchCacheKey(source, fromYear, limit, expandedTopics);

  clearCardsForSearch();
  setLoading(true, options.publicLabel ? `Preparando ${publicLabel}...` : `Buscando "${publicLabel}" em ${sourceLabel(source)}...`);
  try {
    const jobs = [];
    const isDefaultLibrary = Boolean(options.fallbackTopics?.length && !els.topicInput.value.trim());
    const perTopicLimit = rawTopics.length > 1 ? Math.max(10, Math.ceil(limit / rawTopics.length)) : limit;
    expandedTopics.forEach((query, topicIndex) => {
      const tagTopic = (items) => items.map((paper) => ({
        ...paper,
        libraryTopicIndex: topicIndex,
        libraryTopicLabel: isDefaultLibrary ? DEFAULT_LIBRARY_LABELS[topicIndex] || "" : "",
      }));
      if (source === "openalex" || source === "both" || isDefaultLibrary) jobs.push(fetchOpenAlex(query, fromYear, perTopicLimit).then(tagTopic));
      if (!isDefaultLibrary && (source === "pubmed" || source === "both")) jobs.push(fetchPubMed(query, fromYear, perTopicLimit).then(tagTopic));
    });
    const settled = await Promise.allSettled(jobs);
    let papers = settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
    const errors = settled.filter((result) => result.status === "rejected").map((result) => result.reason.message);
    if (!papers.length && errors.length) {
      const cachedPapers = readSearchCache(cacheKey);
      if (cachedPapers?.length) papers = cachedPapers;
      else throw new Error(errors.join(" | "));
    }

    state.papers = (isDefaultLibrary
      ? rankDefaultLibraryPapers(papers, expandedTopics)
      : rankBySearchRelevance(dedupePapers(papers), expandedTopic))
      .map((paper, libraryOrder) => ({ ...paper, libraryOrder }));
    state.preserveLibraryOrder = isDefaultLibrary;
    state.dataSource = sourceLabel(source);
    state.lastTopic = topic;
    state.expandedTopic = expandedTopic;
    state.synthesis = buildSynthesis(state.papers);
    writeSearchCache(cacheKey, state.papers);
    resetYearOptions();
    render();
    if (options.publicLabel) {
      setStatus(`${publicLabel} pronta com ${state.papers.length} trabalhos rastreáveis.`);
    } else {
      const expansionNote = expandedTopic !== topic ? ` Busca expandida: "${expandedTopic}".` : "";
      const partialNote = errors.length ? " Algumas fontes não responderam nesta rodada, mas os cards rastreáveis foram mantidos." : "";
      setStatus(`${state.dataSource} retornou ${state.papers.length} trabalhos para "${publicLabel}".${expansionNote}${partialNote}`);
    }
  } catch (error) {
    setStatus(`Falha na busca: ${error.message}. O JSON local continua disponível.`, true);
    if (!state.papers.length) await loadLocalData();
  } finally {
    setLoading(false);
  }
}

function sourceLabel(source) {
  if (source === "both") return "OpenAlex + PubMed";
  if (source === "pubmed") return "PubMed";
  return "OpenAlex";
}

function inferPico() {
  const topic = els.topicInput.value.trim();
  const tokens = topic.split(/\s+/).filter(Boolean);
  const lower = normalizeText(topic);
  const outcomeHints = ["mortalidade", "diagnostico", "acuracia", "sobrevida", "prognostico", "readmissao", "complicacao", "desfecho", "mortality", "diagnosis", "accuracy", "survival", "prognosis", "outcome"];
  const interventionHints = ["aprendizado de maquina", "inteligencia artificial", "aprendizado profundo", "machine learning", "artificial intelligence", "deep learning", "rastreamento", "tratamento", "modelo"];
  const populationHints = ["pediatrico", "pediatrica", "criancas", "crianca", "adultos", "idosos", "sepse", "asma", "avc", "diabetes", "emergencia", "uti", "saude", "pediatric", "children", "adult", "elderly", "sepsis", "asthma", "stroke", "diabetes", "emergency", "icu", "healthcare"];

  const intervention = interventionHints.find((hint) => lower.includes(normalizeText(hint))) || tokens.slice(0, 2).join(" ");
  const outcome = outcomeHints.find((hint) => lower.includes(normalizeText(hint))) || "";
  const populationTerms = populationHints.filter((hint) => lower.includes(normalizeText(hint))).join(" ");
  const population = populationTerms || tokens.filter((term) => !intervention.toLowerCase().includes(term.toLowerCase())).slice(-3).join(" ");

  els.picoPopulation.value = population;
  els.picoIntervention.value = intervention;
  els.picoComparator.value = els.picoComparator.value || "cuidado usual";
  els.picoOutcome.value = outcome;
  setStatus("PICO inferido. Ajuste os campos se quiser e aplique no tema.");
}

function applyPicoToTopic() {
  const parts = [
    els.picoPopulation.value,
    els.picoIntervention.value,
    els.picoComparator.value,
    els.picoOutcome.value,
  ]
    .map((value) => value.trim())
    .filter(Boolean);
  if (!parts.length) {
    setStatus("Preencha pelo menos um campo PICO.", true);
    return;
  }
  els.topicInput.value = [...new Set(parts.join(" ").split(/\s+/))].join(" ");
  setStatus("PICO aplicado ao tema de busca.");
}

async function loadLocalData() {
  setLoading(true, "Carregando JSON local...");
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const raw = await response.json();
    state.papers = dedupePapers(raw.map(normalizeLocalPaper));
    state.dataSource = "JSON local";
    state.lastTopic = "BrowserAct export";
    state.synthesis = buildSynthesis(state.papers);
    resetYearOptions();
    render();
    setStatus(`JSON local carregado com ${state.papers.length} artigos.`);
  } catch (error) {
    els.cards.innerHTML = "";
    els.emptyState.hidden = false;
    els.emptyState.textContent = `Não consegui carregar ${DATA_URL}: ${error.message}`;
    setStatus(`Falha ao carregar JSON local: ${error.message}`, true);
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading, message) {
  els.searchButton.disabled = isLoading;
  els.loadLocalButton.disabled = isLoading;
  if (message) setStatus(message);
}

function setStatus(message, isError = false) {
  els.runStatus.textContent = message;
  els.runStatus.classList.toggle("is-error", isError);
}

function getFilteredPapers() {
  const strongEvidence = new Set(["guideline", "systematic-review", "meta-analysis", "trial"]);
  const filtered = state.papers.filter((paper) => {
    const haystack = `${paper.title} ${paper.authors} ${paper.journal} ${paper.domain} ${paper.evidenceType}`.toLowerCase();
    const matchesQuery = !state.query || haystack.includes(state.query);
    const matchesYear = state.year === "all" || String(paper.year) === state.year;
    const matchesCitations = paper.citations >= state.minCitations;
    const matchesSource = !state.cleanSources || !paper.isNoisy;
    const matchesEvidence = !state.strictEvidence || strongEvidence.has(paper.evidenceType);
    return matchesQuery && matchesYear && matchesCitations && matchesSource && matchesEvidence;
  });

  return filtered.sort((a, b) => {
    if (state.preserveLibraryOrder && state.sort === "score-desc" && !state.query && state.year === "all") {
      return (a.libraryOrder ?? 9999) - (b.libraryOrder ?? 9999);
    }
    if (state.sort === "citations-desc") return b.citations - a.citations;
    if (state.sort === "citations-asc") return a.citations - b.citations;
    if (state.sort === "year-desc") return (b.year || 0) - (a.year || 0) || b.score - a.score;
    if (state.sort === "title-asc") return a.title.localeCompare(b.title);
    return (b.searchRelevance || 0) - (a.searchRelevance || 0) || b.score - a.score || b.citations - a.citations;
  });
}

function renderStats(filtered) {
  const total = state.papers.length;
  const years = [...new Set(state.papers.map((paper) => paper.year).filter(Boolean))].sort().join("-");
  const noisy = state.papers.filter((paper) => paper.isNoisy).length;
  const preferred = state.papers.filter((paper) => paper.isPreferred).length;
  const topScore = Math.max(0, ...filtered.map((paper) => paper.score));

  els.stats.innerHTML = "";
  [
    `${total} artigos`,
    state.dataSource,
    `${years || "sem ano"}`,
    `${noisy} fontes frágeis`,
    `${preferred} preferenciais`,
  ].forEach((label) => {
    const chip = document.createElement("span");
    chip.className = "stat-chip";
    chip.textContent = label;
    els.stats.append(chip);
  });

  els.visibleCount.textContent = filtered.length;
  els.topScore.textContent = topScore;
  els.cleanRatio.textContent = `${Math.round((preferred / Math.max(total, 1)) * 100)}%`;
}

function renderCard(paper) {
  const node = els.template.content.firstElementChild.cloneNode(true);
  const visual = node.querySelector(".card-visual");
  const code = node.querySelector(".card-code");
  const source = node.querySelector(".source-pill");
  const title = node.querySelector("h2");
  const abstract = node.querySelector(".abstract");
  const journal = node.querySelector(".journal");
  const evidence = node.querySelector(".evidence-pill");
  const oa = node.querySelector(".oa-pill");
  const link = node.querySelector(".source-link");
  const readButton = node.querySelector(".read-button");
  const [cardA, cardB] = colorPair(paper);
  const href = bestSourceUrl(paper);
  const translatedTitle = buildPtBrTitle(paper);
  const translatedAbstract = buildPtBrSummary(paper, 220);

  visual.style.setProperty("--card-a", cardA);
  visual.style.setProperty("--card-b", cardB);
  code.textContent = cardCode(paper);
  source.textContent = paper.source.includes("PubMed") ? "PUBMED" : "OPENALEX";
  source.title = paper.domain;
  title.textContent = translatedTitle || paper.title;
  title.title = paper.title;
  abstract.textContent = translatedAbstract;
  abstract.title = paper.abstract ? stripHtml(paper.abstract) : "";
  journal.textContent = [paper.journal, paper.year || "", paper.doi ? paper.doi.replace("https://doi.org/", "DOI ") : "", paper.pmid ? `PMID ${String(paper.pmid).replace(/\D/g, "")}` : ""]
    .filter(Boolean)
    .join(" • ");
  evidence.textContent = labelEvidence(paper.evidenceType);
  oa.textContent = "DOD";
  oa.classList.toggle("is-oa", paper.isOpenAccess);
  link.href = href;
  readButton.addEventListener("click", () => openReader(paper));

  return node;
}

function openReader(paper) {
  const href = bestSourceUrl(paper);
  const trace = [
    paper.doi ? `DOI: ${paper.doi.replace("https://doi.org/", "")}` : "",
    paper.pmid ? `PMID: ${String(paper.pmid).replace(/\D/g, "")}` : "",
    `${paper.citations || 0} citações`,
    `score ${paper.score}`,
  ].filter(Boolean);

  els.readerTitle.textContent = buildPtBrTitle(paper);
  els.readerOriginalTitle.textContent = `Original: ${paper.title}`;
  els.readerTags.innerHTML = "";
  [labelEvidence(paper.evidenceType), paper.source.includes("PubMed") ? "PubMed" : "OpenAlex", accessLabel(paper), "DOD"].forEach((tag) => {
    const item = document.createElement("span");
    item.className = "evidence-pill";
    item.textContent = tag;
    els.readerTags.append(item);
  });
  els.readerAbstract.textContent = buildPtBrSummary(paper, 900);
  els.readerSource.textContent = [paper.journal, paper.year || "ano não informado"].filter(Boolean).join(" • ");
  els.readerTrace.textContent = trace.join(" • ") || "Metadado mínimo disponível.";
  els.readerAuthors.textContent = paper.authors || "Autores não identificados";
  els.readerSourceLink.href = href;
  els.readerCopy.onclick = async () => {
    const reference = formatVancouver(paper);
    try {
      await navigator.clipboard.writeText(reference);
      els.readerCopy.textContent = "copiado";
      setTimeout(() => {
        els.readerCopy.textContent = "copiar referência";
      }, 1300);
    } catch {
      downloadFile(`dod-reference-${Date.now()}.txt`, reference, "text/plain");
    }
  };

  els.readerModal.hidden = false;
  document.body.classList.add("modal-open");
  els.readerClose.focus();
}

function closeReader() {
  els.readerModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function render() {
  const filtered = getFilteredPapers();
  renderStats(filtered);
  if (state.synthesis) renderSynthesis();
  els.cards.innerHTML = "";
  const fragment = document.createDocumentFragment();
  filtered.forEach((paper) => fragment.append(renderCard(paper)));
  els.cards.append(fragment);
  els.emptyState.hidden = filtered.length > 0;
}

function buildSynthesis(papers) {
  const visible = papers.slice(0, 25);
  const top = visible.slice(0, 5);
  const evidenceCounts = visible.reduce((acc, paper) => {
    acc[paper.evidenceType] = (acc[paper.evidenceType] || 0) + 1;
    return acc;
  }, {});
  const years = visible.map((paper) => paper.year).filter(Boolean);
  const openAccess = visible.filter((paper) => paper.isOpenAccess).length;
  const pmids = visible.filter((paper) => paper.pmid).length;
  const dois = visible.filter((paper) => paper.doi).length;
  const abstracts = visible.filter((paper) => paper.abstract).length;
  const strongEvidence = visible.filter((paper) => ["guideline", "systematic-review", "meta-analysis", "trial"].includes(paper.evidenceType)).length;
  const meshTerms = visible.flatMap((paper) => paper.meshTerms || []);
  const topMesh = Object.entries(
    meshTerms.reduce((acc, term) => {
      acc[term] = (acc[term] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([term]) => term);

  return {
    total: papers.length,
    window: years.length ? `${Math.min(...years)}-${Math.max(...years)}` : "sem ano",
    evidenceCounts,
    top,
    openAccess,
    pmids,
    dois,
    abstracts,
    strongEvidence,
    topMesh,
  };
}

function renderSynthesis() {
  const synthesis = state.synthesis;
  if (!synthesis) {
    els.synthesisGrid.innerHTML = "";
    return;
  }
  const evidenceText = Object.entries(synthesis.evidenceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => `${labelEvidence(type)}: ${count}`)
    .join(", ");
  const topItems = synthesis.top
    .slice(0, 3)
    .map((paper) => `<li>${escapeHtml(paper.title)} (${paper.year || "s/ano"})</li>`)
    .join("");
  const meshText = synthesis.topMesh.length ? synthesis.topMesh.join(", ") : "sem MeSH nesta base";
  const gapText = buildGapText(synthesis);

  els.synthesisGrid.innerHTML = `
    <div class="synthesis-block">
      <strong>Força do conjunto</strong>
      <p>${synthesis.total} trabalhos; janela ${synthesis.window}; ${synthesis.dois} DOI; ${synthesis.pmids} PMID.</p>
    </div>
    <div class="synthesis-block">
      <strong>Tipos de evidência</strong>
      <p>${evidenceText || "Ainda sem classificação suficiente."}</p>
    </div>
    <div class="synthesis-block">
      <strong>Termos MeSH</strong>
      <p>${escapeHtml(meshText)}</p>
    </div>
    <div class="synthesis-block">
      <strong>Top papers</strong>
      <ul>${topItems || "<li>Nenhum resultado visível.</li>"}</ul>
    </div>
    <div class="synthesis-block">
      <strong>Lacunas</strong>
      <p>${escapeHtml(gapText)}</p>
    </div>
  `;
}

function buildGapText(synthesis) {
  const gaps = [];
  if (synthesis.strongEvidence < 5) gaps.push("pouca evidência forte no recorte atual");
  if (synthesis.pmids < Math.ceil(synthesis.total * 0.2)) gaps.push("baixo lastro PubMed/PMID");
  if (synthesis.abstracts < Math.ceil(synthesis.total * 0.4)) gaps.push("muitos registros sem resumo");
  if (!synthesis.topMesh.length) gaps.push("sem termos MeSH suficientes");
  return gaps.length ? gaps.join("; ") : "conjunto saudável para triagem inicial";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function exportData(type) {
  const filtered = getFilteredPapers();
  if (!filtered.length) {
    setStatus("Não há dados para exportar.", true);
    return;
  }

  if (type === "csv") {
    const columns = ["title", "authors", "year", "journal", "citations", "score", "evidenceType", "doi", "pmid", "url"];
    const rows = filtered.map((paper) =>
      columns
        .map((column) => `"${String(column === "url" ? bestSourceUrl(paper) : paper[column] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    downloadFile(`dod-research-${Date.now()}.csv`, [columns.join(","), ...rows].join("\n"), "text/csv");
    return;
  }

  if (type === "vancouver") {
    const lines = filtered.slice(0, 50).map((paper, index) => `${index + 1}. ${formatVancouver(paper)}`);
    downloadFile(`dod-vancouver-${Date.now()}.txt`, lines.join("\n\n"), "text/plain");
    return;
  }

  if (type === "markdown") {
    downloadFile(`dod-synthesis-${Date.now()}.md`, buildMarkdownReport(filtered), "text/markdown");
    return;
  }

  downloadFile(`dod-research-${Date.now()}.json`, JSON.stringify(filtered, null, 2), "application/json");
}

function buildMarkdownReport(papers) {
  const synthesis = buildSynthesis(papers);
  const evidenceText = Object.entries(synthesis.evidenceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => `- ${labelEvidence(type)}: ${count}`)
    .join("\n");
  const top = papers.slice(0, 12).map((paper, index) => {
    return `### ${index + 1}. ${paper.title}
- Ano: ${paper.year || "não informado"}
- Fonte: ${paper.journal}
- Tipo: ${labelEvidence(paper.evidenceType)}
- Score: ${paper.score}
- Citações: ${paper.citations}
- DOI/PMID: ${[paper.doi, paper.pmid].filter(Boolean).join(" / ") || "não informado"}
- URL: ${bestSourceUrl(paper)}
- Resumo: ${paper.abstract ? stripHtml(paper.abstract).slice(0, 500) : "não disponível"}`;
  }).join("\n\n");

  return `# DOD Research Engine

## Estratégia
Tema: ${els.topicInput.value.trim()}
Tema expandido: ${state.expandedTopic || expandPortugueseQuery(els.topicInput.value.trim())}
Base: ${sourceLabel(els.sourceSelect.value)}
Ano inicial: ${els.fromYearInput.value}
Modo rigoroso: ${state.strictEvidence ? "sim" : "não"}

## Síntese
- Total: ${synthesis.total}
- Janela: ${synthesis.window}
- DOI: ${synthesis.dois}
- PMID: ${synthesis.pmids}
- Termos MeSH: ${synthesis.topMesh.join(", ") || "sem MeSH suficiente"}
- Lacunas: ${buildGapText(synthesis)}

## Tipos de evidência
${evidenceText || "- Sem classificação suficiente"}

## Trabalhos principais
${top}
`;
}

function formatVancouver(paper) {
  const authors = paper.authors === "Autores não identificados" ? "" : `${paper.authors}. `;
  const year = paper.year ? `${paper.year};` : "";
  const doi = paper.doi ? ` doi: ${paper.doi.replace("https://doi.org/", "")}.` : "";
  const pmid = paper.pmid ? ` PMID: ${paper.pmid.replace("https://pubmed.ncbi.nlm.nih.gov/", "").replace("/", "")}.` : "";
  return `${authors}${paper.title}. ${paper.journal}. ${year}${doi}${pmid} Disponível em: ${bestSourceUrl(paper)}.`.replace(/\s+/g, " ").trim();
}

async function copySearchStrategy() {
  const topic = els.topicInput.value.trim();
  const expandedTopic = expandPortugueseQuery(topic);
  const fromYear = Math.max(1900, Math.min(2026, Number(els.fromYearInput.value) || 2020));
  const terms = expandedTopic
    .split(/\s+/)
    .map((term) => term.replace(/[^\w-]/g, ""))
    .filter(Boolean);
  const pubmed = `${terms.map((term) => `"${term}"[Title/Abstract]`).join(" AND ")} AND ("${fromYear}"[Date - Publication] : "3000"[Date - Publication])`;
  const openAlex = `search="${expandedTopic}" filter=from_publication_date:${fromYear}-01-01`;
  const strategy = `Tema original: ${topic}\nTema expandido: ${expandedTopic}\nBase: ${sourceLabel(els.sourceSelect.value)}\nOpenAlex: ${openAlex}\nPubMed: ${pubmed}`;

  try {
    await navigator.clipboard.writeText(strategy);
    setStatus("Estratégia de busca copiada.");
  } catch {
    downloadFile(`dod-search-strategy-${Date.now()}.txt`, strategy, "text/plain");
  }
}

function getProjects() {
  try {
    return JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function setProjects(projects) {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

function currentProjectSnapshot(name) {
  return {
    name,
    savedAt: new Date().toISOString(),
    topic: els.topicInput.value,
    expandedTopic: expandPortugueseQuery(els.topicInput.value),
    source: els.sourceSelect.value,
    fromYear: els.fromYearInput.value,
    limit: els.resultLimit.value,
    filters: {
      query: els.searchInput.value,
      year: state.year,
      sort: state.sort,
      minCitations: state.minCitations,
      cleanSources: state.cleanSources,
      strictEvidence: state.strictEvidence,
    },
    pico: {
      population: els.picoPopulation.value,
      intervention: els.picoIntervention.value,
      comparator: els.picoComparator.value,
      outcome: els.picoOutcome.value,
    },
    papers: state.papers,
  };
}

function saveProject() {
  const name = els.projectNameInput.value.trim() || `${els.topicInput.value.trim() || "Pesquisa"} ${new Date().toLocaleDateString("pt-BR")}`;
  const projects = getProjects();
  projects[name] = currentProjectSnapshot(name);
  setProjects(projects);
  refreshProjectSelect(name);
  setStatus(`Projeto "${name}" salvo neste navegador.`);
}

function loadProject() {
  const name = els.projectSelect.value;
  const project = getProjects()[name];
  if (!project) {
    setStatus("Selecione um projeto salvo.", true);
    return;
  }

  els.topicInput.value = project.topic || "";
  els.sourceSelect.value = project.source || "both";
  els.fromYearInput.value = project.fromYear || "2020";
  els.resultLimit.value = project.limit || "50";
  els.searchInput.value = project.filters?.query || "";
  state.query = els.searchInput.value.trim().toLowerCase();
  state.sort = project.filters?.sort || "score-desc";
  els.sortSelect.value = state.sort;
  state.minCitations = Number(project.filters?.minCitations) || 0;
  els.minCitations.value = String(state.minCitations);
  state.cleanSources = Boolean(project.filters?.cleanSources);
  els.cleanSources.checked = state.cleanSources;
  state.strictEvidence = Boolean(project.filters?.strictEvidence);
  els.strictEvidence.checked = state.strictEvidence;
  els.picoPopulation.value = project.pico?.population || "";
  els.picoIntervention.value = project.pico?.intervention || "";
  els.picoComparator.value = project.pico?.comparator || "";
  els.picoOutcome.value = project.pico?.outcome || "";
  state.papers = (project.papers || []).map(enrichPaper);
  state.dataSource = `${sourceLabel(els.sourceSelect.value)} salvo`;
  state.lastTopic = project.topic || "";
  state.expandedTopic = project.expandedTopic || expandPortugueseQuery(project.topic || "");
  resetYearOptions();
  if (project.filters?.year) {
    state.year = project.filters.year;
    els.yearSelect.value = state.year;
  }
  state.synthesis = buildSynthesis(getFilteredPapers());
  render();
  setStatus(`Projeto "${name}" carregado.`);
}

function deleteProject() {
  const name = els.projectSelect.value;
  if (!name) {
    setStatus("Selecione um projeto para excluir.", true);
    return;
  }
  const projects = getProjects();
  delete projects[name];
  setProjects(projects);
  refreshProjectSelect();
  setStatus(`Projeto "${name}" excluído.`);
}

function refreshProjectSelect(selected = "") {
  const projects = getProjects();
  els.projectSelect.innerHTML = '<option value="">Projetos salvos</option>';
  Object.values(projects)
    .sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)))
    .forEach((project) => {
      const option = document.createElement("option");
      option.value = project.name;
      option.textContent = project.name;
      els.projectSelect.append(option);
    });
  els.projectSelect.value = selected;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus(`${filename} exportado.`);
}

async function boot() {
  setupEvents();
  loadDefaultLibrary();
}

boot();
