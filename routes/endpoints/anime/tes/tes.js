module.exports = {
    name: "jt",
    path: "/api/tess",
    type: "get",
    code: async(req, res, { send }) => {
        send({message: "hello!"})
    }
}