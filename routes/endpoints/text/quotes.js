module.exports = {
    name: "quotes",
    path: "/api/text/quotes",
    details: {
        desc: "Random quotes generator",
        usage: "GET: /api/text/quotes"
    },
    isKey: true,
    isLimit: true,
    type: "get",
    code: async (req, res, { axios }) => {
        const rsp = await axios.get("https://api.quotable.io/random");
        const data = rsp.data;
        
        try {
            const result = JSON.stringify({
                status: 200,
                error: "none",
                result: [{
                    quotes: data.content,
                    author: data.author
                }]
            }, null, 2);
            
            res.setHeader("Content-Type", "application/json");
            res.send(result);
        } catch (e) {
            console.log("Error at quotes.js: \n" + e);
            res.status(403).json({ status: 403, error: "failed get data from quotes datddatabase" });
            return;
        }
    }
}