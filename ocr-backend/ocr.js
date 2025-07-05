// ocr.js

const tesseract = require("node-tesseract-ocr");
const docx = require("docx");
const fs = require("fs");
const path = require("path");

const { Document, Packer, Paragraph, TextRun } = docx;

// This is the main function that index.js will call.
// It takes the path of the uploaded file and where to save the finished docx.
async function performOcrAndConversion(inputPath, originalFilename, processedDir) {
  try {
    console.log(`[OCR] Starting OCR for file: ${inputPath}`);

    // 1. Run Tesseract OCR on the uploaded file.
    const text = await tesseract.recognize(inputPath, {
      lang: "eng",
      oem: 1,
      psm: 3,
    });

    console.log("[OCR] OCR text extracted successfully.");

    // 2. Create a new DOCX document with the extracted text.
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun(text)],
          }),
        ],
      }],
    });

    // 3. Prepare the output file path.
    const outputFilename = `${path.parse(originalFilename).name}.docx`;
    const outputPath = path.join(processedDir, outputFilename);

    // 4. Use Packer to generate the .docx file buffer.
    const buffer = await Packer.toBuffer(doc);
    
    // 5. Save the buffer to the file system.
    fs.writeFileSync(outputPath, buffer);

    console.log(`[OCR] DOCX file created at: ${outputPath}`);

    // 6. Return the full path to the created file. This is crucial.
    return outputPath;

  } catch (error) {
    console.error("Error during OCR or DOCX creation:", error);
    // Throw the error so the main process knows it failed.
    throw new Error("Failed to process the document.");
  }
}

// Export the function so index.js can use it.
module.exports = {
  performOcrAndConversion,
};
