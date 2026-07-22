export const PAPER_ORIGINS = new Set(["curated", "pubmed", "openalex", "local"]);

export const PAPER_EVIDENCE_TYPES = new Set([
  "guideline", "systematic-review", "meta-analysis", "review", "trial",
  "article", "preprint", "book", "other",
]);

const cleanText = (value) => String(value || "").trim() || null;

const cleanList = (values) => {
  const items = Array.isArray(values) ? values : values ? [values] : [];
  return [...new Set(items.map(cleanText).filter(Boolean))];
};

const finiteOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const cleanDoi = (value) => {
  const doi = cleanText(value);
  return doi?.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "") || null;
};

function buildPaperId({ id, doi, pmid, origin, title }) {
  if (cleanText(id)) return cleanText(id);
  if (doi) return `doi:${doi.toLowerCase()}`;
  if (pmid) return `pmid:${pmid}`;
  return `${origin}:${(title || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

export function createPaper(input) {
  const origin = PAPER_ORIGINS.has(input.origin) ? input.origin : "local";
  const doi = cleanDoi(input.doi);
  const pmid = cleanText(input.pmid)?.replace(/^https?:\/\/pubmed\.ncbi\.nlm\.nih\.gov\//i, "").replace(/\//g, "") || null;
  const title = cleanText(input.title) || "Título não identificado";
  const rawYear = finiteOrNull(input.year);

  return {
    id: buildPaperId({ id: input.id, doi, pmid, origin, title }),
    origin,
    source: cleanText(input.source) || "Fonte não identificada",
    sourceUrl: cleanText(input.sourceUrl),
    title,
    authors: cleanList(input.authors),
    year: Number.isInteger(rawYear) ? rawYear : null,
    journal: cleanText(input.journal),
    publisher: cleanText(input.publisher),
    doi,
    pmid,
    citations: finiteOrNull(input.citations),
    isOpenAccess: typeof input.isOpenAccess === "boolean" ? input.isOpenAccess : null,
    abstract: cleanText(input.abstract),
    meshTerms: cleanList(input.meshTerms),
    evidenceType: PAPER_EVIDENCE_TYPES.has(input.evidenceType) ? input.evidenceType : null,
    clinicalTopicIds: cleanList(input.clinicalTopicIds),
    score: finiteOrNull(input.score),
    searchRelevance: finiteOrNull(input.searchRelevance),
    editorial: input.editorial || null,
  };
}

export const paperAuthorsText = (paper) => (paper.authors || []).join(", ");

export function paperSourceUrl(paper) {
  if (paper.sourceUrl) return paper.sourceUrl;
  if (paper.pmid) return `https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`;
  if (paper.doi) return `https://doi.org/${paper.doi}`;
  return "#";
}
