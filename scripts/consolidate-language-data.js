#!/usr/bin/env node
/**
 * Consolidate language data folders to match JavaScript layout:
 *   data/00-certification … data/05-mastery only
 *
 * Legacy folders move to {Language}/_archive/ (not served by API).
 * Valuable markdown is merged into numbered lessons first.
 *
 * Usage:
 *   node scripts/consolidate-language-data.js
 *   node scripts/consolidate-language-data.js --lang Python
 *   node scripts/consolidate-language-data.js --dry-run
 */

const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const { COURSE_MODULES } = require("../src/utils/languagePaths");

const DATA_ROOT = path.join(__dirname, "../data");
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LANG_FILTER = args.includes("--lang")
  ? args[args.indexOf("--lang") + 1]
  : null;
const SKIP_JS = !args.includes("--include-javascript");

/** Legacy path → course lesson (relative to data/) */
const MERGE_MAP = {
  Python: [
    ["tutorials/01) IO Statements.md", "01-beginner/03-hello-world.md"],
    ["tutorials/02) Conditional Statements.md", "01-beginner/05-control-flow-and-loops.md"],
    ["tutorials/03) Repetitive Statements.md", "01-beginner/05-control-flow-and-loops.md", "append"],
    ["tutorials/04) Functions.md", "01-beginner/06-functions-basics.md"],
    ["learning_curriculum/level0_absolute_beginner.md", "01-beginner/01-introduction.md", "append"],
    ["learning_curriculum/level1_python_fundamentals.md", "01-beginner/02-python-basics.md", "append"],
    ["intermediate/decorators.md", "03-advanced/01-decorators.md"],
    ["intermediate/generators.md", "03-advanced/02-generators.md"],
    ["intermediate/context-managers.md", "03-advanced/03-context-managers.md"],
    ["projects/README.md", "05-mastery/03-capstone-projects.md", "append"],
  ],
  Java: [
    ["tutorials/01) IO Statements.md", "01-beginner/03-hello-world.md"],
    ["tutorials/02) Conditional Statements.md", "01-beginner/05-control-flow-and-loops.md"],
    ["tutorials/04) Functions.md", "01-beginner/06-methods-basics.md"],
    ["learning_curriculum/level0_absolute_beginner.md", "01-beginner/01-introduction.md", "append"],
    ["learning_curriculum/level1_java_fundamentals.md", "01-beginner/02-java-basics.md", "append"],
    ["intermediate/collections.md", "02-intermediate/03-collections.md"],
    ["intermediate/exceptions.md", "02-intermediate/04-exceptions.md"],
    ["intermediate/oops.md", "02-intermediate/01-oop-inheritance.md", "append"],
  ],
  Go: [
    ["_archive/lessons/01-introduction.md", "01-beginner/01-introduction.md"],
    ["_archive/lessons/02-variables-and-types.md", "01-beginner/04-variables-and-types.md"],
    ["_archive/lessons/03-control-flow.md", "01-beginner/05-control-flow.md"],
    ["_archive/lessons/04-functions.md", "01-beginner/06-functions.md"],
    ["_archive/lessons/05-collections.md", "01-beginner/07-arrays-and-slices.md"],
    ["_archive/lessons/06-structs-and-interfaces.md", "01-beginner/09-structs.md"],
    ["_archive/lessons/07-error-handling.md", "02-intermediate/03-error-handling.md"],
    ["_archive/lessons/08-concurrency-goroutines.md", "02-intermediate/04-goroutines.md"],
    ["_archive/lessons/11-testing.md", "02-intermediate/06-testing.md"],
    ["lessons/01-introduction.md", "01-beginner/01-introduction.md"],
    ["lessons/02-variables.md", "01-beginner/04-variables-and-types.md"],
    ["lessons/03-control-flow.md", "01-beginner/05-control-flow.md"],
    ["lessons/04-functions.md", "01-beginner/06-functions.md"],
    ["lessons/05-arrays-slices.md", "01-beginner/07-arrays-and-slices.md"],
    ["lessons/06-structs.md", "01-beginner/09-structs.md"],
    ["lessons/07-interfaces.md", "02-intermediate/02-interfaces.md"],
    ["lessons/08-error-handling.md", "02-intermediate/03-error-handling.md"],
    ["lessons/09-concurrency.md", "02-intermediate/04-goroutines.md", "append"],
    ["lessons/10-testing.md", "02-intermediate/06-testing.md"],
  ],
  PHP: [
    ["docs/01-basics.md", "01-beginner/02-php-basics.md", "append"],
    ["01-basics/variables-data-types.php", "01-beginner/04-variables-and-types.md", "append-code"],
  ],
  Ruby: [
    ["docs/01-introduction.md", "01-beginner/01-introduction.md"],
    ["docs/02-basic-syntax.md", "01-beginner/02-ruby-basics.md"],
    ["docs/03-variables.md", "01-beginner/04-variables-and-types.md"],
    ["docs/04-control-structures.md", "01-beginner/05-control-flow.md"],
    ["docs/05-methods.md", "01-beginner/06-methods.md"],
    ["docs/06-classes.md", "02-intermediate/01-classes.md"],
  ],
  Rust: [
    ["getting started/README.md", "01-beginner/01-introduction.md", "append"],
    ["ownership/README.md", "01-beginner/07-ownership.md", "append"],
    ["basics/README.md", "01-beginner/02-rust-basics.md", "append"],
  ],
  "C++": [
    ["01-Getting-Started/Overview.md", "01-beginner/01-introduction.md", "append"],
    ["02-Basics/Basics/introduction.md", "01-beginner/02-cpp-basics.md", "append"],
  ],
  C: [
    ["Basics/introduction.md", "01-beginner/01-introduction.md", "append"],
    ["getting_started/README.md", "01-beginner/02-c-basics.md", "append"],
  ],
  "C#": [
    ["Level-1-Foundations/01-variables.md", "01-beginner/04-variables-and-types.md", "append"],
    ["GETTING-STARTED.md", "01-beginner/01-introduction.md", "append"],
  ],
};

