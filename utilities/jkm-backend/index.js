const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('JKM Backend (MP3 Conversion Fixed) is Running!');
});

// --- HELPER: RUN YT-DLP COMMAND ---
const runYtDlp = (args) => {
    // 1. Force IPv4
    args.unshift('--force-ipv4');

    // 2. Check for Cookies
    const txtPath = path.resolve(__dirname, 'cookies.txt');
    if (fs.existsSync(txtPath)) {
        args.push('--cookies', txtPath);
    }

    // 3. User Agent
    args.push('--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    return spawn('yt-dlp', args);
};

// --- ROUTE 1: GET INFO ---
app.get('/api/info', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ success: false, error: 'No URL provided' });

    const args = ['-J', '--flat-playlist', '--no-warnings', url];
    
    const process = runYtDlp(args);
    
    let data = '';
    let error = '';

    process.stdout.on('data', (chunk) => data += chunk);
    process.stderr.on('data', (chunk) => error += chunk);

    process.on('close', (code) => {
        if (code !== 0) {
            console.error("Info Error:", error);
            // Check for bot error
            if (error.includes("Sign in")) {
                return res.status(403).json({ success: false, error: 'Cookies expired. Please update cookies.txt.' });
            }
            return res.status(500).json({ success: false, error: 'Failed to fetch info.' });
        }

        try {
            const json = JSON.parse(data);
            if (json._type === 'playlist') {
                const info = json.entries.map(item => ({
                    title: item.title,
                    thumbnail: item.thumbnails ? item.thumbnails[0].url : '',
                    url: item.url || `https://www.youtube.com/watch?v=${item.id}`,
                    author: item.uploader || 'Unknown'
                }));
                return res.json({ success: true, isPlaylist: true, info });
            } else {
                const videoDetails = {
                    title: json.title,
                    thumbnail: json.thumbnail,
                    url: json.webpage_url,
                    author: json.uploader
                };
                return res.json({ success: true, isPlaylist: false, info: videoDetails });
            }
        } catch (e) {
            return res.status(500).json({ success: false, error: 'Error parsing data' });
        }
    });
});

// --- ROUTE 2: DOWNLOAD MP3 (FIXED) ---
app.get('/api/download', (req, res) => {
    const url = req.query.url;
    const title = req.query.title || 'audio';

    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').substring(0, 60);
    res.header('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`);
    res.header('Content-Type', 'audio/mpeg');

    // --- NEW CONVERSION ARGUMENTS ---
    const args = [
        '-x',                     // Extract audio
        '--audio-format', 'mp3',  // Convert to MP3 container
        '--audio-quality', '128K', // Compress to 128kbps (Standard MP3 size)
        '-o', '-',                // Output to Stdout (Stream to user)
        '--no-warnings',          // Silence errors
        url
    ];

    const process = runYtDlp(args);

    // Pipe the converted MP3 data to the user
    process.stdout.pipe(res);

    process.stderr.on('data', (data) => {
        const msg = data.toString();
        // Log only critical errors
        if(msg.includes('ERROR')) console.error("Download Error:", msg);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});