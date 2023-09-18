module.exports = {
    name: "abbreviate",
    path: "/api/tools/abbreviate",
    type: "get",
    details: {
        desc: "Abbreviate a number to scientific notation, Max number is 1e300.",
        usage: "/api/tools/abbreviate?number=12345678&format=0.00a"
    },
    code: async(req, res, { send, db, query }) => {
        const number = query.number;
        const format = query.format || "0a";
        
        if(isNaN(number) != false) {
            res.status(400).json({ status: 400, error: "Parameter number is empty or the number is invalid" });
            return;
        }
        
        const abbr = db.abbreviate(number, format);
        const result = JSON.stringify({
            status: 200,
            error: "none",
            result: [{
                number: number,
                abbreviated: abbr
            }]
        }, null, 2);
        send(result);
        return;
    }
}