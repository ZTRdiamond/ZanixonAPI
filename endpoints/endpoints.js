module.exports = {
    path: '/endpoints',
    code: `
$send[200;json;{
"name": "Zanixon API",
"owner": [
"ZTRdiamond#9126"
],
"base URL": "apiUrl/",
"requestCount": "$getVar[requestCount]",
"endpoints": [{
"fun":[
"/api/fun/gay?avtr=url","/api/fun/wanted?avtr=url&reward=text",
"/api/fun/skeletonpointing?avtr=url&text=text","/api/gun?avtr=url","/api/fun/stonks?avtr=url"
],
"random":[
"/api/random/waifu","/api/random/husbu","/api/random/neko"
],
"utils":[
"/api/utils/percent?value=number&maxvalue=number","/api/utils/progress-bar?barsize=number&value=number&maxvalue=number","/api/utils/abbreviate?number=num"
]
}]
}]

`
}