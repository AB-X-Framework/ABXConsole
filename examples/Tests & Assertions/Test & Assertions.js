/**
 * The basic support for test is
 * addTest(Name, Fx)
 * The framework will collect all tests and will run one at a time
 * Finally it will generate a report with all the tests
 *
 * You can use built in asserts
 * Assertions.assertTrue(x) will fail is x is false
 * Assertions.assertFalse(x) will fail is x is true
 * Assertions.assertEquals(A,B) will fail is A is different to B
 *
 * You need to run this example using Choose execution type: Execute Tests
 */

addTest("Expected Success", ()=>{
    Assertions.assertTrue(true);
});

addTest("Expected Failure", ()=>{
    Assertions.assertFalse(true);
});

addTest("Expected Same", ()=>{
    Assertions.assertEquals(Set(1,1),Set(1));
});