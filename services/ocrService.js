// services/ocrService.js
import Tesseract from "tesseract.js";
import sharp from "sharp";

export const getTextFromImage = async (imageBuffer) => {
  try {
    console.log("🖼️ Starting image pre-processing with sharp...");

    const processedImageBuffer = await sharp(imageBuffer)
      .resize(1500)   // Upscale for better OCR accuracy
      .grayscale()
      .normalize()
      .sharpen()
      .toBuffer();

    console.log("✅ Image pre-processing complete. Starting OCR...");

    const result = await Tesseract.recognize(
      processedImageBuffer,
      "eng",
      { logger: (m) => console.log(m) }
    );

    console.log("✅ OCR process completed.");
    console.log("🔎 OCR Raw Text:", result.data.text);

    return result.data.text;
  } catch (error) {
    console.error("❌ Error during OCR processing:", error);
    throw new Error("Failed to extract text from image.");
  }
};
