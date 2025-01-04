/**
 * Set location doesn't leave a stroke
 */
class JumpingAgent extends ABMAgent{
    setup(){
        this.counter = 0;
        this.aliveStrokeSteps = 100;
        this.color = namedColor("green");
        this.pen.width=4;
    }
    step(){
        if (this.counter === 5){
            this.color = this.pen.color =rgbColor(
                randomInt(256),
                randomInt(256),
                randomInt(256));
            this.counter=0;
            this.penUp();
        }else {
            this.penDown();
            ++this.counter;
        }
        //Move to random patch
        this.setLocation(this.patches().one(true));
    }
}
const env = new ABMEnv();
env.setup = function (specs: Object) {
    this.patches().each((patch: ABMPatch): void => {
        patch.color = namedColor("black");
    });
    this.spawn(JumpingAgent).setup();
}
env.step =()=>sleep(10);
//Grid of 30 cm and 25 meters
env.setupEnv({w: 30, h: 25, gridType: "torus"});
setEnv(env);
setScale(20);
