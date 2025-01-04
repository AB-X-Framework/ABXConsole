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
        this.toBe = (this.sum === 2 || this.sum === 3)?1:0;
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
    alive;
    alivePercentage;
    death;
    deathPercentage;
    constructor() {
        super(GOLPatch);
    }

    calculate():void{
        this.alive =  this.patches().toBag("alive").sum();
        this.death = this.totalPatches - this.alive;
        this.alivePercentage = (this.alive*100)/this.totalPatches;
        this.deathPercentage = (this.death*100)/this.totalPatches;
    }

    /**
     * Creates 3 charts
     * @param specs
     */
    setup(specs: Object) {
        this.patches().some(specs.aliveCount).each(patch => patch.setAlive());
        this.patches().each(patch=>patch.setup());
        this.totalPatches = this.patches().size();

        /**
         * Creates a chart
         * @type {ABMTimeChart}
         */
        const aliveChart =  this.addTimeChart("Alive count", {
            "Alive":(env:GOLEnv):Number=>  env.alive
        }).setYAxis("Count");
        aliveChart.addSeries( "Death", (env:GOLEnv):Number=> env.death).
        setColor(namedColor("red"));
        aliveChart.getSeries("Alive").setColor(namedColor("blue"));
        /**
         * Gets chart from name
         */
        this.getChart("Alive count").setYLimits(-100,10000);

        /**
         * Another bar chart
         * @type {ABMTimeChart}
         */
        const tickChart = this.addTimeChart("Step Id",{
            "Curr Step":(env:GOLEnv):Number=>env.currStep
        }).setType("bar");
        tickChart.getSeries("Curr Step").setColor(namedColor("green"));

        /**
         * Stacked bar chart.
         * Note: Stacked will not work with setYLimits
         * @type {ABMTimeChart}
         */
        const livePercentage =  this.addTimeChart("Alive/Death %", {
            "Alive %":(env:GOLEnv):Number=>  env.alivePercentage
        }).setYAxis("%").setType("bar").setStacked(true);
        livePercentage.addSeries( "Death %", (env:GOLEnv):Number=> env.deathPercentage).
        setColor(namedColor("red"));
        livePercentage.getSeries("Alive %").setColor(namedColor("blue"));

        this.calculate();
        println("Setup done");
    }

    step(): void {
        this.patches().each((patch: GOLPatch) => patch.step())
            .each((patch: GOLPatch) => patch.update());
        this.calculate();
    }

}


setEnv(new GOLEnv().setupEnv({w: 60, h: 60, aliveCount: 50, gridType:'torus', delta:1}));
setScale(10);
