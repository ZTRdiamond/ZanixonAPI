module.exports = {
	name: "waifu",
	path: "/api/image/anime/waifu",
	details: {
	    desc: "Random waifu image",
	    usage: "GET: /api/image/anime/waifu?apikey=your_apikey"
	},
	isKey: true,
	isLimit: true,
	rateLimit: {on: true, duration: 10, type: "route"},
	type: "get",
	code: async (req, res, { axios }) => {
		try {
			const response = await axios.get("https:/\/api.waifu.pics/sfw/waifu");
			const result = JSON.stringify({
			    status: 200,
			    error: "none",
			    result: [response.data]
			}, null, 2);
			res.setHeader("Content-Type", "application/json");
			res.send(result);
		} catch (e) {
			res.status(500).json({ status: 500, error: "request to server failed" });
			console.log("Error at waifu.js: \n" + e)
			return;
		}
	}
}