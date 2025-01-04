/**
 * Walking some steps leaving a path
 */
class WalkingAgent extends ABMAgent{
    setup(){
        this.counter = 0;
        this.aliveStrokeSteps = 100;
        this.color = namedColor("green");
        this.pen.width=3;
        this.size=4;
        this.penDown();
        this.shape = "delta";
        this.color = this.pen.color =rgbColor(
            randomInt(226)+30,
            randomInt(226)+30,
            randomInt(226)+30);
        this.setRandomPatch();
    }
    step(){
        this.rotateDeg(12-random(24));
        this.fw(1);
    }
}
const env = new ABMEnv();
env.setup = function (specs: Object) {
    this.patches().each((patch:ABMPatch) =>{
        if ((patch.xValue+patch.yValue)%2===0){
            patch.color=namedColor("black");
        }else{
            patch.color=namedColor("darkGray");
        }
    });
    for (let i = 10; i >= 0; --i) {
        this.spawn(WalkingAgent).setup();
    }

}
env.step =()=>sleep(10);
env.setupEnv({w: 180, h: 150, gridType: "torus"});
setEnv(env);
setScale(5);
