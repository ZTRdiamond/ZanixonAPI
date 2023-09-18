module.exports = {
  name: "fbdl",
  path: "/api/downloader/facebook",
  type: "get",
  details: {
    desc: "Download video from facebook",
    usage: "GET: /api/downloader/facebook?apikey=YOUR_APIKEY&url=https://fb.watch/mcRfKe_35C/?mibextid=NnVzG8"
  },
  isKey: true,
  isLimit: true,
  code: async (req, res, { query, details }) => {
    const getFBInfo = require("@xaviabot/fb-downloader");
    let url = query.url;
    
    if(!url) {
      res.status(400).json({ status: 200, error: "Url parameter is empty, Video url must be set!", usage: details.usage });
      return;
    }
    
    try {
      const data = await getFBInfo(url);
      const result = JSON.stringify({
        status: 200,
        error: "none",
        result: [{
          title: data.title,
          source: data.url,
          thumbnail: data.thumbnail,
          url: data.hd || data.sd
        }]
      }, null, 2);
      res.setHeader('Content-Type', 'application/json');
      res.send(result);
      return;
    } catch (e) {
      console.log("Error at facebook.js:", e);
      res.status(404).json({
        status: 404,
        error: e || "Video is not found, maybe video is from group or private"
      });
      return;
    }
  }
}