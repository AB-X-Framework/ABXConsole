enableSIAngle(true);


addTest("π",()=>{
    Assertions.assertEquals(360*deg,2*π*rad);
})

addTest("i",()=>{
    Assertions.assertEquals(-1,im*im);
});


addTest("vector",()=>{
    Assertions.assertEquals(5,(3+4*im).mag);
});


addTest("max Decimals",()=>{
    Assertions.assertEquals("0",maxDecimals(0.00001,2));
    Assertions.assertEquals("2.245",maxDecimals(2.245123423423,3));
});
