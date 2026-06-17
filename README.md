# DOD Performance

Site, biblioteca científica e módulos clínicos da DOD PERFORMANCE — dodperformance.com.br.[cite:7][cite:8]

## Estrutura

Repositório organizado por módulos, mantendo a base principal estável e cada tópico com seu próprio trabalho.[cite:2][cite:3]

```text
dodperformance/
├── .github/workflows/
├── assets/
├── biblioteca/
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── output_data_*.json
├── clinico/
│   ├── index.html
│   ├── bench.css
│   ├── clinico-gate.js
│   ├── wrangler.toml
│   └── README_DEPLOY.md
├── README.md
└── _headers
```

## Módulos

- `biblioteca/` — DOD Performance Library (dodperformance.main): interface e motor da biblioteca científica (busca, cards, síntese, exportações).[file:13][file:14]  
- `clinico/` — módulo clínico independente (dodperformance.clinico): bancada clínica + gate de acesso via Worker, sem interferir nos cards da base.[cite:3][cite:8]

## Regras de integração

- A base (`biblioteca/`) não é alterada por novos módulos.[cite:3]  
- `clinico/` (e futuros módulos como `rx/`) entram como pastas e rotas próprias, ao lado da base, nunca por dentro dela.[cite:2][cite:11]  
- Toda mudança deve ser cirúrgica, preservando o último deploy estável.[cite:3]
