# DOD Performance

Plataforma pública da DOD Performance para estudo e apoio acadêmico. O conteúdo científico não substitui avaliação, diagnóstico ou conduta de profissional habilitado.

## Estrutura publicada

```text
dodperformance/
├── index.html                         # Biblioteca científica DOD
├── app.js                             # Interface, filtros e leitura dos cards
├── scientific-library-data.js         # Fonte única dos cards PubMed/MeSH
├── styles.css
├── favicon.svg
└── dodperoformance.main/
    ├── ECG/                           # Leitura estruturada de ECG
    └── clinico/                       # Área acadêmica
```

A página inicial é a única dona da biblioteca científica. O módulo ECG mantém apenas as funções de leitura, interpretação e nota clínica.

## Deploy

O script `scripts/prepare-public.sh` monta o pacote publicado. Ele é usado tanto pelo preview do Wrangler quanto pelo workflow `.github/workflows/deploy-cloudflare-pages.yml`, evitando divergência entre teste e produção. O deploy de produção ocorre a partir da branch `main`.

Os diretórios históricos mantidos no repositório não fazem parte do pacote publicado.
