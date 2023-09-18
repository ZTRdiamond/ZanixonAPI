module.exports = {
    name: "exit",
    path: "/exit",
    type: "get",
    hidden: true,
    code: async(req, res, { query, utils }) => {
        const key = query.key;
        
        if(key == "@ohiorestapiawokawok") {
            console.log(utils.clock() + " >> " + "[System] Rest API has been shutdown using '/exit', if you not take this action, change the shutdown key right now.")
            process.exit();
        } else {
            res.json({ status: 400, error: "Bro trying to shutdown the rest API💀" })
            return;
        }
    }
}