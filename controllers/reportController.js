import { getNormalizedTests, getSimplifiedSummary } from "../services/aiService.js";
import { getTextFromImage } from "../services/ocrService.js";
import { checkForHallucinations } from "../services/validationService.js";
import { refRanges } from "../utils/refRanges.js";

export const simplifyReport = async (req, res) => {
  try {
    let rawText = "";
    let testsRaw = [];

    if (req.file) {
      console.log("Processing uploaded file...");
      const imageBuffer = req.file.buffer;
      rawText = await getTextFromImage(imageBuffer);
    } else if (req.body.text) {
      console.log("Processing raw text from request body...");
      rawText = req.body.text;
    } else {
      return res.status(400).json({ error: "File or Text input is required." });
    }

    if (!rawText || rawText.trim() === "") {
      return res.status(400).json({ error: "Extracted text is empty. Cannot process." });
    }

    // Step 1: Collect raw extracted lines for debugging
    testsRaw = rawText.split("\n").map((line) => line.trim()).filter((l) => l);

    // Step 2: Normalize with Gemini
    const normalized = await getNormalizedTests(rawText);

    // Step 2.5: Add fallback reference ranges if missing
    const normalizedWithRanges = normalized.map((t) => {
      const hasRange = t.ref_range && t.ref_range.low != null && t.ref_range.high != null;
      if (hasRange) return t;
      const fallback = refRanges[t.name] || null;
      return { ...t, ref_range: fallback };
    });

    if (normalizedWithRanges.length === 0) {
      return res.status(200).json({
        tests_raw: testsRaw,
        tests: [],
        summary: "No recognizable medical test data found in input.",
        status: "ok",
      });
    }

    // Step 3: Guardrail validation
    const isValid = checkForHallucinations(rawText, normalizedWithRanges);
    if (!isValid) {
      return res.status(400).json({
        status: "unprocessed",
        reason: "Invalid AI output detected: hallucinated tests not found in original input.",
      });
    }

    // Step 4: Generate patient-friendly summary
    const summary = await getSimplifiedSummary(normalizedWithRanges);

    // Final structured response
    const finalResponse = {
      tests_raw: testsRaw,
      tests: normalizedWithRanges,
      summary,
      status: "ok",
    };

    res.status(200).json(finalResponse);
  } catch (error) {
    console.error("Error in simplifyReport controller:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};
