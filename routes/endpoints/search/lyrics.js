module.exports = {
    name: "lyrics",
    path: "/api/search/lyrics",
    type: "get",
    details: {
        desc: "Using for search music lyrics",
        usage: "GET: /api/search/lyrics?apikey=YOUR_APIKEY&song=tabun yoasobi"
    },
    isKey: true,
    isLimit: true,
    code: async(req, res, { scd, query }) => {
        const g = require("genius-lyrics");
        const genius = new g.Client();
        
        let song = query.song;
        if (!song) {
            res.status(400).json({ status: 400, error: "Input song name or input song and artist name!" });
            return;
        }
        
        try {
            const search = await genius.songs.search(`${song}`);
            if (search && search.length > 0) {
                const lyric = search[0];
                const lyricResult = await lyric.lyrics();
                const result = JSON.stringify({
                    status: 200,
                    error: "none",
                    result: [{
                        title: song,
                        lyric: lyricResult
                    }]
                }, null, 2);
                res.send(result);
            } else {
                const result = JSON.stringify({
                    status: 404,
                    error: "The lyrics of the song you are looking for could not be found"
                }, null, 2);
                res.send(result)
                return;
            }
        } catch (e) {
            console.log("Error at lyrics.js:", e);
            return;
        }
    }
}