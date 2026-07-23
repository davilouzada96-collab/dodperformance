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

## Eixos canônicos do ECG

A leitura acadêmica do ECG usa uma sequência explícita de oito eixos:

1. `ecg_technical`: qualidade técnica e calibração;
2. `ecg_rate_regularity`: frequência e regularidade;
3. `ecg_rhythm`: ritmo e atividade atrial;
4. `ecg_axis`: eixo elétrico frontal;
5. `ecg_conduction_intervals`: intervalos e condução;
6. `ecg_qrs_morphology`: morfologia e progressão do QRS;
7. `ecg_st_t_injury`: ST, T e repolarização;
8. `ecg_overload_remodeling`: sobrecarga e padrão estrutural.

Qualquer alteração nessa ordem deve atualizar conjuntamente a interface, a
triagem automática experimental e a verificação de arquitetura.
