module.exports = {
  path: "/api/tools/abbreviate",
  details: {
    description: 'Abbreviate your number',
    usage: '?num=7538&dec=2'
  },
  code: `
$setVar[requestCount;$math[$getVar[requestCount]+1]]
$send[200;json;{
"status":"200","result":"$get[send]"
}]

$var[send;$abbreviateNumber[$getQuery[num];$getQuery[dec]]]

$if[$isNumber[$getQuery[num]]==false;400;{
	"status":"400","error":"Please enter the correct number!","usage":"?num=7538&dec=2"
}]

$if[$getQuery[num]==undefined;400;{
	"status":"400","error":"The number is empty!","usage":"?num=7538&dec=2"
}]
`
}