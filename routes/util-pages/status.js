module.exports = {
    name: "status",
    path: "/status",
    type: "get",
    code: async (req, res, { userName }) => {
        res.status(404).json({ status: 404, error: "in progress lol"});
        return;
    }
}