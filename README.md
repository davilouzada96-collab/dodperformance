# DOD Performance

Plataforma modular da DOD Performance para biblioteca científica, operações clínicas e expansão de novos módulos. A raiz do projeto funciona como hub principal do sistema, conectando as áreas especializadas sem romper a base existente.[cite:2][cite:3]

## Estrutura

```text
dodperformance/
├── .github/workflows/
├── assets/
├── biblioteca/
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── output_data_1779051008.json
├── clinico/
│   ├── index.html
│   ├── bench.css
│   ├── clinico-gate.js
│   ├── wrangler.toml
│   └── README_DEPLOY.md
├── index.html
├── README.md
└── _headers
```

## Organização do sistema

- `index.html` na raiz: hub principal da plataforma DOD Performance.[cite:2][cite:25]
- `biblioteca/`: núcleo da biblioteca científica, com interface, motor de busca, filtros, síntese e exportações.[cite:8]
- `clinico/`: módulo clínico independente, com interface própria e gate de autenticação separado.[cite:8][cite:3]

## Regras de arquitetura

- A raiz organiza e conecta o sistema; não substitui os módulos especializados.[cite:2]
- `biblioteca/` permanece como base principal da biblioteca científica.[cite:8][cite:12]
- `clinico/` evolui de forma isolada, sem interferir na base dos cards ou no fluxo principal da biblioteca.[cite:3][cite:11]
- Novos módulos entram ao lado da base, seguindo o mesmo padrão modular.[cite:2]

## Repositórios

A arquitetura atual conversa com dois repositórios com funções diferentes:[cite:36]

- `dodperformance--main`: base privada da biblioteca científica DOD.[cite:36]
- `dodperformance`: repositório público do site, workers e funções edge em produção.[cite:36]
