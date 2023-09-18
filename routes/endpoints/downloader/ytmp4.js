module.exports = {
    name: "ytmp4",
    path: "/api/downloader/ytmp4",
    details: {
        desc: "Downloader video for youtube",
        usage: "GET: /api/downloader/ytmp4?url=youtube_url&apikey=your_apikey"
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
            const sortedVideo = data.formats
                .filter((format) => format.hasVideo && format.hasAudio)
                .sort((a, b) => (b.width * b.height) - (a.width * a.height));
                
            const resVideo = sortedVideo[0];
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
                    video: {
                        quality: resVideo.qualityLabel,
                        itag: resVideo.itag,
                        url: resVideo.url
                    }
                }]
            }, null, 2);
            
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
            return
        } catch (e) {
            console.log("Error at ytmp3 routes: \n" + e);
            res.status(403).json({ status: 403, error: "something went wrong in API" });
            return;
        }
    }
}