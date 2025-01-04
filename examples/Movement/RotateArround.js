/**
 * Walking some steps leaving a path
 */
class RotatingAgent extends ABMAgent {

    setup(rotateAgent: Boolean) {
        this.size=1.7;
        this.rot=rotateAgent;
        this.counter = 0;
        let x;
        if (rotateAgent){
            x=4;
            this.color = namedColor("green");
        }else {
            x=1;
            this.color = namedColor("blue");
        }
        this.setLocation(x,10)
        this.aliveStrokeSteps = 100;
        this.pen.width = 3;
        this.penDown();
        this.shape="delta";
    }

    step() {
        ++this.counter;
        //Rotates around a patch or agent
        this.rotateAround(this.patchAt(10,10),10,this.rot);

    }
}

const env = new ABMEnv();
env.setup = function (specs: Object) {
    this.patches().each((patch: ABMPatch): void => {
        patch.color = namedColor("black");
    });
    this.patchAt(10,9).color = namedColor("white")
    this.spawn(RotatingAgent).setup(true);
    this.spawn(RotatingAgent).setup(false);
}
env.step = () => sleep(10);
env.setupEnv({w: 20, h: 20 , gridType: "plane"});
setEnv(env);
setScale(20);
