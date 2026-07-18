const definitions = [
  ["machine_learning", "aprendizado de máquina", ["machine learning", "supervised machine learning"]],
  ["artificial_intelligence", "inteligência artificial", ["artificial intelligence", "deep learning"]],
  ["pediatric_health", "saúde pediátrica", ["pediatric", "children", "child"]],
  ["critical_care", "cuidados críticos", ["critical care", "intensive care unit"]],
  ["acute_lung_injury", "lesão pulmonar aguda", ["acute lung injury"]],
  ["acute_respiratory_failure", "insuficiência respiratória aguda", ["acute respiratory failure", "respiratory failure", "respiratory support"]],
  ["sepsis", "sepse", ["sepsis", "septic shock"]],
  ["headache_migraine", "cefaleia e enxaqueca", ["headache", "headache disorders", "migraine"]],
  ["vestibular_balance", "tontura, vertigem e equilíbrio", ["dizziness", "vertigo", "vestibular disorders"]],
  ["autonomic_variability", "variabilidade cardíaca e sistema autonômico", ["heart rate variability", "heart rate", "autonomic nervous system"]],
  ["sleep_circadian", "sono e ritmo circadiano", ["sleep", "circadian rhythm"]],
  ["homeostasis", "homeostase", ["homeostasis", "allostasis"]],
  ["recovery_rehabilitation", "recuperação e reabilitação", ["recovery", "muscle recovery", "rehabilitation"]],
  ["pain", "dor", ["pain", "chronic pain"]],
  ["inflammation", "inflamação", ["inflammation"]],
  ["motor_control_learning", "controle e aprendizagem motora", ["motor learning", "motor control", "motor cortex", "motor skills"]],
  ["neuroplasticity", "neuroplasticidade", ["neuroplasticity", "neural plasticity", "neuronal plasticity"]],
  ["action_potential", "potencial de ação e excitabilidade", ["action potential", "action potentials", "neuronal excitability"]],
  ["proprioception_balance", "propriocepção e equilíbrio", ["proprioception", "balance", "posture"]],
  ["strength_power", "força e potência", ["strength", "muscle strength", "power"]],
  ["load_adaptation", "carga e adaptação", ["training load", "load", "tendon load adaptation"]],
  ["muscle_tendon_injury", "lesão muscular e tendão", ["muscle injury", "tendon"]],
  ["fatigue", "fadiga", ["fatigue", "neuromuscular fatigue"]],
  ["sports_performance", "performance esportiva", ["sport", "sports performance", "sport performance", "exercise training"]],
  ["aerobic_capacity", "capacidade aeróbia", ["aerobic capacity", "oxygen consumption", "vo2 max"]],
  ["reaction_time", "tempo de reação", ["reaction time"]],
  ["executive_function", "função executiva", ["executive function"]],
  ["nutrition", "nutrição", ["nutrition", "protein"]],
  ["breathing", "respiração", ["breathing", "ventilation", "respiration"]],
  ["stress_cortisol", "estresse e cortisol", ["cortisol", "stress"]],
  ["diagnosis", "diagnóstico", ["diagnosis", "early diagnosis", "diagnostic accuracy"]],
  ["emergency_care", "emergência e resposta aguda", ["emergency", "emergencies", "acute response"]],
  ["clinical_assessment", "avaliação clínica e estratificação de risco", ["assessment", "clinical assessment", "neurological assessment", "assessment targets", "triage", "risk stratification"]],
  ["risk_prediction", "predição de risco", ["prediction", "risk", "prognosis", "mortality", "survival"]],
  ["cardiovascular", "saúde cardiovascular", ["cardiovascular"]],
  ["stroke", "acidente vascular cerebral", ["stroke"]],
  ["asthma", "asma", ["asthma"]],
  ["diabetes", "diabetes", ["diabetes"]],
  ["ecg", "eletrocardiograma", ["electrocardiogram", "ecg"], "cardiovascular"],
  ["ecg_measurements", "normalidade e medidas", ["ecg measurements", "qt interval", "qtc", "pr interval", "qrs"], "ecg"],
  ["ecg_rhythm", "ritmo, FA e flutter", ["cardiac rhythm", "atrial fibrillation", "atrial flutter", "arrhythmia"], "ecg"],
  ["ecg_conduction_intervals", "condução e intervalos", ["cardiac conduction", "conduction disorder", "ecg intervals"], "ecg"],
  ["ecg_st_t_injury", "segmento ST-T e lesão", ["st segment", "t wave", "myocardial injury"], "ecg"],
  ["ecg_overload_remodeling", "sobrecargas e remodelamento", ["cardiac hypertrophy", "cardiac remodeling", "ventricular overload"], "ecg"],
  ["ecg_ectopy_rate", "ectopias, pausas e frequência", ["ectopy", "cardiac pause", "bradycardia", "tachycardia"], "ecg"],
];

