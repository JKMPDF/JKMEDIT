const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('JKM Backend (Fixed Audio) is Running!');
});

// --- HELPER: RUN YT-DLP COMMAND ---
const runYtDlp = (args) => {
    // Force IPv4 to prevent network blocking
    args.unshift('--force-ipv4');

    // Use cookies if they exist
    if (fs.existsSync('./cookies.txt')) {
        args.push('--cookies', './cookies.txt');
    }

    // Use a generic user agent
    args.push('--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    return spawn('yt-dlp', args);
};

// --- ROUTE 1: GET INFO ---
app.get('/api/info', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ success: false, error: 'No URL provided' });

    // -J: Dump JSON, --flat-playlist: Fast playlist scan
    const args = ['-J', '--flat-playlist', '--no-warnings', url];
    
    const process = runYtDlp(args);
    
    let data = '';
    let error = '';

    process.stdout.on('data', (chunk) => data += chunk);
    process.stderr.on('data', (chunk) => error += chunk);

    process.on('close', (code) => {
        if (code !== 0) {
            console.error("Info Error:", error);
            return res.status(500).json({ success: false, error: 'Failed to fetch info.' });
        }

        try {
            const json = JSON.parse(data);
            
            // Handle Playlist
            if (json._type === 'playlist') {
                const info = json.entries.map(item => ({
                    title: item.title,
                    thumbnail: item.thumbnails ? item.thumbnails[0].url : '',
                    url: item.url || `https://www.youtube.com/watch?v=${item.id}`,
                    author: item.uploader || 'Unknown'
                }));
                return res.json({ success: true, isPlaylist: true, info });
            } 
            
            // Handle Single Video
            else {
                const videoDetails = {
                    title: json.title,
                    thumbnail: json.thumbnail,
                    url: json.webpage_url,
                    author: json.uploader
                };
                return res.json({ success: true, isPlaylist: false, info: videoDetails });
            }
        } catch (e) {
            return res.status(500).json({ success: false, error: 'Error parsing YouTube data' });
        }
    });
});

// --- ROUTE 2: DOWNLOAD MP3 ---
app.get('/api/download', (req, res) => {
    const url = req.query.url;
    const title = req.query.title || 'audio';

    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').substring(0, 60);
    
    // We will send it as .mp3 filename, but the browser will handle the container
    res.header('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`);
    res.header('Content-Type', 'audio/mpeg');

    // UPDATED ARGS: 
    // 1. Output to stdout (-)
    // 2. Try getting M4A audio first (most stable), then any audio, then any best stream.
    const args = [
        '-o', '-', 
        '-f', 'bestaudio[ext=m4a]/bestaudio/best', 
        '--no-warnings',
        url
    ];

    const process = runYtDlp(args);

    // Pipe audio to user
    process.stdout.pipe(res);

    process.stderr.on('data', (data) => {
        const msg = data.toString();
        // Only log real errors, ignore standard progress info
        if(msg.includes('ERROR')) console.error("Download Stream Error:", msg);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});