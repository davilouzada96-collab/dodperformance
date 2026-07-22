export const researchCategories = [
  { id: "all", label: "Tudo" },
  { id: "neuro", label: "Neuro" },
  { id: "physio", label: "Physio" },
  { id: "sport", label: "Sport" },
  { id: "health", label: "Homeostase" }
];

export const researchCards = [
  {
    id: "action-potential",
    clinicalTopicIds: ["action_potential"],
    category: "neuro",
    accent: "#6d5bd0",
    mark: "Na+",
    title: "Sinapse, Rede e Foco",
    summary: "A dinamica eletrica da excitacao neuronal como base biologica de atencao e controle.",
    tags: ["neuro", "science", "DOD"],
    mesh: {
      term: "Action Potentials",
      uri: "https://id.nlm.nih.gov/mesh/D000953",
      tree: "G11.561.200"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/12991237/",
    citation: "Hodgkin AL, Huxley AF. A quantitative description of membrane current and its application to conduction and excitation in nerve.",
    body: [
      "Potenciais de acao conectam canais ionicos, limiar, periodo refratario e propagacao do sinal neural.",
      "Na leitura DOD, foco e tratado como estado de excitabilidade e estabilidade de rede, nao apenas como vontade.",
      "Aplicacao: organizar treino cognitivo e motor com controle de fadiga, ruido e demanda atencional."
    ]
  },
  {
    id: "neural-plasticity",
    clinicalTopicIds: ["neuroplasticity"],
    category: "neuro",
    accent: "#376a8f",
    mark: "LTP",
    title: "Plasticidade Neural",
    summary: "Adaptacao sinaptica e reorganizacao de circuitos como base para aprendizagem e recuperacao.",
    tags: ["neuro", "plasticidade", "DOD"],
    mesh: {
      term: "Neuronal Plasticity",
      uri: "https://id.nlm.nih.gov/mesh/D009474",
      tree: "G11.561.600"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/34795459/",
    citation: "Neural plasticity and disease. PubMed indexed review.",
    body: [
      "Plasticidade permite que o sistema nervoso ajuste conexoes conforme estimulo, erro e repeticao.",
      "Nem toda repeticao melhora: o sinal precisa ser especifico, dosado e recuperavel.",
      "Aplicacao: progressao tecnica com feedback curto e reavaliacao frequente."
    ]
  },
  {
    id: "homeostasis",
    clinicalTopicIds: ["homeostasis"],
    category: "physio",
    accent: "#2f6f59",
    mark: "HRV",
    title: "Homeostase e Carga Interna",
    summary: "Equilibrio fisiologico como referencia para decidir treino, pausa e recuperacao.",
    tags: ["physio", "homeostase", "DOD"],
    mesh: {
      term: "Homeostasis",
      uri: "https://id.nlm.nih.gov/mesh/D006706",
      tree: "G07.345.500"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/30068720/",
    citation: "Homeostasis and allostasis of cortisol. PubMed indexed article.",
    body: [
      "Homeostase descreve a manutencao de variaveis internas dentro de faixas funcionais.",
      "Carga interna alta sem recuperacao suficiente reduz adaptacao e aumenta erro decisorio.",
      "Aplicacao: cruzar sono, estresse, dor, prontidao e resposta ao treino antes de subir carga."
    ]
  },
  {
    id: "autonomic-recovery",
    clinicalTopicIds: ["autonomic_variability", "recovery_rehabilitation"],
    category: "physio",
    accent: "#60a5fa",
    mark: "ANS",
    title: "Recuperacao Autonomica",
    summary: "Sistema nervoso autonomo como marcador pratico de fadiga e prontidao.",
    tags: ["physio", "recuperacao", "DOD"],
    mesh: {
      term: "Autonomic Nervous System",
      uri: "https://id.nlm.nih.gov/mesh/D001342",
      tree: "A08.800.050"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/34130793/",
    citation: "Autonomic regulation and recovery. PubMed indexed article.",
    body: [
      "Resposta autonomica ajuda a interpretar se o organismo esta pronto para intensidade ou precisa consolidar recuperacao.",
      "Marcadores isolados sao frageis; o valor esta na tendencia e no contexto.",
      "Aplicacao: ajustar volume, intensidade e densidade da sessao conforme resposta semanal."
    ]
  },
  {
    id: "training-specificity",
    clinicalTopicIds: ["sports_performance"],
    category: "sport",
    accent: "#b87633",
    mark: "VO2",
    title: "Especificidade do Treino",
    summary: "Adaptacoes neuromusculares e cardiorrespiratorias dependem da tarefa treinada.",
    tags: ["sport", "performance", "DOD"],
    mesh: {
      term: "Sports",
      uri: "https://id.nlm.nih.gov/mesh/D013177",
      tree: "I03.450.642.845"
    },
    source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10244991/",
    citation: "Training specificity for athletes. PMC article.",
    body: [
      "O treino precisa transferir para a demanda real: gesto, velocidade, energia, contexto e decisao.",
      "Forca geral importa, mas precisa se conectar com tecnica e timing.",
      "Aplicacao: periodizar blocos que aproximam capacidade fisica e execucao esportiva."
    ]
  },
  {
    id: "sleep-recovery",
    clinicalTopicIds: ["sleep_circadian", "recovery_rehabilitation"],
    category: "health",
    accent: "#394150",
    mark: "Zz",
    title: "Sono e Recuperacao",
    summary: "Sono como base de plasticidade, controle hormonal, reparo e desempenho sustentado.",
    tags: ["health", "sono", "DOD"],
    mesh: {
      term: "Sleep",
      uri: "https://id.nlm.nih.gov/mesh/D012890",
      tree: "F02.830.855"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/22055988/",
    citation: "Sleep and synaptic homeostasis. PubMed indexed article.",
    body: [
      "Sono organiza recuperacao neural e fisiologica, influenciando atencao, dor, apetite e adaptacao.",
      "Pouco sono transforma treino adequado em estresse mal absorvido.",
      "Aplicacao: tratar horario, regularidade e rotina pre-sono como parte do plano de performance."
    ]
  },
  {
    id: "motor-learning",
    clinicalTopicIds: ["motor_control_learning"],
    category: "neuro",
    accent: "#7c5f3f",
    mark: "REP",
    title: "Aprendizagem Motora",
    summary: "Repeticao, erro e feedback como motores da aquisicao tecnica.",
    tags: ["neuro", "motor", "DOD"],
    mesh: {
      term: "Motor Skills",
      uri: "https://id.nlm.nih.gov/mesh/D009048",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/21764294/",
    citation: "Krakauer JW, Mazzoni P. Human sensorimotor learning: adaptation, skill, and beyond.",
    body: [
      "Aprender movimento envolve calibrar previsao, erro sensorial e escolha de estrategia.",
      "Variabilidade bem dosada ajuda o sistema nervoso a encontrar solucoes mais robustas.",
      "Aplicacao: alternar pratica tecnica, feedback e restricoes para melhorar transferencia."
    ]
  },
  {
    id: "motor-cortex",
    clinicalTopicIds: ["motor_control_learning"],
    category: "neuro",
    accent: "#536a9f",
    mark: "M1",
    title: "Cortex Motor e Controle",
    summary: "Planejamento e execucao motora dependem da integracao entre cortex, corpo e contexto.",
    tags: ["neuro", "controle", "DOD"],
    mesh: {
      term: "Motor Cortex",
      uri: "https://id.nlm.nih.gov/mesh/D009044",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/40277091/",
    citation: "Corticospinal tract development, evolution, and skilled movements. PubMed indexed review.",
    body: [
      "Controle motor nao e comando isolado: envolve vias descendentes, feedback e preparacao postural.",
      "A qualidade do gesto depende de estabilidade, timing e selecao de unidade motora.",
      "Aplicacao: construir exercicios que aproximam intencao, precisao e ambiente real."
    ]
  },
  {
    id: "proprioception",
    clinicalTopicIds: ["proprioception_balance"],
    category: "physio",
    accent: "#3f7b6a",
    mark: "POS",
    title: "Propriocepcao",
    summary: "Sensibilidade corporal orienta posicao, forca, equilibrio e controle articular.",
    tags: ["physio", "controle", "DOD"],
    mesh: {
      term: "Proprioception",
      uri: "https://id.nlm.nih.gov/mesh/D011433",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/23073629/",
    citation: "Proske U, Gandevia SC. The proprioceptive senses: their roles in signaling body shape, body position and movement.",
    body: [
      "Propriocepcao conecta receptores musculares e articulares com ajustes motores em tempo real.",
      "Deficit proprioceptivo aumenta erro tecnico e pode reduzir confianca no movimento.",
      "Aplicacao: usar tarefas de equilibrio, controle lento e perturbacao progressiva."
    ]
  },
  {
    id: "pain",
    clinicalTopicIds: ["pain"],
    category: "health",
    accent: "#8f4f4f",
    mark: "NRS",
    title: "Dor e Interpretacao",
    summary: "Dor e experiencia sensorial e emocional, modulada por tecido, contexto e sistema nervoso.",
    tags: ["health", "dor", "DOD"],
    mesh: {
      term: "Pain",
      uri: "https://id.nlm.nih.gov/mesh/D010146",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/32694387/",
    citation: "Raja SN, et al. The revised International Association for the Study of Pain definition of pain.",
    body: [
      "Dor nao mede dano de forma linear; ela emerge de sinal biologico, ameaca percebida e historico.",
      "Treino eficiente respeita sintomas sem transformar todo desconforto em proibicao.",
      "Aplicacao: monitorar dor, funcao, irritabilidade e resposta nas 24 a 48 horas seguintes."
    ]
  },
  {
    id: "inflammation",
    clinicalTopicIds: ["inflammation"],
    category: "physio",
    accent: "#9f5c4a",
    mark: "IL",
    title: "Inflamacao e Adaptacao",
    summary: "Resposta inflamatoria participa de reparo, defesa e sinalizacao adaptativa.",
    tags: ["physio", "recuperacao", "DOD"],
    mesh: {
      term: "Inflammation",
      uri: "https://id.nlm.nih.gov/mesh/D007249",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/27909225/",
    citation: "Peake JM, Neubauer O, Walsh NP, Simpson RJ. Recovery of the immune system after exercise.",
    body: [
      "Inflamacao aguda pode fazer parte da adaptacao ao treino e do reparo tecidual.",
      "O problema aparece quando carga, sono, nutricao e estresse mantem o organismo sem resolver a resposta.",
      "Aplicacao: ajustar densidade de treino quando sinais sistemicos e locais acumulam."
    ]
  },
  {
    id: "muscle-strength",
    clinicalTopicIds: ["strength_power"],
    category: "sport",
    accent: "#7f6231",
    mark: "1RM",
    title: "Forca Muscular",
    summary: "Forca combina arquitetura muscular, drive neural, tecnica e tolerancia a carga.",
    tags: ["sport", "forca", "DOD"],
    mesh: {
      term: "Muscle Strength",
      uri: "https://id.nlm.nih.gov/mesh/D018482",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/26838985/",
    citation: "Suchomel TJ, Nimphius S, Stone MH. The importance of muscular strength in athletic performance.",
    body: [
      "Forca sustenta potencia, resistencia de alta intensidade e margem de seguranca mecanica.",
      "Ganhar forca exige progressao, tecnica e recuperacao suficiente para consolidar adaptacao.",
      "Aplicacao: dosar intensidade, volume e velocidade conforme objetivo e fase do atleta."
    ]
  },
  {
    id: "muscle-fatigue",
    clinicalTopicIds: ["fatigue"],
    category: "physio",
    accent: "#6f6f42",
    mark: "FAD",
    title: "Fadiga Neuromuscular",
    summary: "Queda de desempenho por fatores centrais, perifericos e perceptivos.",
    tags: ["physio", "fadiga", "DOD"],
    mesh: {
      term: "Muscle Fatigue",
      uri: "https://id.nlm.nih.gov/mesh/D053609",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/16371465/",
    citation: "Enoka RM, Duchateau J. Muscle fatigue: what, why and how it influences muscle function.",
    body: [
      "Fadiga altera producao de forca, coordenacao, percepcao de esforco e qualidade tecnica.",
      "Ela nao e sempre inimiga: pode ser estimulo quando planejada e recuperavel.",
      "Aplicacao: separar fadiga desejada de fadiga que degrada aprendizagem ou aumenta risco."
    ]
  },
  {
    id: "aerobic-capacity",
    clinicalTopicIds: ["aerobic_capacity", "cardiovascular"],
    category: "sport",
    accent: "#3f6f8f",
    mark: "O2",
    title: "Capacidade Aerobia",
    summary: "Entrega e uso de oxigenio sustentam resistencia, recuperacao entre esforcos e saude metabolica.",
    tags: ["sport", "cardio", "DOD"],
    mesh: {
      term: "Oxygen Consumption",
      uri: "https://id.nlm.nih.gov/mesh/D010100",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/15233597/",
    citation: "Bassett DR, Howley ET. Limiting factors for maximum oxygen uptake and determinants of endurance performance.",
    body: [
      "VO2 e desempenho de endurance dependem de coracao, pulmao, sangue, musculo e economia de movimento.",
      "Melhorar aerobio tambem melhora recuperacao entre series, rounds e sessoes.",
      "Aplicacao: combinar zonas, intervalos e contexto esportivo sem perder especificidade."
    ]
  },
  {
    id: "heart-rate-variability",
    clinicalTopicIds: ["autonomic_variability"],
    category: "physio",
    accent: "#4b7897",
    mark: "HRV",
    title: "Variabilidade da Frequencia Cardiaca",
    summary: "HRV ajuda a estimar regulacao autonomica, estresse e prontidao quando lida em tendencia.",
    tags: ["physio", "monitoramento", "DOD"],
    mesh: {
      term: "Heart Rate",
      uri: "https://id.nlm.nih.gov/mesh/D006339",
      tree: "Descriptor"
    },
    source: "https://doi.org/10.1007/s40279-013-0071-8",
    citation: "Plews DJ, Laursen PB, Stanley J, Kilding AE, Buchheit M. Training adaptation and heart rate variability in elite endurance athletes.",
    body: [
      "HRV isolada pode enganar; a leitura melhora quando comparada com sono, carga e sintomas.",
      "Quedas persistentes podem indicar estresse acumulado ou baixa recuperacao.",
      "Aplicacao: usar media semanal e contexto antes de reduzir ou subir carga."
    ]
  },
  {
    id: "cortisol-stress",
    clinicalTopicIds: ["stress_cortisol"],
    category: "health",
    accent: "#6a536f",
    mark: "HPA",
    title: "Estresse e Cortisol",
    summary: "Eixo HPA conecta ameaca, energia, ritmo diario e resposta ao treinamento.",
    tags: ["health", "stress", "DOD"],
    mesh: {
      term: "Hydrocortisone",
      uri: "https://id.nlm.nih.gov/mesh/D006854",
      tree: "Descriptor"
    },
    source: "https://doi.org/10.1038/s41574-019-0228-0",
    citation: "Russell G, Lightman S. The human stress response.",
    body: [
      "Cortisol participa de mobilizacao energetica, inflamacao e ritmo circadiano.",
      "Estresse cronico pode reduzir tolerancia a carga e baguncar sono, dor e recuperacao.",
      "Aplicacao: interpretar performance junto com rotina, pressao psicologica e sinais corporais."
    ]
  },
  {
    id: "circadian-rhythm",
    clinicalTopicIds: ["sleep_circadian"],
    category: "health",
    accent: "#3e4f75",
    mark: "24h",
    title: "Ritmo Circadiano",
    summary: "Relogios biologicos organizam sono, temperatura, hormonios e desempenho ao longo do dia.",
    tags: ["health", "sono", "DOD"],
    mesh: {
      term: "Circadian Rhythm",
      uri: "https://id.nlm.nih.gov/mesh/D002940",
      tree: "Descriptor"
    },
    source: "https://doi.org/10.1007/s40279-017-0741-z",
    citation: "Vitale JA, Weydahl A. Chronotype, physical activity, and sport performance.",
    body: [
      "Horario de treino, luz, sono e alimentacao modulam prontidao fisiologica.",
      "Desalinhamento circadiano pode piorar recuperacao e percepcao de esforco.",
      "Aplicacao: organizar rotina de luz, regularidade e horarios-chave antes de culpar o treino."
    ]
  },
  {
    id: "nutrition-recovery",
    clinicalTopicIds: ["nutrition", "recovery_rehabilitation"],
    category: "health",
    accent: "#64723f",
    mark: "PRO",
    title: "Nutricao e Recuperacao",
    summary: "Energia, proteina e micronutrientes sustentam reparo, adaptacao e disponibilidade para treinar.",
    tags: ["health", "nutricao", "DOD"],
    mesh: {
      term: "Nutritional Physiological Phenomena",
      uri: "https://id.nlm.nih.gov/mesh/D009747",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/26891166/",
    citation: "Thomas DT, Erdman KA, Burke LM. Nutrition and athletic performance.",
    body: [
      "Deficit energetico persistente reduz adaptacao, humor, imunidade e capacidade de recuperar.",
      "Proteina e carboidrato precisam conversar com tipo de treino, horario e objetivo.",
      "Aplicacao: checar disponibilidade energetica antes de aumentar volume ou intensidade."
    ]
  },
  {
    id: "tendon-adaptation",
    clinicalTopicIds: ["load_adaptation", "muscle_tendon_injury"],
    category: "physio",
    accent: "#7a704a",
    mark: "TEN",
    title: "Tendao e Carga",
    summary: "Tendao adapta lentamente e responde bem a carga progressiva, especifica e toleravel.",
    tags: ["physio", "tendao", "DOD"],
    mesh: {
      term: "Tendons",
      uri: "https://id.nlm.nih.gov/mesh/D013710",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/27747846/",
    citation: "Bohm S, Mersmann F, Arampatzis A. Human tendon adaptation in response to mechanical loading.",
    body: [
      "Tendao precisa de estimulo mecanico, mas costuma tolerar pior mudancas bruscas de volume e intensidade.",
      "Dor tendinea deve ser lida com funcao, rigidez matinal e resposta pos-treino.",
      "Aplicacao: progredir carga isometrica, lenta e elastica conforme tolerancia."
    ]
  },
  {
    id: "balance-posture",
    clinicalTopicIds: ["proprioception_balance"],
    category: "physio",
    accent: "#4f6f63",
    mark: "BAL",
    title: "Equilibrio e Postura",
    summary: "Controle postural integra visao, vestibular, propriocepcao e estrategias motoras.",
    tags: ["physio", "equilibrio", "DOD"],
    mesh: {
      term: "Postural Balance",
      uri: "https://id.nlm.nih.gov/mesh/D015650",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/11731573/",
    citation: "Horak FB. Postural orientation and equilibrium: what do we need to know about neural control of balance?",
    body: [
      "Equilibrio e uma resposta ativa, nao uma posicao congelada.",
      "O sistema escolhe estrategias diferentes conforme base de suporte, velocidade e ameaca.",
      "Aplicacao: treinar estabilidade em tarefas que progridem de previsiveis para reativas."
    ]
  },
  {
    id: "reaction-time",
    clinicalTopicIds: ["reaction_time"],
    category: "sport",
    accent: "#5c5f8f",
    mark: "RT",
    title: "Tempo de Reacao",
    summary: "Perceber, decidir e executar rapido depende de atencao, antecipacao e preparo motor.",
    tags: ["sport", "neuro", "DOD"],
    mesh: {
      term: "Reaction Time",
      uri: "https://id.nlm.nih.gov/mesh/D011930",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/16095739/",
    citation: "Williams AM, Ericsson KA. Perceptual-cognitive expertise in sport: some considerations when applying the expert performance approach.",
    body: [
      "Tempo de reacao esportivo envolve leitura de pistas, selecao de resposta e execucao.",
      "Especialistas muitas vezes parecem mais rapidos porque antecipam melhor.",
      "Aplicacao: treinar decisao com sinais relevantes do esporte, nao apenas estimulos genericos."
    ]
  },
  {
    id: "executive-function",
    clinicalTopicIds: ["executive_function"],
    category: "neuro",
    accent: "#624f86",
    mark: "EF",
    title: "Funcao Executiva",
    summary: "Inibicao, memoria de trabalho e flexibilidade cognitiva orientam decisao sob pressao.",
    tags: ["neuro", "decisao", "DOD"],
    mesh: {
      term: "Executive Function",
      uri: "https://id.nlm.nih.gov/mesh/D056344",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/23020641/",
    citation: "Diamond A. Executive functions.",
    body: [
      "Funcao executiva ajuda a escolher acao, inibir impulso e mudar estrategia quando o contexto muda.",
      "Fadiga, sono ruim e estresse reduzem qualidade decisoria.",
      "Aplicacao: inserir tarefas cognitivas quando a tecnica base ja sustenta a demanda."
    ]
  },
  {
    id: "breathing",
    clinicalTopicIds: ["breathing"],
    category: "physio",
    accent: "#4f7f8c",
    mark: "CO2",
    title: "Respiracao e Controle",
    summary: "Ventilacao regula troca gasosa, percepcao de esforco e estabilidade do tronco.",
    tags: ["physio", "respiracao", "DOD"],
    mesh: {
      term: "Respiration",
      uri: "https://id.nlm.nih.gov/mesh/D012119",
      tree: "Descriptor"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/22125308/",
    citation: "Amann M. Pulmonary system limitations to endurance exercise performance in humans.",
    body: [
      "Respiracao influencia quimica sanguinea, percepcao de intensidade e tolerancia ao exercicio.",
      "Em esforco alto, musculatura respiratoria tambem disputa recursos com membros ativos.",
      "Aplicacao: treinar ritmo respiratorio, exposicao progressiva e controle sob carga."
    ]
  },
  {
    id: "emergency-response",
    clinicalTopicIds: ["emergency_care", "cardiovascular"],
    category: "health",
    accent: "#dc2626",
    mark: "SOS",
    title: "Emergencia e Resposta Aguda",
    summary: "Ativacao simpatica coordena resposta de sobrevivencia: cardiovascular, hormonal e neuromuscular.",
    tags: ["health", "emergencia", "DOD"],
    mesh: {
      term: "Emergencies",
      uri: "https://pubmed.ncbi.nlm.nih.gov/?term=%22Emergencies%22%5BMeSH%5D",
      tree: "D004630"
    },
    source: "https://pubmed.ncbi.nlm.nih.gov/39893019/",
    citation: "Solorzano GE. Initial Management of Neuromuscular Emergencies. Med Clin North Am. 2025;109(2):389-399. doi: 10.1016/j.mcna.2024.09.007.",
    body: [
      "Descarga adrenergica eleva frequencia cardiaca, redistribui fluxo sanguineo e mobiliza glicose de forma imediata.",
      "Na leitura DOD, emergencia revela o limite real do sistema como ponto de calibragem para treino de alta intensidade.",
      "Aplicacao: simular esforcos maximos em contexto controlado para treinar a resposta aguda sem risco real."
    ]
  }
];
