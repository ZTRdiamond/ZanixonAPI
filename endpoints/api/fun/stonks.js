module.exports = {
    path: "/api/fun/stonks",
    details: {
        description: "Make your profile into stonks meme",
        usage: "?avtr=url"
        },
    code: `
$setVar[requestCount;$math[$getVar[requestCount]+1]]
$send[200;canvas;$default]


$drawImage[avatar;95;20;185;185]

$drawImage[stonks;0;0;797;575]

$createCanvas[797;575]

$if[$isImage[avatar]==false;400;{
"status":"400","error":"image invalid!","usage":"?avtr=url"
}]

$loadImage[stonks;path;./assets/canvas/stonks.webp]
$loadImage[avatar;link;$getQuery[avtr]]


$if[$getQuery[avtr]==undefined;400;{
"status":"400","error":"The 'url image' is empty","usage":"?avtr=url"
}]
`
}