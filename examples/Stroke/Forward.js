/**
 * Walking some steps leaving a path
 */
class WalkingAgent extends ABMAgent{
    setup(){
        this.counter = 0;
        this.aliveStrokeSteps = 100;
        this.color = namedColor("green");
        this.pen.width=4;
        this.penDown();
        this.shape = "delta";
    }
    step(){
        if (this.counter === 12){
            this.color = this.pen.color =rgbColor(
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
    this.spawn(WalkingAgent).setup();
}
env.step =()=>sleep(10);
env.setupEnv({w: 30, h: 30, gridType: "torus"});
setEnv(env);
setScale(20);
