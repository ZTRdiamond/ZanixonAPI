module.exports = {
    path: "/api/random/waifu",
    details: {
        description: "Random waifu image generator",
        usage: "none"
        },
    code: `
$send[200;json;{
"status":"200","url":"$get[url]"
}]

$var[]
`
}