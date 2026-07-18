import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  clinicalTopics,
  clinicalTopicsById,
  defaultLibraryGroups,
  englishSearchTerms,
  phraseTranslations,
  ptBrSearchTerms,
  searchTermPairs,
  wordTranslations,
} from "../clinical-taxonomy.js";
import { createPaper, paperSourceUrl } from "../paper-contract.js";
import { researchCards } from "../scientific-library-data.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const appFiles = ["app.js", "clinico/app.js", "dodperoformance.main/clinico/app.js"];

assert.equal(new Set(clinicalTopics.map((topic) => topic.id)).size, clinicalTopics.length, "ClinicalTopic.id duplicado");
clinicalTopics.forEach((topic) => {
  assert.ok(topic.id && topic.labelPtBr && topic.terms.length, `tópico inválido: ${topic.id}`);
  if (topic.parentId) assert.ok(clinicalTopicsById.has(topic.parentId), `parentId órfão: ${topic.id}`);
});
defaultLibraryGroups.forEach((group) => group.topicIds.forEach((id) => {
  assert.ok(clinicalTopicsById.has(id), `grupo ${group.id} referencia ${id} inexistente`);
}));

assert.equal(searchTermPairs.length, 132, "cobertura PT-BR/EN alterada");
assert.equal(Object.keys(ptBrSearchTerms).length, 132, "alias PT-BR duplicado ou ausente");
assert.equal(englishSearchTerms.length, 79, "cobertura de busca em inglês alterada");
assert.equal(Object.keys(phraseTranslations).length, 51, "cobertura de frases alterada");
assert.equal(Object.keys(wordTranslations).length, 83, "cobertura de palavras alterada");

for (const file of appFiles) {
  const source = readFileSync(resolve(root, file), "utf8");
  for (const declaration of ["ptBrSearchTerms", "englishSearchTerms", "ptBrPhraseTranslations", "ptBrWordTranslations", "ptBrConceptCatalog"]) {
    assert.ok(!source.includes(`const ${declaration}`), `${file} recriou ${declaration}`);
  }
  assert.ok(source.includes("clinical-taxonomy.js"), `${file} não consome a taxonomia`);
  assert.ok(source.includes("paper-contract.js"), `${file} não consome o contrato Paper`);
}

assert.equal(researchCards.length, 24, "quantidade de cards curados alterada");
researchCards.forEach((card) => {
  assert.ok(card.clinicalTopicIds?.length, `card sem clinicalTopicIds: ${card.id}`);
  card.clinicalTopicIds.forEach((id) => assert.ok(clinicalTopicsById.has(id), `card ${card.id} referencia ${id} inexistente`));
});
const sample = createPaper({ origin: "curated", id: researchCards[0].id, title: researchCards[0].title, sourceUrl: researchCards[0].source });
assert.equal(sample.year, null);
assert.deepEqual(sample.authors, []);
assert.equal(paperSourceUrl(sample), researchCards[0].source);

const expectedEcgTopicIds = [
  "ecg_measurements",
  "ecg_rhythm",
  "ecg_conduction_intervals",
  "ecg_st_t_injury",
  "ecg_overload_remodeling",
  "ecg_ectopy_rate",
];
const ecgHtml = readFileSync(resolve(root, "dodperoformance.main/ECG/index.html"), "utf8");
const ecgSignal = readFileSync(resolve(root, "dodperoformance.main/ECG/ecg-signal.js"), "utf8");
const ecgHtmlTopicIds = [...ecgHtml.matchAll(/data-axis="(ecg_[^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(ecgHtmlTopicIds, expectedEcgTopicIds, "eixos ECG do HTML divergiram do contrato");
expectedEcgTopicIds.forEach((id) => {
  assert.ok(clinicalTopicsById.has(id), `eixo ECG sem ClinicalTopic: ${id}`);
  assert.ok(ecgSignal.includes(`${id}:`), `análise ECG não produz o eixo ${id}`);
});

function verifyRelativeImports(entryFile) {
  const source = readFileSync(entryFile, "utf8");
  const imports = [...source.matchAll(/from\s+["'](\.[^"']+)["']/g)].map((match) => match[1].split("?")[0]);
  imports.forEach((specifier) => {
    const target = resolve(dirname(entryFile), specifier);
    assert.ok(existsSync(target), `import ausente: ${entryFile} -> ${specifier}`);
  });
}

if (process.argv.includes("--public")) {
  ["public/app.js", "public/clinico/app.js", "public/dodperoformance.main/ECG/workbench.js"]
    .map((file) => resolve(root, file))
    .forEach(verifyRelativeImports);
  assert.ok(!existsSync(resolve(root, "public/dodperoformance.main/clinico")), "rota clínica histórica ainda foi publicada");
}

console.log(`Arquitetura válida: ${clinicalTopics.length} tópicos, ${researchCards.length} cards, cobertura 132/51/83.`);
