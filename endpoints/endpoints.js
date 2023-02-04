module.exports = {
    path: '/endpoints',
    code: `
$send[200;json;{
"home": 'Zanixon API',
"creator": "ZTRdiamond#9126",
"base URL": "https://test-api-coyy.fatahillahal.repl.co/",
"routes": [{
"anime":[
"/api/anime/coupleprofile"
]
},{
"fun":[
"/api/fun/gay?avatar=url",
"/api/fun/wasted?avatar=url&text=sometexts",
"/api/fun/wanted?avatar=url",
"/api/fun/gun?avatar=url",
"/api/fun/"
]
},{
"tools":[
"/tools/percent?value=number&maxvalue=number",
"/tools/progress-bar?barsize=number&value=number&maxvalue=number",
"/tools/abbreviate?number=num"
]
}]
}]
`
}