/**
 * Groowing select of moore neighbors
 * Ends after30 selections
 */
class MooreEnv extends ABMEnv {
    level;
    chosenOne;
    green;
    black;
    max;

    setup(specs: Object) {
        this.chosenOne = this.patches().one(true);
        this.level = 0;
        this.green = namedColor("green");
        this.black = namedColor("black");
        this.max = specs.max;
    }

    step() {
        this.patches().each(
            (patch) => patch.color = this.black);
        const self = this.level % 2 == 0;
        // This example self indicate if moore should choose self
        this.chosenOne.eachMoore(this.level, (patch) => {
            patch.color = this.green;
        }, self);
        ++this.level;
        if (this.level === this.max) {
            this.complete = true;
        }
    }
}