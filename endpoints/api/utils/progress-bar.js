module.exports = {
  path: "/api/tools/progress-bar",
  details: {
    description: "Made a progress bar",
    usage: "?barsize=number&value=number&maxvalue=number"
  },
  code: `
$setVar[requestCount;$math[$getVar[requestCount]+1]]
$send[200;json;{
"status":"200","result":"$get[send]"
}]

$var[send;$repeat[❚;$fixed[$math[$getQuery[barsize]*$getQuery[value]/$getQuery[maxvalue]]]]]

$if[$isNumber[$getQuery[maxvalue]]==false;400;{
"status":"400","error": "the 'maxvalue' is not a number!","usage":"?barsize=number&value=number&maxvalue=number"
}]

$if[$isNumber[$getQuery[value]]==false;400;{
"status":"400","error": "the 'value' is not a number!","usage":"?barsize=number&value=number&maxvalue=number"
}]


$if[$isNumber[$getQuery[barsize]]==false;400;{
"status":"400","error": "the 'barsize' is not a  number!","usage":"?barsize=number&value=number&maxvalue=number"
}]

$if[$getQuery[maxvalue]==undefined;400;{
"status":"400","error":"the 'maxvalue' is empty!","usage":"?barsize=number&value=number&maxvalue=number"
}]

$if[$getQuery[value]==undefined;400;{
"status":"400","error":"the 'value' is empty!","usage":"?barsize=number&value=number&maxvalue=number"
}]

$if[$getQuery[barsize]==undefined;400;{
"status":"400","error":"the 'barsize' is empty!","usage":"?barsize=number&value=number&maxvalue=number"
}]

`
}