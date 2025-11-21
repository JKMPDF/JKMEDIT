const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('JKM Backend (yt-dlp version) is Running!');
});

// --- HELPER: RUN YT-DLP COMMAND ---
const runYtDlp = (args, res) => {
    // If cookies.txt exists, use it
    if (fs.existsSync('./cookies.txt')) {
        args.push('--cookies', './cookies.txt');
    }

    // Use a generic user agent to look like a regular browser
    args.push('--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    return spawn('yt-dlp', args);
};

// --- ROUTE 1: GET INFO ---
app.get('/api/info', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ success: false, error: 'No URL provided' });

    // Arguments: Dump JSON data, flat playlist (fast), no warnings
    const args = ['-J', '--flat-playlist', '--no-warnings', url];
    
    const process = runYtDlp(args);
    
    let data = '';
    let error = '';

    process.stdout.on('data', (chunk) => data += chunk);
    process.stderr.on('data', (chunk) => error += chunk);

    process.on('close', (code) => {
        if (code !== 0) {
            console.error("yt-dlp error:", error);
            return res.status(500).json({ success: false, error: 'Failed to fetch info. Video might be restricted.' });
        }

        try {
            const json = JSON.parse(data);
            
            // Handle Playlist
            if (json._type === 'playlist') {
                const info = json.entries.map(item => ({
                    title: item.title,
                    thumbnail: item.thumbnails ? item.thumbnails[0].url : '', // Sometimes thumbnails are missing in flat-playlist
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
    res.header('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`);
    res.header('Content-Type', 'audio/mpeg');

    // Arguments: Output to stdout (-), extract audio, format mp3 (best quality)
    const args = [
        '-o', '-', 
        '-f', 'bestaudio', 
        '--no-warnings',
        url
    ];

    const process = runYtDlp(args);

    // Pipe the audio stream directly to the user
    process.stdout.pipe(res);

    process.stderr.on('data', (data) => {
        // Log errors but don't crash (yt-dlp outputs progress to stderr sometimes)
        const msg = data.toString();
        if(msg.includes('ERROR')) console.error(msg);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});