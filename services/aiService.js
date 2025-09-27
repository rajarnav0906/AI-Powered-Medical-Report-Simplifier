import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getNormalizationPrompt } from "../utils/normalizedPrompt.js";
import { buildSimplificationPrompt } from "../utils/simplifiedPrompt.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Retry wrapper for Gemini calls with exponential backoff.
 * Handles transient errors gracefully.
 */
const callGeminiWithRetry = async (model, prompt, maxRetries = 3) => {
  let lastError = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response;
    } catch (err) {
      lastError = err;
      if (
        err.message.includes("503 Service Unavailable") ||
        err.message.includes("500 Internal Server Error")
      ) {
        const wait = Math.pow(2, attempt) * 1000;
        console.warn(`Gemini call failed (attempt ${attempt + 1}). Retrying in ${wait / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, wait));
      } else {
        throw err;
      }
    }
  }

  throw new Error(
    `Gemini API failed after ${maxRetries} retries. Last error: ${lastError?.message}`
  );
};

/**
 * Step 1: Normalize extracted raw text into structured medical tests.
 */
export const getNormalizedTests = async (rawText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = getNormalizationPrompt(rawText);
    const response = await callGeminiWithRetry(model, prompt);

    const parsed = JSON.parse(response.text());

    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.tests)) return parsed.tests;

    return [];
  } catch (err) {
    console.error("Error in getNormalizedTests:", err.message);
    return [];
  }
};

/**
 * Step 2: Generate a patient-friendly summary & explanations.
 */
export const getSimplifiedSummary = async (testsJson) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = buildSimplificationPrompt(testsJson);

    const response = await callGeminiWithRetry(model, prompt);
    return response.text();
  } catch (err) {
    console.error("Error in getSimplifiedSummary:", err.message);
    throw new Error("Gemini summarization failed.");
  }
};