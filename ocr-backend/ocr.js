// ocr.js - Version 3 with PDF-to-Image Conversion

const tesseract = require("node-tesseract-ocr");
const docx = require("docx");
const fs = require("fs").promises; // Use promise-based fs for async/await
const path = require("path");
const poppler = require("pdf-poppler");

const { Document, Packer, Paragraph, TextRun } = docx;

async function performOcrAndConversion(inputPath, originalFilename, processedDir) {
  const fileExtension = path.extname(originalFilename).toLowerCase();
  let imagePaths = [];
  let ocrText = "";

  try {
    if (fileExtension === ".pdf") {
      // --- PDF Processing ---
      console.log("[PDF] PDF file detected. Converting to images...");
      const outputPrefix = path.join(path.dirname(inputPath), path.basename(inputPath, fileExtension));
      
      let opts = {
        format: 'png', // Output format
        out_dir: path.dirname(inputPath), // Output directory
        out_prefix: path.basename(outputPrefix), // Output file prefix
        page: null // Convert all pages
      }

      await poppler.convert(inputPath, opts);
      console.log("[PDF] PDF converted to images successfully.");
      
      // Find all the generated images
      const files = await fs.readdir(path.dirname(inputPath));
      imagePaths = files
        .filter(file => file.startsWith(path.basename(outputPrefix)) && file.endsWith('.png'))
        .map(file => path.join(path.dirname(inputPath), file))
        .sort(); // Sort to keep page order

    } else {
      // --- Image Processing ---
      console.log("[Image] Image file detected.");
      imagePaths.push(inputPath);
    }

    // --- OCR on all images (whether from PDF or a single image upload) ---
    console.log(`[OCR] Processing ${imagePaths.length} image(s)...`);
    for (const imagePath of imagePaths) {
      const text = await tesseract.recognize(imagePath, {
        lang: "eng", oem: 1, psm: 3,
      });
      ocrText += text + "\n\n"; // Add text from each page, with a separator
    }
    console.log("[OCR] All images processed.");

    // --- Create DOCX ---
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
    for (const imagePath of imagePaths) {
      // Don't delete the original if it was an image upload
      if (imagePath !== inputPath) { 
        try {
          await fs.unlink(imagePath);
          console.log(`[Cleanup] Deleted temp image: ${imagePath}`);
        } catch (cleanupError) {
          console.error(`[Cleanup] Failed to delete temp file ${imagePath}:`, cleanupError);
        }
      }
    }
  }
}

module.exports = { performOcrAndConversion };
