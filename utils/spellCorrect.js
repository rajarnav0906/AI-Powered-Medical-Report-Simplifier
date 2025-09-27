import nspell from "nspell";
import dictionary from "dictionary-en";

const medicalWhitelist = [
  // General abbreviations
  "WBC", "RBC", "CBC", "Hb", "HCT", "MCV", "MCH", "MCHC", "RDW", "Platelets",
  "ESR", "CRP", "LDH", "PT", "INR", "APTT", "D-Dimer",

  // Kidney function
  "Creatinine", "Urea", "BUN", "eGFR", "Uric", "Albumin",

  // Liver function
  "AST", "ALT", "SGOT", "SGPT", "ALP", "Bilirubin", "Total Protein", "Globulin",

  // Electrolytes
  "Na", "Sodium", "K", "Potassium", "Cl", "Chloride", "Ca", "Calcium",
  "Mg", "Magnesium", "Phosphorus",

  // Lipid profile
  "Cholesterol", "LDL", "HDL", "Triglycerides", "VLDL", "Non-HDL",

  // Glucose / Diabetes
  "Glucose", "FBS", "RBS", "PPBS", "HbA1c", "OGTT", "Insulin",

  // Thyroid
  "TSH", "T3", "T4", "FT3", "FT4",

  // Vitamins & Minerals
  "Vitamin D", "Vitamin B12", "Ferritin", "Iron", "TIBC", "Transferrin",

  // Hormones
  "Cortisol", "Prolactin", "Testosterone", "Estrogen", "Progesterone", "LH", "FSH",

  // Cardiac
  "Troponin", "CKMB", "BNP", "NT-proBNP",

  // Infectious disease
  "HIV", "HBsAg", "HCV", "COVID", "PCR", "RT-PCR", "Dengue", "NS1", "Malaria",

  // Tumor markers
  "CEA", "CA125", "CA19-9", "PSA", "AFP", "Beta-hCG",

  // Immunology
  "ANA", "RF", "IgG", "IgM", "IgA", "IgE",

  // Other
  "Blood Pressure", "Pulse", "SpO2", "ALT", "Alanine Transaminase", "AST", "Metabolic", "Panel"

];

let spellChecker;
try {
  spellChecker = nspell(dictionary);
  console.log("Spell checker loaded with extended medical whitelist.");
} catch (err) {
  console.error("Failed to load dictionary:", err.message);
}

/**
 * Correct a single word if misspelled (unless whitelisted).
 */
export const correctWord = (word) => {
  if (!spellChecker) return word;

  // Don't correct if whitelisted (case-sensitive check)
  if (medicalWhitelist.includes(word)) return word;

  if (spellChecker.correct(word)) return word;

  const suggestions = spellChecker.suggest(word);
  return suggestions.length > 0 ? suggestions[0] : word;
};

/**
 * Correct entire phrase/test name word by word
 */
export const correctPhrase = (phrase) => {
  return phrase
    .split(" ")
    .map((word) => correctWord(word))
    .join(" ");
};