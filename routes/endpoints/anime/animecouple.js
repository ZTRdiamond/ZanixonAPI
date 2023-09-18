module.exports = {
    name: "animecouple",
    path: "/api/image/anime/animecouple",
    details: {
        desc: "Random anime couple image",
        usage: "GET: /api/image/anime/animecouple"
    },
    rateLimit: {duration: 0, type: "user"},
    isKey: true,
    isLimit: true,
    type: "get",
    code: async (req, res) => {
        const fs = require("fs");
        const pth = require("path");
        const random = Math.floor(Math.random() * 264) + 1;
        
        const file = pth.join(__dirname + "../../../../assets/data/animecouple.json")
        fs.readFile(file, "utf8", (err, data) => {
            if(err) {
                console.log("Error at animecouple.js: \n" + err);
                res.status(403).json({ status: 403, error: "failed get data from anime couple database" });
                return;
            } else {
                try {
                    const couple = JSON.parse(data);
                    const result = JSON.stringify({
                        status: 200,
                        error: "none",
                        result: [couple[random]]
                    }, null, 2);
            
                    res.setHeader("Content-Type", "application/json");
                    res.send(result);
                    
                } catch (e) {
                    console.log(e)
                    return;
                }
            }
        });
    }
}