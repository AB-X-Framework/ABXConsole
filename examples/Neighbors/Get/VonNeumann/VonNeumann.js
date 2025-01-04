/**
 * Groowing select of moore neighbors
 * Ends after30 selections
 */
class VonNeumannEnv extends ABMEnv {
    level;
    chooseOne;
    max;
    green;
    black;
    setup(specs: Object) {
        this.chooseOne = this.patches().one(true);
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
        for (const patch of  this.chooseOne.vonNewman(this.level, self)) {
            patch.color =this.green;
        }
        ++this.level;
        if (this.level === this.max){
            this.complete = true;
        }
    }
}