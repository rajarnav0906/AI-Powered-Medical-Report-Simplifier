// services/validationService.js
import { levenshteinDistance } from "../utils/levenshteinDistance.js";
import { correctPhrase } from "../utils/spellCorrect.js";

const SIMILARITY_THRESHOLD = 0.6;

// Synonym map (helps ALT vs Alanine Transaminase, etc.)
const synonymMap = {
  "alanine transaminase": "alt",
  "sgpt": "alt",
  "sgot": "ast",
  "blood sugar": "glucose",
  "sugar": "glucose"
};

export const checkForHallucinations = (rawText, normalizedTests) => {
  console.log("Running validation guardrail...");

  // Apply spell correction
  let correctedRaw = correctPhrase(rawText).toLowerCase();

  // Normalize synonyms in raw text
  Object.entries(synonymMap).forEach(([key, val]) => {
    correctedRaw = correctedRaw.replace(new RegExp(key, "gi"), val);
  });

  const cleanInput = correctedRaw.replace(/[^a-z0-9]/g, "");

  for (const test of normalizedTests) {
    const cleanTestName = test.name.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (cleanInput.length < cleanTestName.length) {
      console.warn(`Validation failed: Input shorter than test "${test.name}".`);
      return false;
    }

    let maxScore = 0;

    for (let i = 0; i <= cleanInput.length - cleanTestName.length; i++) {
      const candidate = cleanInput.substring(i, i + cleanTestName.length);

      const distance = levenshteinDistance(cleanTestName, candidate);
      const similarity = 1 - distance / cleanTestName.length;

      if (similarity > maxScore) maxScore = similarity;
      if (maxScore === 1) break;
    }

    console.log(`Validation for "${test.name}" → similarity score: ${maxScore.toFixed(2)}`);

    if (maxScore < SIMILARITY_THRESHOLD) {
      console.error(
        `Validation failed: "${test.name}" similarity score (${maxScore.toFixed(
          2
        )}) below threshold.`
      );
      return false;
    }
  }

  console.log("Validation passed (no hallucinations detected).");
  return true;
};