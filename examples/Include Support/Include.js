/**
 * You can import scripts with the include tag
 */
addTest("Include",()=>{
    include("{script}/include/Variables.js");
    Assertions.assertEquals(a,1);
    include("{script}/include/inner/Inner.js");
    Assertions.assertTrue(secondRound);
});