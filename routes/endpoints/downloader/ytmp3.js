module.exports = {
    name: "ytmp3",
    path: "/api/downloader/ytmp3",
    details: {
        desc: "Downloader audio for youtube",
        usage: "GET: /api/downloader/ytmp3?url=youtube_url&apikey=your_apikey"
    },
    isKey: true,
    isLimit: true,
    type: "get",
    code: async (req, res, { query, details }) => {
        const ytdl = require("ytdl-core");
        let url = query.url;
        
        if(!url) {
            res.status(400).json({ status: 400, error: "param url is not found, video url must be set", usage: details.usage });
            return;
        }
        
        try {
            if(!ytdl.validateURL(url)) {
                res.status(400).json({ status: 400, error: "invalid url" });
                return;
            }
            
            const data = await ytdl.getInfo(url);
            const sortedAudio = data.formats
                .filter((format) => format.hasAudio)
                .sort ((a, b) => b.audioBitrate - a.audioBitrate);
                
            const resAudio = sortedAudio[0];
            const vid = data.videoDetails;
            const mvd = data.MoreVideoDetails;
            const thumbnail = data.videoDetails.thumbnails.sort((a, b) => b.width - a.width).find((thumbnail) => thumbnail.width > 1000 || thumbnail.width > 700 || thumbnail.width > 600 || thumbnail.width > 500 || thumbnail.width > 400 || thumbnail.width > 300 || thumbnail.width > 200 || thumbnail.width > 100);
            
            const result = JSON.stringify({
                status: 200,
                error: "none",
                result: [{
                    info: {
                        title: vid.title,
                        description: vid.description,
                        duration: vid.lengthSeconds,
                        thumbnail: thumbnail,
                        keywords: vid.keywords
                    },
                    audio: {
                        quality: resAudio.audioQuality,
                        itag: resAudio.itag,
                        url: resAudio.url
                    }
                }]
            }, null, 2);
            
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
            return
        } catch (e) {
            console.log("Error at ytmp3 routes: \n" + e)
        }
    }
}