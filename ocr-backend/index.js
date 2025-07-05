const express = require('express');
const multer = require('multer');
const tesseract = require('node-tesseract-ocr');
const cors = require('cors');
const docx = require('docx');
const { Packer } = docx;

// Node.js built-in modules for handling files and running commands
const fs = require('fs/promises');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.status(200).send('JKM Edit OCR to DOCX Backend is running!');
});

app.post('/api/ocr', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file was uploaded.' });
  }

  // Create a unique name for temporary files to avoid conflicts
  const tempId = Date.now() + '-' + Math.random().toString(36).substring(7);
  const tempDir = path.join(__dirname, 'tmp');
  const pdfPath = path.join(tempDir, `${tempId}.pdf`);
  const imagePrefix = path.join(tempDir, `${tempId}-page`);
  
  try {
    console.log(`Processing file: ${req.file.originalname}`);
    
    // --- Step 1: Save the uploaded PDF to a temporary file ---
    await fs.mkdir(tempDir, { recursive: true }); // Ensure temp directory exists
    await fs.writeFile(pdfPath, req.file.buffer);
    console.log(`Temporary PDF saved to ${pdfPath}`);

    // --- Step 2: Convert PDF to PNG images using poppler-utils ---
    // The command is `pdftoppm -png <pdf_file> <image_prefix>`
    const convertCommand = `pdftoppm -png "${pdfPath}" "${imagePrefix}"`;
    await exec(convertCommand);
    console.log("PDF successfully converted to images.");

    // --- Step 3: Find all the generated images and run OCR on them ---
    const files = await fs.readdir(tempDir);
    const imageFiles = files
      .filter(f => f.startsWith(`${tempId}-page`) && f.endsWith('.png'))
      .sort(); // Sort to ensure pages are in the correct order

    if (imageFiles.length === 0) {
      throw new Error('PDF could not be converted into images.');
    }

    let fullText = '';
    const ocrConfig = { lang: 'eng', oem: 1, psm: 3 };

    for (const imageFile of imageFiles) {
      const imagePath = path.join(tempDir, imageFile);
      const text = await tesseract.recognize(imagePath, ocrConfig);
      fullText += text + '\n\n'; // Add a page break between pages
      console.log(`OCR complete for ${imageFile}`);
    }

    // --- Step 4: Create the Word document ---
    const doc = new docx.Document({
        sections: [{ children: [new docx.Paragraph({ children: [new docx.TextRun(fullText)] })] }],
    });
    const buffer = await Packer.toBuffer(doc);
    const originalName = req.file.originalname;
    const docxFileName = originalName.substring(0, originalName.lastIndexOf('.')) + '.docx';
    
    // --- Step 5: Send the final Word document to the user ---
    res.setHeader('Content-Disposition', `attachment; filename="${docxFileName}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.status(200).send(buffer);
    console.log(`Successfully sent ${docxFileName} to the user.`);

  } catch (error) {
    console.error('An error occurred during the conversion process:', error);
    res.status(500).json({ error: 'The server could not process the file. It might be corrupted or an empty PDF.' });
  } finally {
    // --- Step 6: Clean up all temporary files (PDF and images) ---
    console.log("Cleaning up temporary files...");
    fs.unlink(pdfPath).catch(err => console.error(`Failed to delete temp PDF: ${err.message}`));
    const files = await fs.readdir(tempDir);
    for(const file of files) {
        if(file.startsWith(tempId)) {
            fs.unlink(path.join(tempDir, file)).catch(err => console.error(`Failed to delete temp image: ${err.message}`));
        }
    }
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
