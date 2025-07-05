// ocr.js - Version 4 with pdf2pic for reliable PDF conversion

const tesseract = require("node-tesseract-ocr");
const docx = require("docx");
const fs = require("fs").promises; // Use promise-based fs for async/await
const path = require("path");
const { fromPath } = require("pdf2pic"); // <-- Import the new package

const { Document, Packer, Paragraph, TextRun } = docx;

async function performOcrAndConversion(inputPath, originalFilename, processedDir) {
  const fileExtension = path.extname(originalFilename).toLowerCase();
  let imagePathsToProcess = [];
  // We need to keep track of temporary files we create for cleanup.
  let tempFilesToDelete = [];

  try {
    if (fileExtension === ".pdf") {
      // --- NEW PDF Processing with pdf2pic ---
      console.log("[PDF] PDF file detected. Converting to images with pdf2pic...");
      
      const options = {
        density: 300, // DPI, higher is better quality
        saveFilename: `${Date.now()}_page`, // A unique name for each page
        savePath: path.dirname(inputPath), // Save images in the same 'uploads' folder
        format: "png",
        width: 1200, // Set a good resolution for OCR
        height: 1600
      };

      // `fromPath` creates a converter instance.
      const convert = fromPath(inputPath, options);
      // This will convert all pages and return an array of image data.
      const resolvedImages = await convert.bulk(-1, { responseType: "image" });

      if (!resolvedImages || resolvedImages.length === 0) {
        throw new Error("PDF conversion produced no images.");
      }
      
      console.log(`[PDF] Converted to ${resolvedImages.length} image(s) successfully.`);
      
      // The `path` property on each result is what we need for Tesseract.
      imagePathsToProcess = resolvedImages.map(img => img.path);
      // All these new images are temporary and should be deleted later.
      tempFilesToDelete = [...imagePathsToProcess];

    } else {
      // --- Image Processing (No change here) ---
      console.log("[Image] Image file detected.");
      // The uploaded image is the one we process. It's not temporary.
      imagePathsToProcess.push(inputPath);
    }

    // --- OCR on all images ---
    let ocrText = "";
    console.log(`[OCR] Processing ${imagePathsToProcess.length} image(s)...`);
    for (const imagePath of imagePathsToProcess) {
      const text = await tesseract.recognize(imagePath, {
        lang: "eng", oem: 1, psm: 3,
      });
      ocrText += text + "\n\n";
    }
    console.log("[OCR] All images processed.");

    // --- Create DOCX (No change here) ---
    const textParagraphs = ocrText.split(/\n\s*\n/).filter(p => p.trim() !== '');
    const docxParagraphs = textParagraphs.map(p => new Paragraph({ children: [new TextRun(p.trim())] }));
    const doc = new Document({ sections: [{ children: docxParagraphs }] });
    const outputFilename = `${path.parse(originalFilename).name}.docx`;
    const outputPath = path.join(processedDir, outputFilename);
    const buffer = await Packer.toBuffer(doc);
    await fs.writeFile(outputPath, buffer);
    console.log(`[DOCX] File created at: ${outputPath}`);
    
    return outputPath;

  } catch (error) {
    console.error("Error during conversion:", error);
    throw new Error("Failed to process the document.");
  } finally {
    // --- Cleanup: Delete temporary images ---
    console.log(`[Cleanup] Deleting ${tempFilesToDelete.length} temporary files.`);
    for (const tempPath of tempFilesToDelete) {
      try {
        await fs.unlink(tempPath);
      } catch (cleanupError) {
        console.error(`[Cleanup] Failed to delete temp file ${tempPath}:`, cleanupError);
      }
    }
  }
}

module.exports = { performOcrAndConversion };
