/**
 * This script should succeed on performance as type validation is disabled
 * It should fail on standard and debug as  type validation is enabled
 */
addTest("expectedInputString", () => {
    function expectedInputString(expected: String) {

    }

    expectedInputString(1);
});

addTest("expectedOutputString", () => {
    function expectedOutputString(): String {
        return 1;
    }

    expectedOutputString();
});

addTest("expectedVoid", () => {
    function expectedVoid(): void {
        return 1;
    }

    expectedVoid();
});

addTest("expectedInputString2", () => {
    expectedInputString = (expected: String) => {

    };
    expectedInputString(1);
});

addTest("expectedOutputString2", () => {
    expectedOutputString = (): String => {
        return 1
    };
    expectedOutputString();
});

addTest("expectedVoid2", () => {
    expectedVoid = (): void => {
        return 1
    };
    expectedVoid();
});

addTest("Expected with classes", () => {
    class Expected {
        expectedInputString = function (expected: String) {
        };

        expectedOutputString = function (): String {
            return 1;
        };

        expectedVoid = function (): void {
            return 1;
        };

        invokeExpectedInputString = function () {
            this.expectedInputString();
        }
    }

    const elem = new Expected();
    elem.expectedInputString(1);
    elem.expectedOutputString();
    elem.expectedVoid()
    elem.invokeExpectedInputString();
});

addTest("ExpectedAsFunction", function ExpectedAsFunction() {
    const expectedInputString = function (expected: String) {
    };

    const expectedOutputString = function (): String {
        return 1;
    };

    const expectedVoid = function (): void {
        return 1;
    };

    expectedInputString(1);
    expectedOutputString(1);
    expectedVoid();
});

