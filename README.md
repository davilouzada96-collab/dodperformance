# DOD Performance

Plataforma pública da DOD Performance para estudo e apoio acadêmico. O conteúdo científico não substitui avaliação, diagnóstico ou conduta de profissional habilitado.

## Estrutura publicada

```text
dodperformance/
├── index.html                         # Biblioteca científica DOD
├── app.js                             # Interface, filtros e leitura dos cards
├── scientific-library-data.js         # Fonte única dos cards PubMed/MeSH
├── clinical-taxonomy.js               # Taxonomia clínica canônica
├── paper-contract.js                  # Contrato único dos artigos
├── styles.css
├── favicon.svg
├── clinico/                           # Área acadêmica canônica
└── dodperoformance.main/ECG/          # Leitura estruturada de ECG
```

A página inicial é a única dona da biblioteca científica. O módulo ECG mantém apenas as funções de leitura, interpretação e nota clínica.

## Processo de qualidade e deploy

Use `npm run validate` antes de abrir um pull request. O comando verifica a sintaxe, os contratos clínicos, a arquitetura, monta o diretório `public/` e valida os imports e recursos do pacote final.

### Desenvolvimento local

```bash
npm install
npm run dev
```

O servidor local usa Wrangler, refaz o pacote `public/` quando os arquivos-fonte
mudam e atualiza o navegador automaticamente. Por padrão, ele fica disponível
em `http://localhost:8787`.

O mesmo comando roda no workflow `.github/workflows/deploy-cloudflare-pages.yml`. Pull requests apenas validam; a branch `main` publica no Cloudflare Pages o mesmo artefato aprovado pelo job de validação.

O build publica somente os arquivos estáticos necessários. Cópias históricas, documentação de operação e o código do Worker clínico não entram no pacote do site.

A área acadêmica opera em modo local. Os arquivos `clinico/clinico-gate.js` e
`clinico/wrangler.toml` são legados e não devem ser implantados; o estado e os
pré-requisitos para uma futura autenticação remota estão registrados em
`clinico/README_DEPLOY.md`.
