const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Module to read the cookie file
const ytdl = require('@distube/ytdl-core');
const ytpl = require('@distube/ytpl');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// --- SETUP YOUTUBE AGENT WITH COOKIES ---
let agent;
try {
    // Look for cookies.json in the same folder
    if (fs.existsSync('./cookies.json')) {
        const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf8'));
        agent = ytdl.createAgent(cookies);
        console.log("✅ Cookies loaded successfully!");
    } else {
        console.log("⚠️ No cookies.json found. You might get 'Bot' errors from YouTube.");
    }
} catch (err) {
    console.error("❌ Error loading cookies:", err.message);
}

// --- ROUTES ---

app.get('/', (req, res) => {
    res.send('JKM Backend is Running!');
});

app.get('/api/info', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ success: false, error: 'No URL provided' });

    try {
        // 1. Try Playlist
        try {
            const playlist = await ytpl(url, { limit: 50 });
            const info = playlist.items.map(item => ({
                title: item.title,
                thumbnail: item.bestThumbnail.url,
                url: item.shortUrl,
                author: item.author.name
            }));
            return res.json({ success: true, isPlaylist: true, info: info });
        } catch (e) { /* Not a playlist, continue */ }
        
        // 2. Try Single Video (With Agent/Cookies)
        if (ytdl.validateURL(url)) {
            const info = await ytdl.getBasicInfo(url, { agent });
            const videoDetails = {
                title: info.videoDetails.title,
                thumbnail: info.videoDetails.thumbnails[0].url,
                url: info.videoDetails.video_url,
                author: info.videoDetails.author.name
            };
            return res.json({ success: true, isPlaylist: false, info: videoDetails });
        } else {
            return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });
        }

    } catch (err) {
        console.error("Info Error:", err.message);
        return res.status(500).json({ success: false, error: 'YouTube blocked the request. Check server logs.' });
    }
});

app.get('/api/download', (req, res) => {
    const url = req.query.url;
    const title = req.query.title || 'audio';

    if (!ytdl.validateURL(url)) return res.status(400).send('Invalid URL');

    try {
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').substring(0, 60);
        res.header('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`);
        res.header('Content-Type', 'audio/mpeg');

        // Pass the agent (cookies) to the download stream
        ytdl(url, { 
            agent,
            quality: 'highestaudio', 
            filter: 'audioonly' 
        }).pipe(res);

    } catch (err) {
        console.error("Download Error:", err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});