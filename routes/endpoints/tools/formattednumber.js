module.exports = {
    name: "formatter number",
    path: "/api/tools/formatternumber",
    type: "get",
    details: {
        desc: "formatting number to readable, Max formatting is 1e15",
        usage: "/api/tools/formatternumber?number=number&format=string"
    },
    code: async(req, res, { send, query, db }) => {
        const number = query.number;
        const format = query.format || ",";
        const regex = new RegExp(",", "g");
        
        const numRes = db.numberSeparator(number).replace(regex, format);
        const result = JSON.stringify({
            status: 200,
            error: "none",
            result: [{
                number: number,
                formatted: numRes
            }]
        }, null, 2);
        send(result);
        return;
    }
}