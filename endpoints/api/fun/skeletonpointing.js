module.exports = {
    path: "/api/fun/skeletonpointing",
    details: {
        description: "Skeleton pointing memes",
        usage: "?avtr=url&text=text"
        },
    code: `
$setVar[requestCount;$math[$getVar[requestCount]+1]]
$send[200;canvas;$default]

$drawText[$get[text];15;10;980;300;left;top]
$font[30;Arial;bold]
$var[text;$ternary[$charCount[$getQuery[text]]>460;$slice[$getQuery[text];1;459];$getQuery[text]]]

$drawImage[avatar;670;670;320;320]
$drawImage[bg;0;0;1024;1024]
$createCanvas[1024;1024]
$loadImage[bg;path;./assets/canvas/skeleton.png]

$if[$isImage[avatar]==false;400;{
"status":"400","error":"Invalid image","usage":"?avtr=url&text=text"
}]
$loadImage[avatar;link;$getQuery[avtr]]


$if[$getQuery[text]==undefined;400;{
"status":"400","error":"The 'text' is empty","usage":"?avtr=url&text=text"
}]

$if[$getQuery[avtr]==undefined;400;{
"status":"400","error":"The 'avtr' is empty","usage":"?avtr=url&text=text"
}]
`
}