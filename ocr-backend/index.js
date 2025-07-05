const express = require('express');
const multer = require('multer');
const tesseract = require('node-tesseract-ocr');

const app = express();
// Render provides the PORT environment variable.
const port = process.env.PORT || 3000; 

// Allow your frontend to access this backend (CORS)
const cors = require('cors');
app.use(cors()); // In a real app, you might restrict this to your frontend's domain

// Configure multer for file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// Health check route
app.get('/', (req, res) => {
  res.status(200).send('OCR Backend is running!');
});

// The OCR upload route
app.post('/api/ocr', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  console.log(`Processing file: ${req.file.originalname}`);

  try {
    const config = { lang: 'eng', oem: 1, psm: 3 };
    const text = await tesseract.recognize(req.file.buffer, config);
    
    console.log("OCR successful.");
    res.status(200).json({ text: text.trim() });

  } catch (error) {
    console.error('OCR process failed:', error.message);
    res.status(500).json({ error: 'OCR failed to process the file.' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
