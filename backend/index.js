const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const { fromPath } = require('pdf2pic');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// ✅ Allow cross-origin requests
app.use(cors());

// ✅ Actual OCR endpoint
app.post('/convert/pdf-to-ocr-word', upload.single('file'), async (req, res) => {
  try {
    // 1. Convert first page of PDF to image
    const convert = fromPath(req.file.path, {
      density: 300,
      saveFilename: "temp",
      savePath: "./images",
      format: "png",
    });

    const pageImage = await convert(1);

    // 2. Perform OCR on image
    const result = await Tesseract.recognize(pageImage.path, 'eng');

    // 3. Save the extracted text to a .docx-like file
    const fileName = `ocr-result-${Date.now()}.doc`;
    const outputPath = path.join(__dirname, 'downloads', fileName);
    fs.mkdirSync(path.join(__dirname, 'downloads'), { recursive: true });
    fs.writeFileSync(outputPath, result.data.text, 'utf8');

    // 4. Send download link
    const publicUrl = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}/downloads/${fileName}`;
    res.json({ success: true, downloadUrl: publicUrl, fileName });

  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: 'OCR failed', detail: err.message });
  }
});

// ✅ Serve output files
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// ✅ Health check
app.get('/', (req, res) => {
  res.send('OCR Server is Live!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ OCR server running on port ${port}`);
});
