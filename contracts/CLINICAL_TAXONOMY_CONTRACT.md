# Contrato Oficial de `ClinicalTopic`

`clinical-taxonomy.js` é a única fonte de significado clínico, busca e
tradução do projeto.

```text
ClinicalTopic
├── id: identificador estável
├── labelPtBr: apresentação em português
├── terms[]: termos canônicos em inglês
└── parentId: relação hierárquica opcional
```

O mesmo módulo também publica:

- `ptBrSearchTerms`: pares PT-BR → EN;
- `englishSearchTerms`: termos aceitos pela busca;
- `phraseTranslations` e `wordTranslations`;
- grupos padrão da biblioteca;
- classificação de texto em `clinicalTopicIds`.

Regras obrigatórias:

- Nenhuma interface mantém catálogo ou dicionário clínico próprio.
- Todo ID é único e todo `parentId` resolve para um tópico existente.
- Aliases ambíguos devem ser declarados; não podem mudar de dono silenciosamente.
- Cards e ECG consomem IDs. Labels nunca são chaves de integração.
