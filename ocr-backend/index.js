const express = require('express');
const multer = require('multer');
const tesseract = require('node-tesseract-ocr');
const cors = require('cors');
const docx = require('docx');
const { Packer } = docx;

const app = express();
const port = process.env.PORT || 3000;

// Use CORS to allow requests from any origin.
app.use(cors());

// Configure multer for file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// Health check route
app.get('/', (req, res) => {
  res.status(200).send('JKM Edit OCR to DOCX Backend is running!');
});

// The main API endpoint that does the conversion
app.post('/api/ocr', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file was uploaded.' });
  }

  console.log(`Processing file: ${req.file.originalname}, size: ${req.file.size} bytes`);

  try {
    // 1. Perform OCR to get the text from the uploaded file
    const config = { lang: 'eng', oem: 1, psm: 3 };
    const text = await tesseract.recognize(req.file.buffer, config);
    console.log("OCR successful. Extracted text.");

    // 2. Create a new Word document using the extracted text
    const doc = new docx.Document({
        sections: [{
            children: [
                new docx.Paragraph({
                    children: [new docx.TextRun(text)],
                }),
            ],
        }],
    });
    console.log("Word document created in memory.");

    // 3. Convert the in-memory document to a buffer (raw file data)
    const buffer = await Packer.toBuffer(doc);

    // 4. Create a filename for the download
    const originalName = req.file.originalname;
    const docxFileName = originalName.substring(0, originalName.lastIndexOf('.')) + '.docx';

    // 5. Set the correct headers to tell the browser to download the file
    res.setHeader('Content-Disposition', `attachment; filename="${docxFileName}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    
    // 6. Send the Word file back to the user
    res.status(200).send(buffer);
    console.log(`Successfully sent ${docxFileName} to the user.`);

  } catch (error) {
    console.error('An error occurred during the conversion process:', error);
    res.status(500).json({ error: 'The server could not process the file. It might be corrupted or in an unsupported format.' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