export const clinicalTopics = definitions.map(([id, labelPtBr, terms, parentId = null]) => ({ id, labelPtBr, terms, parentId }));
export const clinicalTopicsById = new Map(clinicalTopics.map((topic) => [topic.id, topic]));

export const defaultLibraryGroups = [
  ["neuro_recovery", "neuroplasticidade e recuperação", ["neuroplasticity", "motor_control_learning", "pain", "inflammation", "recovery_rehabilitation"], "neuroplasticity motor learning pain inflammation muscle recovery"],
  ["strength_fatigue_performance", "força, fadiga e performance", ["strength_power", "fatigue", "sports_performance"], "muscle strength fatigue sports performance"],
  ["autonomic_sleep_recovery", "HRV, sono e recuperação", ["autonomic_variability", "sleep_circadian", "recovery_rehabilitation"], "heart rate variability sleep recovery"],
  ["headache_vestibular", "cefaleia, vertigem e equilíbrio", ["headache_migraine", "vestibular_balance"], "headache emergency dizziness vertigo balance"],
  ["sepsis_respiratory", "sepse e respiração aguda", ["sepsis", "acute_respiratory_failure", "clinical_assessment"], "sepsis acute respiratory failure clinical assessment"],
].map(([id, label, topicIds, query]) => ({ id, label, topicIds, query }));

export const defaultLibraryTopic = defaultLibraryGroups.map((group) => group.query).join(" ");

