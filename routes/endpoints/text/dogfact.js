module.exports = {
    name: "dogfacts",
    path: "/api/text/dogfacts",
    details: {
        desc: "Random dog facts",
        usage: "GET: /api/text/dogfacts"
    },
    isKey: true,
    isLimit: true,
    type: "get",
    code: async (req, res) => {
        const fs = require("fs");
        const pth = require("path");
        const random = Math.floor(Math.random() * 264) + 1;
        
        const file = pth.join(__dirname + "../../../../assets/data/dogfacts.json")
        fs.readFile(file, "utf8", (err, data) => {
            if(err) {
                console.log("Error at dogfacts.js: \n" + err);
                res.status(403).json({ status: 403, error: "failed get data from dogfacts database" });
                return;
            } else {
                try {
                    const fact = JSON.parse(data);
                    const result = JSON.stringify({
                        status: 200,
                        error: "none",
                        result: [{
                            fact: fact[random]
                        }]
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