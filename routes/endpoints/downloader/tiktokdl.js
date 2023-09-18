module.exports = {
   name: "TiktokDL",
   path: "/api/downloader/tiktokdl",
   details: {
      desc: "Downloader for tiktok",
      usage: "GET: /api/downloader/tiktokdl?url=tiktok_video_url&apikey=your_apikey"
   },
   isKey: true,
   isLimit: true,
   type: "get",
   code: async (req, res, { query, details }) => {
      const tiktok = require("@tobyg74/tiktok-api-dl");
      let url = query.url;
      
      if (!url) {
         res.status(400).json({
            status: 400,
            error: "param url is not found, video url must be set",
            usage: details.usage
         });
         return;
      }

      try {
         tiktok.TiktokDL(url).then(data => {
            const result = JSON.stringify({
               status: 200,
               error: "none",
               result: [data.result]
            }, null, 2);
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
            return;
         });
      } catch (error) {
         console.log(error)
         return;
      }
   }
}