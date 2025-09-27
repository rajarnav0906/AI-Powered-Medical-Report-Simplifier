import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const runTest = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Say hello in one sentence.");
    console.log("Gemini response:", result.response.text());
  } catch (err) {
    console.error("Gemini API test failed:", err.message);
  }
};

runTest();
