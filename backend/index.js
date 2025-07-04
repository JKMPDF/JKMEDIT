const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const pdf2pic = require('pdf2pic');
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

// --- OCR Endpoint ---
app.post('/convert/pdf-to-ocr-word', upload.single('file'), async (req, res) => {
  try {
    const convert = pdf2pic.fromPath(req.file.path, {
      density: 300,
      saveFilename: "temp",
      savePath: "./images",
      format: "png",
    });

    const pageImage = await convert(1);
    const result = await Tesseract.recognize(pageImage.path, 'eng');

    // Optional: delete temp files
    fs.unlinkSync(req.file.path);
    fs.unlinkSync(pageImage.path);

    res.send({
      success: true,
      text: result.data.text,
      fileName: 'converted.docx', // You can replace with actual Word output logic
      downloadUrl: null           // Currently no file download, only text
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'OCR failed', detail: err.message });
  }
});

// ✅ PORT = 10000 (Matches Render config)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`OCR server running on port ${PORT}`);
});
