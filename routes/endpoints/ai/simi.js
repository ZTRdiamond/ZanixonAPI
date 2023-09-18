module.exports = {
    name: "simi",
    path: "/api/ai/simi",
    type: "get",
    details: {
        desc: "Chat with simi",
        usage: "GET: /api/ai/simi?apikey=YOUR_APIKEY&message=halo&lang=id"
    },
    isLimit: true,
    isKey: true,
    rateLimit: {
        duration: 2,
        type: "user"
    },
    code: async(req, res, { axios, details, query }) => {
        const ask = query.message;
        const lang = query.lang || "id";
        
        //if(lang === ""
        
        try {
            const response = await axios.post("https://api.simsimi.vn/v1/simtalk", `text=${ask}&lc=${lang}`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            const data = response.data;
            const result = JSON.stringify({
                status: 200,
                error: "none",
                result: [{
                    question: ask,
                    answer: data.message
                }]
            }, null, 2);
            res.setHeader("Content-Type", "application/json");
            res.send(result);
        } catch (e) {
            res.status(401).json({ status: 401, error: "Failed request to simsimi" });
            console.log("Error at simi.js:", e);
            return;
        }
    }
}