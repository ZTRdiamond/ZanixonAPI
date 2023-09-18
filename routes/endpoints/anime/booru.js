module.exports = {
   name: "booru",
   path: "/api/image/booru",
   type: "get",
   rateLimit: {
       duration: 0,
       type: "route"
   },
   isDisable: false,
   hidden: false,
   isKey: true,
   isLimit: true,
   code: async (req, res, { axios, query }) => {
      const boorukey = "qarLXcEgncWfDjoLU3zmpwZV";
      
      try {
         const danbooru = "https://danbooru.donmai.us/posts.json";
         const safebooru = "https://safebooru.donmai.us/posts.json";
         const yandere = "https://yande.re/post.json";
         let url = "https://safebooru.donmai.us/posts.json";
         const tags = query.tags;
         const rating = query.rating ? ` rating:${query.rating}` : ``;
         
         if (!tags) {
            res.status(400).json({ status: 400, error: "tags parameter can't be empty" });
            return;
         }
         
         if (query.rating !== undefined && !['s', 'g', 'e', 'q'].includes(query.rating)) {
            res.status(400).json({ status: 400, error: `Rating '${query.rating}' is not valid. Available ratings are 's', 'g', 'e', and 'q' on the rating parameter.` });
            return;
         }
         
         const resp = await axios.get(url, {
            params: {
               tags: `${tags}+${rating}`,
               random: true,
               limit: 1
            }
         });
         
         if (!resp.data) {
             url = danbooru;
         } else if(!resp.data) {
             url = safebooru;
         } else {
             url = yandere;
         }

         const data = resp.data[0];
         console.log(data + " " + url)
         const result = JSON.stringify({
            status: 200,
            error: "none",
            result: [{
               rating: data.rating,
               post: url + data.id,
               uploader: url + data.uploader_id,
               source: data.source,
               fav: data.fav_count,
               upvote: data.up_score,
               downvote: data.down_score,
               created_date: data.created_at,
               tags: data.tag_string,
               width: data.width,
               height: data.height,
               size: data.file_size,
               image: data.file_url ? data.file_url : "https://http.cat/404"
            }]
         }, null, 2);
         res.setHeader("Content-Type", "application/json");
         res.send(result);
         return;
      } catch (err) {
         res.status(403).json({
            status: 403,
            error: "something went wrong with client or request"
         });
         console.log("Error at booru.js: ");
         console.log(err);
         return;
      }
   }
};