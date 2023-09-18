module.exports = {
    name: "husbu",
    path: "/api/image/anime/husbu",
    details: {
        desc: "Random husbu image",
        usage: "GET: /api/image/anime/husbu"
    },
    isKey: true,
    isLimit: true,
    type: "get",
    code: async (req, res) => {
        const fs = require("fs");
        const pth = require("path");
        const random = Math.floor(Math.random() * 122) + 1;
        
        const file = pth.join(__dirname + "../../../../assets/data/husbu.json")
        fs.readFile(file, "utf8", (err, data) => {
            if(err) {
                console.log("Error at husbu.js: \n" + err);
                res.status(403).json({ status: 403, error: "failed get data from husbu database" });
                return;
            } else {
                try {
                    const husbu = JSON.parse(data);
                    const result = JSON.stringify({
                        status: 200,
                        error: "none",
                        result: [husbu[random]]
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