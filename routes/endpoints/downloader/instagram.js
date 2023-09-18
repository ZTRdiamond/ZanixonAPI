module.exports = {
  name: "igdl",
  path: "/api/downloader/instagram",
  details: {
    desc: "Downloader for instagram video",
    usage: "GET: /api/downloader/instagram?apikey=YOUR_APIKEY&url=https://www.instagram.com/p/CWVkEeoMTA3/?igshid=MzRlODBiNWFlZA=="
  },
  isKey: true,
  isLimit: true,
  type: "get",
  code: async (req, res, { query, details, igCookie }) => {
    let { igApi } = require("insta-fetcher");
    let instagram = new igApi(igCookie);
    let url = query.url;
    if(!url) {
      res.status(400).json({ status: 200, error: "Url parameter is empty, Url must be set!", usage: details.usage });
      return;
    }
    
    try {
      instagram.fetchPost(url).then((data) => {
        const result = JSON.stringify({
          status: 200,
          error: "none",
          result: [data]
        }, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.send(result);
        return;
      }).catch((err) => { 
        console.log(err);
        res.status(400).json({
          status: 404,
          error: "Url invalid, data empty or the istagram post is private"
        });
        return;
      });
    } catch(error) {
      console.log("Error at instagram.js:", e);
      res.status(400).json({
        status: 400,
        error: "Url invalid, data empty or the istagram post is private"
      });
      return;
    }
  }
}