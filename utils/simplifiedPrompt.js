/**
 * Build the prompt for Gemini to simplify normalized medical test results
 * into a patient-friendly explanation.
 *
 * @param {Array} testsJson - Normalized medical test data
 * @returns {string} - AI prompt string
 */
export const buildSimplificationPrompt = (testsJson) => {
  return `
  You are a supportive medical assistant.
  Translate the following JSON test results into a simple, friendly summary for the patient.

  Strict rules:
  1. DO NOT provide or imply a diagnosis.
  2. If every test is marked "normal", reassure the patient with a short, positive message.
  3. For each result marked "low" or "high":
     - State the result clearly.
     - Briefly explain, in plain language, what that test measures.
  4. Always conclude by suggesting the patient consult their doctor for full interpretation.
  5. The entire explanation must be a single continuous paragraph of text.

  Test Results JSON:
  ${JSON.stringify(testsJson)}
  `;
};
