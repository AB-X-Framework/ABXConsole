/**
 * You can import scripts with the include tag
 */
println("Inside Variables.js");

include("{script}/inner/Inner.js")
Assertions.assertTrue(innerProcessedCorrectly);
var a = 1;
var b = a +1;