/**
 * This example is just throwing a lots of agents
 * As SI distance is enabled m is for meter
 */
class TestAgent extends ABMAgent {
    type;
    setup(type: String){
        //true is to shuffle
        this.setLocation(this.patches().one(true))
        this.color = rgbColor(
            randomInt(256),
            randomInt(256),
            randomInt(256));
        this.type = type;
        this.size = Math.max(0.2,randomNormal(1.1));
        if (type.includes("Forward")){
            this.shape="triangle";
        }
        if (type.includes("forward")){
            this.shape="delta"
            this.counter =0;
            this.rotateDeg(45);
        }
    }

    step(){
        switch(this.type){
            case "patchForward":{
                const xyData = this.xy();
                const patch = this.patchAt(xyData.x+random(),xyData.y+random());
                this.moveTo(patch);
                break;
            }
            case "patchBackward":{
                const xyData = this.xy();
                const patch = this.patchAt(xyData.x-random(),xyData.y-random());
                this.moveTo(patch);
                break;
            }
            case "moveForward":{
                const xyData = this.xy();
                this.moveTo(xyData.x+random(),xyData.y+random());
                break;
            }
            case "moveBackward":{
                const xyData = this.xy();
                this.moveTo(xyData.x-random(),xyData.y-random());
                break;
            }
            case "forward":{
                if (this.counter ===10){
                    this.counter = 0;
                    this.rotateDeg(randomInt(0,360));
                }else{
                    ++this.counter;
                    this.fw(0.3);
                }
                break;
            }
        }
    }
}


class TestEnv extends ABMEnv {
    setup (specs: Object) {
        this.patches().each((patch: ABMPatch): void => {
            if ((patch.xValue + patch.yValue) % 2 === 0) {
                patch.color = namedColor("lightGray");
            } else {
                patch.color = namedColor("pink");
            }
        });
        for (let i = 0; i < specs.agents; ++i) {
            this.spawn(TestAgent).setup("patchForward");
            this.spawn(TestAgent).setup("patchBackward");
            this.spawn(TestAgent).setup("moveForward");
            this.spawn(TestAgent).setup("moveBackward");
            this.spawn(TestAgent).setup("forward");
        }
    }
}
