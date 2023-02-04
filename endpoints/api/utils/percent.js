module.exports = {
  path: "/api/tools/percent",
  details: {
    description: "Calculating a percent",
    usage: "?value=50&maxvalue=100"
  },
  code: `
$setVar[requestCount;$math[$getVar[requestCount]+1]]
$send[200;json;{
"status":"200","results":"$get[send]%"
}]

$var[send;$fixed[$math[100*$getQuery[value]/$getQuery[maxvalue]]]]

$if[$isNumber[$getQuery[maxvalue]]==false;400;{
"status":"400","error": "the 'maxvalue' is not a number!"
}]

$if[$isNumber[$getQuery[value]]==false;400;{
"status":"400","error": "the 'value' is not a number!"
}]

$if[$getQuery[maxvalue]==undefined;400;{
"status":"400","error":"the 'maxvalue' is empty!"
}]

$if[$getQuery[value]==undefined;400;{
"status":"400","error":"the 'value' is empty!"
}]

`
}