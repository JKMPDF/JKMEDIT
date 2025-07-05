// =================================================================
// START: COMPLETE SERVER CODE (e.g., index.js)
// =================================================================

// --- 1. SETUP: Import tools and create folders ---
const express = require('express');
const cors = require('cors');
const multer = require('multer'); // For handling file uploads
const { v4: uuidv4 } = require('uuid'); // For unique ticket numbers (jobId)
const fs = require('fs');
const path = require('path');

// --- IMPORTANT ---
// You need to tell the server where your actual OCR logic is.
// Replace './your-ocr-logic-file' with the correct path.
// The `performOcrAndConversion` should be the function that takes an input file path and returns the output file path.
const { performOcrAndConversion } = require('./ocr'); // EXAMPLE: Assuming your function is in 'ocr.js'

const app = express();
app.use(cors()); // Allows your frontend to talk to this backend
app.use(express.json());

// We need folders to temporarily store the uploaded and finished files.
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PROCESSED_DIR = path.join(__dirname, 'processed');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
if (!fs.existsSync(PROCESSED_DIR)) fs.mkdirSync(PROCESSED_DIR);

// This is our temporary "database" to keep track of all the conversion jobs.
// It's just a simple object that holds the status of each job.
const jobs = {};

// --- 2. CONFIGURE FILE UPLOADS ---
// This tells `multer` where to save the uploaded files.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Give the file a unique name to prevent mix-ups.
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });


// --- 3. CREATE THE API ENDPOINTS ---

/**
 * ENDPOINT 1: UPLOAD
 * - Receives the file from the user.
 * - Creates a new job with a unique 'jobId'.
 * - Immediately sends the 'jobId' back to the user.
 * - Starts the OCR process in the background.
 */
app.post('/api/ocr/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const jobId = uuidv4(); // Create a unique ticket number
  const job = {
    id: jobId,
    status: 'PENDING', // The job is waiting to be processed
    originalFilename: req.file.originalname,
    inputPath: req.file.path, // Where the uploaded file is saved
    outputPath: null,
    error: null,
  };
  jobs[jobId] = job; // Store the job information

  console.log(`[${jobId}] Job created for ${job.originalFilename}`);
  
  // Send the ticket number back to the user right away.
  res.status(202).json({ jobId: jobId });

  // Now, do the slow work in the background without making the user wait for it to finish.
  processFileInBackground(jobId);
});


/**
 * ENDPOINT 2: STATUS
 * - The user's browser will call this endpoint every few seconds.
 * - It checks the status of the job ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED').
 */
app.get('/api/ocr/status/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const job = jobs[jobId];

  if (!job) {
    return res.status(404).json({ error: 'Job not found.' });
  }

  res.json({
    status: job.status,
    error: job.error, // Will be null unless something went wrong
  });
});

/**
 * ENDPOINT 3: DOWNLOAD
 * - Once the status is 'COMPLETED', the user's browser will be sent to this URL.
 * - This endpoint sends the finished .docx file for download.
 */
app.get('/api/ocr/download/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const job = jobs[jobId];

  if (!job || !job.outputPath) {
    return res.status(404).json({ error: 'File not found or job is invalid.' });
  }

  if (job.status !== 'COMPLETED') {
    return res.status(400).json({ error: 'Job is not yet complete.' });
  }

  // This command tells the browser to treat the response as a file download.
  res.download(job.outputPath, (err) => {
    if (err) {
      console.error(`[${jobId}] Error sending file for download:`, err);
    }
    // You could clean up the files here after download if you want.
  });
});


// --- 4. BACKGROUND PROCESSING LOGIC ---

// This is the function that does the actual, slow OCR work.
async function processFileInBackground(jobId) {
  const job = jobs[jobId];
  job.status = 'PROCESSING';
  console.log(`[${jobId}] Starting OCR...`);

  try {
    // This is where you call your existing OCR function.
    // It must take the input path and return the path to the finished file.
    const convertedFilePath = await performOcrAndConversion(job.inputPath, job.originalFilename, PROCESSED_DIR);
    
    // Update the job when it's done.
    job.outputPath = convertedFilePath;
    job.status = 'COMPLETED';
    console.log(`[${jobId}] OCR completed successfully.`);

  } catch (error) {
    // If something goes wrong, update the job with an error.
    console.error(`[${jobId}] OCR failed:`, error);
    job.status = 'FAILED';
    job.error = error.message || 'An unknown server error occurred.';
  }
}

// --- 5. START THE SERVER ---
const PORT = process.env.PORT || 3001; // Using 3001 to avoid conflicts
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// =================================================================
// END: COMPLETE SERVER CODE
// =================================================================
