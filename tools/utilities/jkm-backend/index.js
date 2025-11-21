const express = require('express');
const cors = require('cors');
const ytdl = require('distube-ytdl-core');
const ytpl = require('ytpl');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so your website can talk to this server
app.use(cors());

// Home Route (To check if server is alive)
app.get('/', (req, res) => {
    res.send('JKM Backend is Running Successfully!');
});

// --- API: GET VIDEO/PLAYLIST INFO ---
app.get('/api/info', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ success: false, error: 'No URL provided' });
    }

    try {
        // 1. Check if it is a Playlist
        if (ytpl.validateID(url)) {
            const playlist = await ytpl(url, { limit: 50 }); // Fetch first 50 videos
            const info = playlist.items.map(item => ({
                title: item.title,
                thumbnail: item.bestThumbnail.url,
                url: item.shortUrl,
                author: item.author.name
            }));
            return res.json({ success: true, isPlaylist: true, info: info });
        } 
        
        // 2. Check if it is a Single Video
        else if (ytdl.validateURL(url)) {
            const info = await ytdl.getBasicInfo(url);
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
        console.error(err);
        return res.status(500).json({ success: false, error: 'Could not fetch details. Video might be private or age-restricted.' });
    }
});

// --- API: DOWNLOAD MP3 ---
app.get('/api/download', (req, res) => {
    const url = req.query.url;
    const title = req.query.title || 'audio';

    if (!ytdl.validateURL(url)) {
        return res.status(400).send('Invalid URL');
    }

    try {
        // Clean the filename to remove special characters
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').substring(0, 60);

        // Set Headers to force download
        res.header('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`);
        res.header('Content-Type', 'audio/mpeg');

        // Stream audio directly to user
        ytdl(url, { 
            quality: 'highestaudio', 
            filter: 'audioonly' 
        }).pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});