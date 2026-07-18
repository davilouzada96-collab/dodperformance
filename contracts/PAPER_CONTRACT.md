# Contrato Oficial de `Paper`

`Paper` é o formato único de evidência consumido por renderização, filtros,
leitor, síntese e exportação. Formatos brutos de PubMed, OpenAlex, JSON local e
cards curados passam por normalizadores.

```text
Paper
├── identidade: id, origin, source, sourceUrl
├── publicação: title, authors[], year, journal, publisher, doi, pmid
├── evidência: citations, isOpenAccess, abstract, meshTerms, evidenceType
├── clínica: clinicalTopicIds[]
├── derivados: score, searchRelevance
└── editorial DOD: displayTitle, displaySummary, readerText, referenceText,
    cardCode e visual
```

Regras obrigatórias:

- Ausência é `null` ou lista vazia; não é uma frase de substituição.
- DOI e PMID são identificadores; `sourceUrl` é o link verificável.
- Texto editorial não substitui título, autoria ou resumo bibliográfico.
- `category` visual e `tags` não substituem `clinicalTopicIds`.
- Dados de ECG, medidas, diagnóstico, conduta e prescrição ficam fora de
  `Paper`.
- Dados derivados podem ser descartados e recalculados.

Implementação normativa: `paper-contract.js`.
