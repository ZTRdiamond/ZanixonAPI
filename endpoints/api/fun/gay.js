module.exports = {
    path: "/api/fun/gay",
    details: {
        description: "make your profile into gay flag lol",
        usage: "?avtr=url"
        },
    code: `
$setVar[requestCount;$math[$getVar[requestCount]+1]]
$send[200;canvas;$default]


$drawImage[gay;0;0;512;512]
$opacity[70]
$drawImage[avatar;0;0;512;512]

$createCanvas[512;512]

$if[$isImage[avatar]==false;400;{
"status":"400","error":"image invalid!","usage":"?avtr=url"
}]

$loadImage[gay;path;./assets/canvas/gay.png]
$loadImage[avatar;link;$getQuery[avtr]]


$if[$getQuery[avtr]==undefined;400;{
"status":"400","error":"The 'url image' is empty","usage":"?avtr=url"
}]
`
}