// Busca e tradução têm uma fonte única, independente dos cards.
export const searchTermPairs = [
  ["aprendizado de máquina", "machine learning"], ["aprendizagem de máquina", "machine learning"],
  ["inteligência artificial", "artificial intelligence"], ["inteligencia artificial", "artificial intelligence"], ["aprendizado profundo", "deep learning"],
  ["saúde", "healthcare"], ["saude", "healthcare"], ["pediátrica", "pediatric"], ["pediatrica", "pediatric"], ["pediátrico", "pediatric"], ["pediatrico", "pediatric"],
  ["crianças", "children"], ["criancas", "children"], ["criança", "child"], ["crianca", "child"], ["adultos", "adult"], ["idosos", "elderly"],
  ["emergência", "emergency"], ["emergencia", "emergency"], ["pronto socorro", "emergency department"],
  ["cefaleia", "headache"], ["cefaleias", "headache disorders"], ["dor de cabeça", "headache"], ["dor de cabeca", "headache"],
  ["enxaqueca", "migraine"], ["migrânea", "migraine"], ["migranea", "migraine"], ["tontura", "dizziness"], ["vertigem", "vertigo"], ["vestibular", "vestibular disorders"],
  ["terapia intensiva", "intensive care"], ["uti", "intensive care unit"], ["sepse", "sepsis"], ["choque séptico", "septic shock"], ["choque septico", "septic shock"],
  ["insuficiência respiratória aguda", "acute respiratory failure"], ["insuficiencia respiratoria aguda", "acute respiratory failure"],
  ["falência respiratória aguda", "acute respiratory failure"], ["falencia respiratoria aguda", "acute respiratory failure"],
  ["falha respiratória aguda", "acute respiratory failure"], ["falha respiratoria aguda", "acute respiratory failure"],
  ["suporte respiratório", "respiratory support"], ["suporte respiratorio", "respiratory support"],
  ["diagnóstico", "diagnosis"], ["diagnostico", "diagnosis"], ["acurácia", "accuracy"], ["acuracia", "accuracy"], ["triagem", "triage"],
  ["avaliação", "assessment"], ["avaliacao", "assessment"], ["avaliação neurológica", "neurological assessment"], ["avaliacao neurologica", "neurological assessment"],
  ["metas de avaliação", "assessment targets"], ["metas de avaliacao", "assessment targets"], ["estratificação de risco", "risk stratification"], ["estratificacao de risco", "risk stratification"],
  ["mortalidade", "mortality"], ["sobrevida", "survival"], ["prognóstico", "prognosis"], ["prognostico", "prognosis"], ["tratamento", "treatment"],
  ["rastreamento", "screening"], ["prevenção", "prevention"], ["prevencao", "prevention"], ["risco", "risk"], ["predição", "prediction"], ["predicao", "prediction"],
  ["doença", "disease"], ["doenca", "disease"], ["cardiovascular", "cardiovascular"], ["diabetes", "diabetes"], ["asma", "asthma"], ["avc", "stroke"], ["derrame", "stroke"],
  ["cuidado usual", "standard care"], ["carga", "load"], ["carga de treino", "training load"], ["carga de treinamento", "training load"],
  ["lesão muscular", "muscle injury"], ["lesao muscular", "muscle injury"], ["reabilitação", "rehabilitation"], ["reabilitacao", "rehabilitation"],
  ["neuroplasticidade", "neuroplasticity"], ["plasticidade neural", "neural plasticity"], ["aprendizagem motora", "motor learning"], ["aprendizado motor", "motor learning"],
  ["controle motor", "motor control"], ["córtex motor", "motor cortex"], ["cortex motor", "motor cortex"], ["propriocepção", "proprioception"], ["propriocepcao", "proprioception"],
  ["dor", "pain"], ["inflamação", "inflammation"], ["inflamacao", "inflammation"], ["recuperação", "recovery"], ["recuperacao", "recovery"],
  ["recuperação muscular", "muscle recovery"], ["recuperacao muscular", "muscle recovery"], ["força", "strength"], ["forca", "strength"],
  ["força muscular", "muscle strength"], ["forca muscular", "muscle strength"], ["potência", "power"], ["potencia", "power"], ["fadiga", "fatigue"],
  ["fadiga neuromuscular", "neuromuscular fatigue"], ["performance esportiva", "sports performance"], ["esporte", "sport"], ["treino", "training"], ["treinamento", "training"],
  ["variabilidade da frequência cardíaca", "heart rate variability"], ["variabilidade da frequencia cardiaca", "heart rate variability"],
  ["frequência cardíaca", "heart rate"], ["frequencia cardiaca", "heart rate"], ["sono", "sleep"], ["ritmo circadiano", "circadian rhythm"],
  ["estresse", "stress"], ["stress", "stress"], ["cortisol", "cortisol"], ["nutrição", "nutrition"], ["nutricao", "nutrition"],
  ["proteína", "protein"], ["proteina", "protein"], ["tendão", "tendon"], ["tendao", "tendon"], ["equilíbrio", "balance"], ["equilibrio", "balance"],
  ["postura", "posture"], ["respiração", "breathing"], ["respiracao", "breathing"],
  ["sistema nervoso autonômico", "autonomic nervous system"], ["sistema nervoso autonomico", "autonomic nervous system"],
];

export const ptBrSearchTerms = Object.freeze(Object.fromEntries(searchTermPairs));
export const englishSearchTerms = Object.freeze([...new Set(searchTermPairs.map(([, en]) => en))]);

