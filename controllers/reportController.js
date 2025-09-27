import { extractTextFromImage } from "../services/ocrService.js";
import { getNormalizedTests, getSimplifiedSummary } from "../services/aiService.js";
import { checkForHallucinations } from "../services/validationService.js";
import { correctPhrase } from "../utils/spellCorrect.js";


export const simplifyReport = async (req, res) => {
  try {
    let reportText = "";

    // 1 -> Handle input
    if (req.file) {
      console.log("OCR: Processing uploaded file...");
      const buffer = req.file.buffer;
      reportText = await extractTextFromImage(buffer);
    } else if (req.body.text) {
      console.log("Using provided text...");
      reportText = req.body.text;
    } else {
      return res.status(400).json({ error: "Provide either a file or text input." });
    }

    if (!reportText || reportText.trim().length === 0) {
      return res.status(400).json({ error: "OCR/text extraction returned empty content." });
    }

    // 2 -> Normalize with Gemini
    const normalized = await getNormalizedTests(reportText);

    if (!normalized || normalized.length === 0) {
      return res.status(200).json({
        tests: [],
        summary: "No recognizable medical test data found in input.",
        status: "ok",
      });
    }

    // 3 -> Auto-correct spelling in test names
    const correctedTests = normalized.map((test) => ({
      ...test,
      name: correctPhrase(test.name),
    }));

    // 4 -> Validate hallucinations
    const validOutput = checkForHallucinations(reportText, correctedTests);
    if (!validOutput) {
      return res.status(400).json({
        status: "unprocessed",
        reason: "Invalid AI output detected: hallucinated tests not found in original input.",
      });
    }

    // 5 -> Summarize with Gemini
    const summary = await getSimplifiedSummary(correctedTests);

    res.status(200).json({
      tests: correctedTests,
      summary,
      status: "ok",
    });
  } catch (err) {
    console.error("Error in simplifyReport:", err.message);
    res.status(500).json({ error: "Server error while simplifying report." });
  }
};
