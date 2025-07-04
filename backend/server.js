const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const pdf2pic = require('pdf2pic');
const cors = require('cors');
app.use(cors());

const app = express();
const upload = multer({ dest: 'uploads/' });

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
    res.send({ text: result.data.text });
  } catch (err) {
    res.status(500).send({ error: 'OCR failed', detail: err.message });
  }
});

app.listen(3000, () => {
  console.log('OCR server running on port 3000');
});