export const phraseTranslations = Object.freeze(Object.fromEntries([
  ["adverse events", "eventos adversos"], ["bloodstream infection", "infecção de corrente sanguínea"],
  ["cardiorespiratory fitness", "aptidão cardiorrespiratória"], ["clinical trial", "ensaio clínico"],
  ["concussion in sport", "concussão no esporte"], ["daily prediction", "predição diária"],
  ["acute lung injury", "lesão pulmonar aguda"], ["acute respiratory failure", "insuficiência respiratória aguda"],
  ["artificial intelligence", "inteligência artificial"], ["autonomic nervous system", "sistema nervoso autonômico"],
  ["chronic pain", "dor crônica"], ["clinical assessment", "avaliação clínica"], ["critical care", "cuidados críticos"],
  ["deep learning", "aprendizado profundo"], ["diagnostic accuracy", "acurácia diagnóstica"], ["dizziness and vertigo", "tontura e vertigem"],
  ["early diagnosis", "diagnóstico precoce"], ["emergency department", "pronto atendimento"], ["exercise training", "treinamento físico"],
  ["training load", "carga de treinamento"], ["headache disorders", "transtornos de cefaleia"], ["heart rate variability", "variabilidade da frequência cardíaca"],
  ["intensive care unit", "unidade de terapia intensiva"], ["machine learning", "aprendizado de máquina"], ["motor control", "controle motor"],
  ["meta-analysis", "meta-análise"],
  ["motor cortex", "córtex motor"], ["motor learning", "aprendizagem motora"], ["muscle injury", "lesão muscular"],
  ["muscle recovery", "recuperação muscular"], ["muscle strength", "força muscular"], ["neural plasticity", "plasticidade neural"],
  ["neurological assessment", "avaliação neurológica"], ["respiratory support", "suporte respiratório"],
  ["neurological emergency", "emergência neurológica"], ["night shifts", "turnos noturnos"], ["open access", "acesso aberto"],
  ["pediatric acute lung injury", "lesão pulmonar aguda pediátrica"], ["pediatric sepsis", "sepse pediátrica"],
  ["physical activity", "atividade física"], ["randomized controlled trial", "ensaio clínico randomizado"], ["recovery days", "dias de recuperação"],
  ["risk stratification", "estratificação de risco"], ["septic shock", "choque séptico"], ["sports performance", "performance esportiva"],
  ["scoping review", "revisão de escopo"], ["sport performance", "performance esportiva"],
  ["supervised machine learning", "aprendizado de máquina supervisionado"], ["systematic review", "revisão sistemática"],
  ["tendon load adaptation", "adaptação do tendão à carga"], ["vestibular disorders", "distúrbios vestibulares"],
]));

export const wordTranslations = Object.freeze({
  accuracy: "acurácia", acute: "agudo", adaptation: "adaptação", adult: "adulto", analysis: "análise",
  analytics: "análise de dados", application: "aplicação", assessment: "avaliação", associated: "associado",
  autonomic: "autonômico", balance: "equilíbrio", biomarker: "biomarcador", biomarkers: "biomarcadores",
  blood: "sangue", body: "corpo", brain: "cérebro", care: "cuidado", cardiac: "cardíaco",
  cardiovascular: "cardiovascular", children: "crianças", clinical: "clínico", cohort: "coorte",
  consensus: "consenso", control: "controle", controlled: "controlado", cortisol: "cortisol", data: "dados",
  diagnosis: "diagnóstico", diagnostic: "diagnóstico", disease: "doença", dizziness: "tontura", early: "precoce",
  emergency: "emergência", exercise: "exercício", failure: "falência", fatigue: "fadiga", fitness: "aptidão",
  frequency: "frequência", health: "saúde", healthcare: "saúde", headache: "cefaleia", headaches: "cefaleias",
  inflammation: "inflamação", injury: "lesão", learning: "aprendizado", load: "carga", migraine: "enxaqueca",
  model: "modelo", mortality: "mortalidade", neural: "neural", nervous: "nervoso",
  neuroplasticity: "neuroplasticidade", nutrition: "nutrição", pain: "dor", patients: "pacientes",
  pediatric: "pediátrico", performance: "performance", physical: "físico", prediction: "predição",
  prognosis: "prognóstico", protein: "proteína", recovery: "recuperação", rehabilitation: "reabilitação",
  response: "resposta", respiratory: "respiratório", review: "revisão", risk: "risco", sepsis: "sepse",
  sleep: "sono", sport: "esporte", strength: "força", stress: "estresse", study: "estudo",
  systematic: "sistemática", target: "meta", targets: "metas", tendon: "tendão", training: "treinamento",
  trial: "ensaio", triage: "triagem", variability: "variabilidade", vertigo: "vertigem", vestibular: "vestibular",
});

export const conceptCatalog = clinicalTopics.map(({ id, labelPtBr, terms }) => ({ id, label: labelPtBr, terms }));

const normalizeClinicalText = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

export function classifyClinicalTopicIds(value) {
  const text = normalizeClinicalText(Array.isArray(value) ? value.join(" ") : value);
  if (!text) return [];
  return clinicalTopics
    .filter((topic) => topic.terms.some((term) => {
      const normalizedTerm = normalizeClinicalText(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(^|[^a-z0-9])${normalizedTerm}([^a-z0-9]|$)`).test(text);
    }))
    .map((topic) => topic.id);
}
