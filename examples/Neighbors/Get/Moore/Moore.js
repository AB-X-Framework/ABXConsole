/**
 * Groowing select of moore neighbors
 * Ends after30 selections
 */
class MooreEnv extends ABMEnv {
    level;
    chooseOne;
    green;
    black;
    max;
    setup(specs: Object) {
        this.chooseOne = this.patches().one(true);
        this.level = 0;
        this.green = namedColor("green");
        this.black = namedColor("black");
        this.max = specs.max;
    }

    step(){
        this.patches().each(
            (patch)=>patch.color=this.black);
        const self = this.level%2==0;
        // This example self indicate if moore should choose self
        const moore = this.chooseOne.moore(this.level, self);
        for (const patch of moore){
            patch.color=this.green;
        }
        ++this.level;
        if (this.level === this.max){
            this.complete = true;
        }
    }
}