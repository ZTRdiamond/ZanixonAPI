module.exports = {
    name: "user info",
    path: "/util/userinfo",
    type: "get",
    code: async (req, res, { userName, userLimit, userEmail, apiKey, cookieApp, bodyApp }) => {
        if(userName == undefined) {
            res.status(401).json({ status: 401, error: "Can't find user info because user didn't signin." });
            return;
        }
        
        try {
            res.status(200).json({ status: 200, error: "none", result: { username: userName, limit: userLimit } });
            return;
        } catch (e) {
            return { error: "bruhh" };
        }
    }
}