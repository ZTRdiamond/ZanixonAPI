module.exports = {
  path: "/tools/percent",
  details: {
    description: "Calculating a percent",
    usage: "?value=number&maxvalue=number"
  },
  code: `
$send[200;json;{
"results":"$get[send]%"
}]

$var[send;$fixed[$math[100*$getQuery[value]/$getQuery[maxvalue]]]]

$if[$isNumber[$getQuery[maxvalue]]==false||$isNumber[$getQuery[value]]==false;400;{
"error": "the 'value' or 'maxvalue' is not a number!"
}]




$if[$getQuery[value]==undefined&&$getQuery[value]==undefined;400;{
"error":"the 'value' or 'maxvalue' is empty!"
}]




`
}