const JUNK_NAMES = new Set([
  "temp",
  "izaan temp",
  ".git",
  "node_modules",
  "__pycache__",
]);

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function writeText(filePath, content) {
  if (DRY_RUN) return;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function mergeLesson(targetPath, sourcePath, mode = "replace") {
  if (!fs.existsSync(sourcePath)) return false;

  const source = readText(sourcePath).trim();
  if (!source) return false;

  const target = fs.existsSync(targetPath) ? readText(targetPath).trim() : "";

  if (mode === "append" || mode === "append-code") {
    if (target.includes(source.slice(0, 80))) return false;
    const header =
      mode === "append-code"
        ? `\n\n---\n\n## Reference code\n\n\`\`\`\n${source}\n\`\`\`\n`
        : `\n\n---\n\n## Additional reference\n\n${source}\n`;
    writeText(targetPath, target + header);
    return true;
  }

  // replace if source is richer
  if (source.length > target.length + 200 || target.length < 400) {
    const titleMatch = target.match(/^#.+$/m);
    const header = titleMatch ? `${titleMatch[0]}\n\n` : "";
    const moduleLine = target.match(/^\*\*Module .+\*\*$/m);
    const prefix = moduleLine ? `${header}${moduleLine[0]}\n\n` : header;
    writeText(targetPath, prefix + source.replace(/^#.*\n+/, ""));
    return true;
  }

  return false;
}

function applyMerges(lang, dataDir) {
  const maps = MERGE_MAP[lang] || [];
  let merged = 0;

  for (const entry of maps) {
    const [from, to, mode = "replace"] = entry;
    const sourcePath = path.join(dataDir, from);
    const targetPath = path.join(dataDir, to);
    if (mergeLesson(targetPath, sourcePath, mode)) merged++;
  }

  return merged;
}

function migrateQuantumTopics(dataDir) {
  const basicDir = path.join(dataDir, "01-basic");
  if (!fs.existsSync(basicDir)) return 0;

  const beginnerDir = path.join(dataDir, "01-beginner");
  fs.mkdirSync(beginnerDir, { recursive: true });

  const topics = fs
    .readdirSync(basicDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  let count = 0;
  topics.forEach((topic, index) => {
    const readme = path.join(basicDir, topic, "README.md");
    if (!fs.existsSync(readme)) return;

    const num = String(index + 1).padStart(2, "0");
    const slug = topic.replace(/^\d+-/, "");
    const target = path.join(beginnerDir, `${num}-${slug}.md`);
    if (!fs.existsSync(target) || readText(target).length < readText(readme).length) {
      const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      writeText(
        target,
        `# Lesson ${num} — ${title}\n\n**Module 01 · Beginner · Lesson ${num} of ${String(topics.length).padStart(2, "0")}**\n\n${readText(readme).replace(/^#.*\n+/, "")}`,
      );
      count++;
    }
  });

  return count;
}

function migrateQSharpIntro(dataDir) {
  const introDir = path.join(dataDir, "01-introduction");
  if (!fs.existsSync(introDir)) return 0;

  const beginnerDir = path.join(dataDir, "01-beginner");
  fs.mkdirSync(beginnerDir, { recursive: true });

  const lessons = fs
    .readdirSync(introDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  let count = 0;
  lessons.forEach((file, index) => {
    const num = String(index + 1).padStart(2, "0");
    const slug = file.replace(/^\d+-/, "").replace(/\.md$/, "");
    const target = path.join(beginnerDir, `${num}-${slug}.md`);
    const source = path.join(introDir, file);
    if (!fs.existsSync(target)) {
      writeText(target, readText(source));
      count++;
    }
  });

  return count;
}

function moveToArchive(src, archiveRoot) {
  const name = path.basename(src);
  if (JUNK_NAMES.has(name)) {
    if (!DRY_RUN) fs.rmSync(src, { recursive: true, force: true });
    return "deleted";
  }

  const dest = path.join(archiveRoot, name);
  if (fs.existsSync(dest)) {
    const stamped = `${name}-${Date.now()}`;
    const altDest = path.join(archiveRoot, stamped);
    if (!DRY_RUN) {
      try {
        fse.moveSync(src, altDest, { overwrite: true });
      } catch {
        fse.copySync(src, altDest, { overwrite: true });
        fse.removeSync(src);
      }
    }
    return `archived:${stamped}`;
  }

  if (!DRY_RUN) {
    fs.mkdirSync(archiveRoot, { recursive: true });
    try {
      fse.moveSync(src, dest, { overwrite: true });
    } catch {
      fse.copySync(src, dest, { overwrite: true });
      fse.removeSync(src);
    }
  }
  return `archived:${name}`;
}

function consolidateLanguage(lang) {
  const langRoot = path.join(DATA_ROOT, lang);
  const dataDir = path.join(langRoot, "data");
  const archiveRoot = path.join(langRoot, "_archive");

  if (!fs.existsSync(dataDir)) {
    console.warn(`  skip — no data folder`);
    return { merged: 0, archived: 0, deleted: 0 };
  }

  let merged = applyMerges(lang, dataDir);

  if (lang === "Quantum") merged += migrateQuantumTopics(dataDir);
  if (lang === "Q#") merged += migrateQSharpIntro(dataDir);

  let archived = 0;
  let deleted = 0;

  const entries = fs.readdirSync(dataDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "README.md") continue;
    if (COURSE_MODULES.has(entry.name)) continue;

    const fullPath = path.join(dataDir, entry.name);
    const result = moveToArchive(fullPath, archiveRoot);
    if (result.startsWith("deleted")) deleted++;
    else archived++;
  }

  const ROOT_LEGACY = [
    "docs",
    "scripts",
    "projects",
    "resources",
    "examples",
    "explainPython",
    "explainGO",
    "explainPHP",
    "explainRUST",
    "explainC",
  ];
  for (const name of ROOT_LEGACY) {
    const legacyPath = path.join(langRoot, name);
    if (!fs.existsSync(legacyPath)) continue;
    const result = moveToArchive(legacyPath, archiveRoot);
    if (result.startsWith("deleted")) deleted++;
    else archived++;
  }

  // Language root README
  const rootReadme = path.join(langRoot, "README.md");
  if (!fs.existsSync(rootReadme)) {
    writeText(
      rootReadme,
      `# PolyCode ${lang} Course\n\nOpen **[data/README.md](data/README.md)** and start with **00-certification / Course roadmap**.\n\nLegacy content is preserved in \`_archive/\`.\n`,
    );
  }

  return { merged, archived, deleted };
}

function main() {
  const languages = fs
    .readdirSync(DATA_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => d.name)
    .filter((name) => {
      if (LANG_FILTER) return name === LANG_FILTER;
      if (SKIP_JS && name === "JavaScript") return false;
      return true;
    });

  console.log(
    `Consolidating ${languages.length} language(s)${DRY_RUN ? " (dry run)" : ""}...\n`,
  );

  let totalArchived = 0;
  let totalMerged = 0;
  let totalDeleted = 0;

  for (const lang of languages) {
    const { merged, archived, deleted } = consolidateLanguage(lang);
    console.log(
      `${lang}: merged ${merged}, archived ${archived}, deleted ${deleted}`,
    );
    totalMerged += merged;
    totalArchived += archived;
    totalDeleted += deleted;
  }

  console.log(
    `\nDone. Merged: ${totalMerged}, archived: ${totalArchived}, deleted junk: ${totalDeleted}`,
  );
  if (!DRY_RUN) {
    console.log(
      "\nRestart the backend to clear the document cache (or wait 5 minutes).",
    );
  }
}

main();
