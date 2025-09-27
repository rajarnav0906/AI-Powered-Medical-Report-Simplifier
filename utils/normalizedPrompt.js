// utils/normalizedPrompt.js
export const getNormalizationPrompt = (rawText) => {
  return `
You are a medical data normalizer. 

The following text is extracted from a medical report and may contain typos or OCR errors:
"""
${rawText}
"""

👉 Your tasks:
1. Correct typos in test names (e.g., "Hemglobin" → "Hemoglobin").
2. Extract ONLY medical tests (no other text).
3. Identify test values, units, and status (Low / Normal / High).
4. If a reference range is missing, insert a typical adult reference range.
5. If you cannot find any valid test, return an empty array [].

⚠️ Output rules (STRICT):
- Respond with ONLY valid JSON.
- JSON must be an **array** of objects.
- Use this schema exactly:
[
  {
    "name": "string",
    "value": number,
    "unit": "string",
    "status": "string",
    "ref_range": { "low": number, "high": number }
  }
]

Example:
[
  {
    "name": "Hemoglobin",
    "value": 10.2,
    "unit": "g/dL",
    "status": "Low",
    "ref_range": { "low": 13.5, "high": 17.5 }
  }
]

Now return the structured JSON for the provided text. Nothing else.
  `;
};
