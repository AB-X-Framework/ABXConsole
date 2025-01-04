/**
 * Drawing a label next to the agent
 */
class LabelAgent extends ABMAgent{
    setup(){
        this.counter = 0;
        this.aliveStrokeSteps = 100;
        this.color = namedColor("green");
        this.shape = "delta";
        this.size = 1.5;
    }
    step(){
        this.label = "Step "+this.env.currStep;
        if (this.counter === 6){
            this.color = rgbColor(
                randomInt(256),
                randomInt(256),
                randomInt(256));
            this.counter=0;
        }else {
            ++this.counter;
        }
        this.rotateDeg(random(25));
        this.fw(2);
    }
}
const env = new ABMEnv();
env.setup = function (specs: Object) {
    this.patches().each((patch: ABMPatch): void => {
        patch.color = namedColor("black");
    });
    for (let i = 0; i < 5;++i) {
        this.spawn(LabelAgent).setup();
    }
}
env.step =()=>sleep(10);
env.setupEnv({w: 30, h: 30, gridType: "torus"});
setEnv(env);
setScale(20);
