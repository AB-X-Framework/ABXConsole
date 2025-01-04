/**
 * Groowing select of moore neighbors
 * Ends after30 selections
 */
class VonNeumannEnv extends ABMEnv {
    level;
    chosenOne;
    max;
    green;
    black;
    setup(specs: Object) {
        this.chosenOne = this.patches().one(true);
        this.green = namedColor("green");
        this.black = namedColor("black");
        this.level = 0;
        this.max=specs.max;
    }

    step(){
        this.patches().each(
            (patch)=>patch.color=this.black);
        const self = this.level%2===0;
        // This example self indicate if vonNewman should choose self
        this.chosenOne.eachVonNewman(this.level, (patch) => {
            patch.color =this.green;
        },self);
        ++this.level;
        if (this.level === this.max){
            this.complete = true;
        }
    }
}