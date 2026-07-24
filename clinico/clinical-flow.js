export const emptyClinicalInput = Object.freeze({
  age: "",
  symptom: "",
  durationDays: "",
  severity: "",
  fever: false,
  dyspnea: false,
  chestPain: false,
  dehydration: false,
  pregnancy: false,
  immunosuppression: false,
});

const signalLabels = Object.freeze({
  fever: "febre",
  dyspnea: "dispneia",
  chestPain: "dor torácica",
  dehydration: "sinais de desidratação",
  pregnancy: "gestação",
  immunosuppression: "imunossupressão",
});

const clinicalSearchAliases = Object.freeze([
  ["dor torácica", "chest pain"],
  ["dor no peito", "chest pain"],
  ["falta de ar", "dyspnea"],
  ["dispneia", "dyspnea"],
  ["dor abdominal", "abdominal pain"],
  ["tosse", "cough"],
  ["febre", "fever"],
  ["desidratação", "dehydration"],
  ["gestação", "pregnancy"],
  ["gravidez", "pregnancy"],
  ["imunossupressão", "immunosuppression"],
  ["náusea", "nausea"],
  ["vômito", "vomiting"],
  ["palpitação", "palpitations"],
]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeClinicalSearchTopic(value) {
  let normalized = String(value || "").trim();
  clinicalSearchAliases.forEach(([ptBr, english]) => {
    normalized = normalized.replace(new RegExp(`\\b${escapeRegExp(ptBr)}\\b`, "gi"), english);
  });
  return normalized.replace(/\s+e\s+/gi, " ").replace(/\s+/g, " ").trim();
}

export function evaluateClinicalInput(input) {
  const age = Number(input.age);
  const duration = Number(input.durationDays);
  const symptom = String(input.symptom || "").trim();
  const missing = [
    !input.age ? "idade" : "",
    !symptom ? "queixa principal" : "",
    !input.durationDays ? "duração" : "",
    !input.severity ? "gravidade percebida" : "",
  ].filter(Boolean);
  const impossible = [
    input.age && (!Number.isFinite(age) || age < 0 || age > 120)
      ? "Idade fora do intervalo aceito neste fluxo (0 a 120 anos)."
      : "",
    input.durationDays && (!Number.isFinite(duration) || duration < 0 || duration > 365)
      ? "Duração fora do intervalo aceito neste fluxo (0 a 365 dias)."
      : "",
  ].filter(Boolean);
  const markedSignals = Object.entries(signalLabels)
    .filter(([field]) => Boolean(input[field]))
    .map(([, label]) => label);
  const redFlags = [
    input.dyspnea ? "dispneia" : "",
    input.chestPain ? "dor torácica" : "",
    input.dehydration ? "sinais de desidratação" : "",
    input.pregnancy ? "gestação" : "",
    input.immunosuppression ? "imunossupressão" : "",
    input.severity === "Intensa" ? "gravidade intensa" : "",
  ].filter(Boolean);

  const hasInvalidData = missing.length > 0 || impossible.length > 0;
  const status = hasInvalidData ? "incomplete" : redFlags.length ? "alert" : "ready";
  const alerts = [
    ...missing.map((item) => `Campo obrigatório pendente: ${item}.`),
    ...impossible,
    ...redFlags.map((item) => `Alerta informado: ${item}.`),
  ];

  return {
    status,
    statusLabel:
      status === "incomplete"
        ? "Caso incompleto"
        : status === "alert"
          ? "Alerta informado"
          : "Estrutura preenchida",
    facts: [
      input.age ? `Idade informada: ${input.age} anos.` : "Idade não informada.",
      symptom ? `Queixa principal: ${symptom}.` : "Queixa principal não informada.",
      input.durationDays ? `Duração informada: ${input.durationDays} dia(s).` : "Duração não informada.",
      input.severity ? `Gravidade percebida: ${input.severity}.` : "Gravidade percebida não informada.",
      markedSignals.length
        ? `Sinais e contextos marcados: ${markedSignals.join(", ")}.`
        : "Nenhum sinal ou contexto adicional marcado.",
    ],
    interpretation:
      status === "incomplete"
        ? "O caso ainda está incompleto ou contém valores inválidos. O módulo não interpreta antes da correção."
        : status === "alert"
          ? "Há sinais de alerta ou contexto de maior risco. Este resultado é somente uma organização acadêmica e requer avaliação profissional."
          : "Nenhum sinal de alerta foi marcado neste fluxo mínimo. Isso não exclui doença relevante nem substitui avaliação clínica.",
    alerts: alerts.length ? alerts : ["Nenhum alerta marcado no formulário mínimo."],
    nextSteps:
      status === "alert"
        ? [
            "Priorizar avaliação profissional conforme o contexto e a evolução do caso.",
            "Usar a queixa para pesquisar evidências no PubMed e conferir os termos MeSH recuperados.",
            "Registrar a fonte consultada sem transformar a pesquisa em diagnóstico ou prescrição.",
          ]
        : [
            "Revisar dados faltantes ou inconsistentes antes de qualquer conclusão.",
            "Usar a queixa para pesquisar evidências no PubMed e conferir os termos MeSH recuperados.",
            "Encaminhar para avaliação clínica real se houver alerta, piora, dúvida ou risco.",
          ],
    limits: [
      "Não conclui diagnóstico.",
      "Não gera dose, receita ou prescrição.",
      "Não salva nome, CPF, telefone, prontuário ou identificadores de pacientes.",
      "A evidência recuperada exige leitura crítica e supervisão qualificada.",
    ],
  };
}
