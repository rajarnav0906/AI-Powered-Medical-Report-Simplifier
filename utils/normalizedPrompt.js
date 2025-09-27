export const getNormalizationPrompt = (rawText) => {
  return `
The following text was extracted from a scanned or handwritten medical report. 
It may contain spelling mistakes, OCR errors, or inconsistent formatting. 

👉 Your task:
1. Correct typos in test names (e.g., "Gucose" → "Glucose").
2. Identify test values, units, and status (Low/Normal/High).
3. If reference ranges are missing, use common adult reference ranges.
4. If nothing useful is found, return an empty array [].

⚠️ Output format (strict JSON only, nothing else):
[
  {
    "name": "string",
    "value": number,
    "unit": "string",
    "status": "string",
    "ref_range": { "low": number, "high": number }
  }
]

Extract from this text:
"""${rawText}"""
  `;
};