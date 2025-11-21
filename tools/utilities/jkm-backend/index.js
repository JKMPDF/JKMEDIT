const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('JKM Backend (Debug Version) is Running!');
});

// --- HELPER: RUN YT-DLP COMMAND ---
const runYtDlp = (args) => {
    // 1. Force IPv4 (Helps with blocking)
    args.unshift('--force-ipv4');

    // 2. Check for Cookies
    // We check for cookies.txt (Netscape) or cookies.json (EditThisCookie)
    const txtPath = path.resolve(__dirname, 'cookies.txt');
    const jsonPath = path.resolve(__dirname, 'cookies.json');

    if (fs.existsSync(txtPath)) {
        console.log("✅ Found cookies.txt (Netscape format)");
        args.push('--cookies', txtPath);
    } else if (fs.existsSync(jsonPath)) {
        console.log("⚠️ Found cookies.json - YT-DLP prefers .txt but we will try.");
        // yt-dlp can sometimes read json, but txt is better
        args.push('--cookies', jsonPath);
    } else {
        console.log("❌ NO COOKIE FILE FOUND! YouTube will likely block this.");
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
    
    console.log(`Fetching Info for: ${url}`);
    const process = runYtDlp(args);
    
    let data = '';
    let error = '';

    process.stdout.on('data', (chunk) => data += chunk);
    process.stderr.on('data', (chunk) => error += chunk);

    process.on('close', (code) => {
        if (code !== 0) {
            console.error("YT-DLP Error Log:", error);
            // Send the actual error back to frontend so we can see it
            if (error.includes("Sign in")) {
                return res.status(403).json({ success: false, error: 'Server needs fresh cookies. Please update cookies.txt.' });
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

// --- ROUTE 2: DOWNLOAD MP3 ---
app.get('/api/download', (req, res) => {
    const url = req.query.url;
    const title = req.query.title || 'audio';

    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').substring(0, 60);
    res.header('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`);
    res.header('Content-Type', 'audio/mpeg');

    const args = [
        '-o', '-', 
        '-f', 'bestaudio[ext=m4a]/bestaudio/best', 
        '--no-warnings',
        url
    ];

    const process = runYtDlp(args);
    process.stdout.pipe(res);
    process.stderr.on('data', (data) => {
        const msg = data.toString();
        if(msg.includes('ERROR')) console.error("Download Error:", msg);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});