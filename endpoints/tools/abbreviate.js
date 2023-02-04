module.exports = {
  path: "/tools/abbreviate",
  details: {
    description: "Abbreviate your number",
    usage: "?number=1000"
  },
  code: `
$send[200;json;{
"results":"$get[send]"
}]

$var[send;$abbreviateNumber[$getQuery[number];2]]

$if[$isNumber[$getQuery[number]]==false;400;{
	"error":"Please enter the correct number!"
}]

$if[$getQuery[number]==undefined;400;{
	"error":"The number is empty!"
}]
`
}