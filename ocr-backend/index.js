const express = require('express');
const multer = require('multer');
const tesseract = require('node-tesseract-ocr');
const cors = require('cors');
const docx = require('docx'); // <-- Import the new library
const { Packer } = docx;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Configure multer for file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// Health check route
app.get('/', (req, res) => {
  res.status(200).send('OCR to DOCX Backend is running!');
});

// This is the endpoint your frontend will call
app.post('/api/ocr', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  console.log(`Processing file: ${req.file.originalname}`);

  try {
    // 1. Perform OCR to get the text from the PDF/image
    const config = { lang: 'eng', oem: 1, psm: 3 };
    const text = await tesseract.recognize(req.file.buffer, config);
    console.log("OCR successful. Text extracted.");

    // 2. Create a new Word document using the 'docx' library
    const doc = new docx.Document({
        sections: [{
            properties: {},
            children: [
                new docx.Paragraph({
                    children: [new docx.TextRun(text)],
                }),
            ],
        }],
    });
    console.log("Word document created in memory.");

    // 3. Prepare the file to be sent to the user
    const buffer = await Packer.toBuffer(doc);
    const originalName = req.file.originalname;
    const docxFileName = originalName.substring(0, originalName.lastIndexOf('.')) + '.docx';

    // 4. Set the correct headers to trigger a file download
    res.setHeader('Content-Disposition', `attachment; filename="${docxFileName}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    
    // 5. Send the Word file buffer back to the user
    res.status(200).send(buffer);
    console.log(`Successfully sent ${docxFileName} to the user.`);

  } catch (error) {
    console.error('OCR or DOCX creation failed:', error.message);
    res.status(500).json({ error: 'Failed to process the file and create a Word document.' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
