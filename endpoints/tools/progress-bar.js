module.exports = {
  path: "/tools/progress-bar",
  details: {
    description: "Made a progress bar",
    usage: "?barsize=number&value=number&maxvalue=number"
  },
  code: `
$send[200;json;{
"results":"$get[send]"
}]

$var[send;$repeat[❚;$fixed[$math[$getQuery[barsize]*$getQuery[value]/$getQuery[maxvalue]]]]]

$if[$isNumber[$getQuery[maxvalue]]==false;400;{
"error": "the 'maxvalue' is not a number!"
}]

$if[$isNumber[$getQuery[value]]==false;400;{
"error": "the 'value' is not a number!"
}]


$if[$isNumber[$getQuery[barsize]]==false;400;{
 "error": "the 'barsize' is not a  number!"
}]

$if[$getQuery[value]==undefined&&$getQuery[value]==undefined&&$getQuery[barsize]==undefined;400;{
"error":"the 'value' or 'maxvalue' is empty!"
}]




`
}