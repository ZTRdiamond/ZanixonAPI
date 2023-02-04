module.exports = {
    path: "/api/fun/gun",
    details: {
        description: "Added gun to your profile pict",
        usage: "?avtr=url"
        },
    code: `
$setVar[requestCount;$math[$getVar[requestCount]+1]]
$send[200;canvas;$default]


$drawImage[gun;0;0;512;512]
$drawImage[avatar;0;0;512;512]

$createCanvas[512;512]

$if[$isImage[avatar]==false;400;{
"status":"400","error":"image invalid!","usage":"?avtr=url"
}]

$loadImage[gun;path;./assets/canvas/gun.png]
$loadImage[avatar;link;$getQuery[avtr]]


$if[$getQuery[avtr]==undefined;400;{
"status":"400","error":"The 'url image' is empty","usage":"?avtr=url"
}]
`
}