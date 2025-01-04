/**
 * Groowing select of moore neighbors
 * Ends after30 selections
 */
class MooreEnv extends ABMEnv {
    level;
    chooseOne;
    setup(specs: Object) {
        this.chooseOne = this.patches().one(true);
        this.level = 0;
    }

    step(){
        this.patches().each(
            (patch)=>patch.color=namedColor("black"));
        // The edge for moore
        for (const patch of this.chooseOne.mooreEdge(this.level)){
            patch.color=namedColor("green");
        }
        ++this.level;
        if (this.level === 45){
            this.complete = true;
        }
    }
}