import { readdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const entries = [
  "app.js",
  "clinical-taxonomy.js",
  "paper-contract.js",
  "scientific-library-data.js",
  "clinico/app.js",
  "clinico/clinical-flow.js",
  "clinico/clinical-ui.js",
  "clinico/bench.js",
  "clinico/gate.js",
  "dodperoformance.main/ECG",
];

function javascriptFiles(entry) {
  const absoluteEntry = resolve(root, entry);
  if (extname(absoluteEntry) === ".js") return [absoluteEntry];

  return readdirSync(absoluteEntry, { withFileTypes: true }).flatMap((item) => {
    const child = resolve(absoluteEntry, item.name);
    if (item.isDirectory()) return javascriptFiles(child);
    return extname(item.name) === ".js" ? [child] : [];
  });
}

const files = entries.flatMap(javascriptFiles).sort();
for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`Sintaxe válida: ${files.length} arquivos JavaScript publicados.`);
