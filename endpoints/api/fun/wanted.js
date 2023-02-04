module.exports = {
    path: "/api/fun/wanted",
    details: {
        description: "Wanted image",
        usage: "?avtr=url&reward=text"
        },
    code: `
$setVar[requestCount;$math[$getVar[requestCount]+1]]
$send[200;canvas;$default]

$drawText[$getQuery[reward];132;1020;620;200;center;top]
$font[45;shortcut]
$registerFont[./assets/fonts/shortcut.ttf;shortcut]

$drawImage[avatar;132;257;614;614]
$drawImage[bg;0;0;876;1280]

$createCanvas[876;1280]
$loadImage[bg;path;./assets/canvas/wanted.png]

$if[$isImage[avatar]==false;400;{
"status":"400","error":"Image invalid","usage":"?avtr=url&reward=text"
}]
$loadImage[avatar;link;$getQuery[avtr]]

$if[$getQuery[reward]==undefined;400;{
"status":"400","error":"The 'reward' is empty","usage":"?avtr=url&reward=text"
}]

$if[$getQuery[avtr]==undefined;400;{
"status":"400","error":"The 'avtr' is empty","usage":"?avtr=url&reward=text"
}]
`
}