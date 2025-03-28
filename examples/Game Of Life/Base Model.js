/**
 * This example just defined the baseline mode
 * Large Grid and Small Grid are 2 possible configuration
 */
class GOLPatch extends ABMPatch {
    static deathColor = namedColor("black");
    static aliveColor = namedColor("white");


    alive;
    toBe;
    neighbors;

    constructor(env: GOLEnv, x: Number, y: Number) {
        super(env, x, y);
        this.alive = 0;
        this.color = GOLPatch.deathColor;
    }

    setup(): void {
        this.neighbors = arrayToList(this.moore(1));
    }

    step(): void {
        this.sum = 0;
        this.neighbors.each((patch: GOLPatch): Number => this.sum += patch.alive);
        this.toBe = (this.sum == 2 || this.sum == 3)?1:0;
    }

    update(): void {
        this.alive = this.toBe;
        this.color = this.alive ? GOLPatch.aliveColor : GOLPatch.deathColor;
    }

    setAlive(): void {
        this.alive = 1;
        this.color = GOLPatch.aliveColor;
    }

}

class GOLEnv extends ABMEnv {
    totalPatches;
    constructor() {
        super(GOLPatch);
    }

    setup(specs: Object) {
        this.patches().some(specs.aliveCount).each(patch => patch.setAlive());
        this.patches().each(patch=>patch.setup());
        this.totalPatches = this.patches().size();
        println("Setup done");
    }

    step(): void {
        this.patches().each((patch: GOLPatch) => patch.step())
            .each((patch: GOLPatch) => patch.update());
    }
}
