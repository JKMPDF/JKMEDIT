const express = require('express');
const cors = require('cors');
const ytdl = require('distube-ytdl-core'); // Using distube fork for better reliability
const ytpl = require('ytpl');

const app = express();
app.use(cors());

// --- ROUTE 1: GET INFO (Video or Playlist) ---
app.get('/api/info', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ success: false, error: 'No URL provided' });

    try {
        // CHECK IF PLAYLIST
        if (ytpl.validateID(url)) {
            const playlist = await ytpl(url, { limit: 50 }); // Limit to 50 to avoid timeouts
            const info = playlist.items.map(item => ({
                title: item.title,
                thumbnail: item.bestThumbnail.url,
                url: item.shortUrl,
                author: item.author.name
            }));
            return res.json({ success: true, isPlaylist: true, info });
        } 
        
        // HANDLE SINGLE VIDEO
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
        return res.status(500).json({ success: false, error: 'Failed to fetch metadata' });
    }
});

// --- ROUTE 2: DOWNLOAD MP3 ---
app.get('/api/download', async (req, res) => {
    const url = req.query.url;
    const title = req.query.title || 'audio';

    if (!ytdl.validateURL(url)) {
        return res.status(400).send('Invalid URL');
    }

    try {
        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
        
        // Note: Browsers perform content sniffing. Even though we send .mp3 filename, 
        // the format is actually an audio container (m4a/opus) that plays universally.
        // True MP3 conversion requires heavy CPU (FFmpeg), often restricted on free tiers.
        
        ytdl(url, { 
            quality: 'highestaudio', 
            filter: 'audioonly' 
        }).pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});