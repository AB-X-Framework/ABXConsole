/**
 * Groowing select of moore neighbors
 * Ends after30 selections
 */
class MooreEnv extends ABMEnv {
    level;
    chosenOne;
    setup(specs: Object) {
        this.chosenOne = this.patches().one(true);
        this.level = 0;
    }

    step(){
        this.patches().each(
            (patch)=>patch.color=namedColor("black"));
        // The edge for moore
        this.chosenOne.eachMooreEdge(this.level, (patch)=>{
            patch.color=namedColor("green");
        });
        ++this.level;
        if (this.level === 45){
            this.complete = true;
        }
    }
}