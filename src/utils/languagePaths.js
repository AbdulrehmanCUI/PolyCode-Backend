const path = require("path");
const fs = require("fs");
const { DATA_BASE_PATH } = require("../config/constants");

const COURSE_MODULES = new Set([
  "00-certification",
  "01-beginner",
  "02-intermediate",
  "03-advanced",
  "04-professional",
  "05-mastery",
]);

/**
 * Scan only language/data when present; keep API paths as data/...
 */
function resolveLanguagePaths(language) {
  if (language === "all") {
    return { scanPath: DATA_BASE_PATH, relativeBase: DATA_BASE_PATH };
  }

  const langRoot = path.join(DATA_BASE_PATH, language);
  const dataPath = path.join(langRoot, "data");

  if (fs.existsSync(dataPath)) {
    return { scanPath: dataPath, relativeBase: langRoot };
  }

  return { scanPath: langRoot, relativeBase: langRoot };
}

module.exports = {
  COURSE_MODULES,
  resolveLanguagePaths,
};
