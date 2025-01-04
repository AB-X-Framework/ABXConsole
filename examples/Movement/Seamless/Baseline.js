/**
 * Baseline for seamless testing
 */
class SimpleAgent extends ABMAgent{
    setup() {
        this.color =  namedColor("green").darker();
        this.size = 0.8
        this.counter = 0;
        this.setLocation(1,1);
        this.setDirDeg(-45);
        this.step = function(){
            if (this.counter == 200){
                this.rotateDeg(45);
                this.counter=0;
            }else {
                ++this.counter;
            }
            this.fw(0.05);
        };
    }


}

const env =new ABMEnv();
env.setup = function(specs: Object) {
    this.patches().each((patch:ABMPatch):void=>{
        if ((patch.xValue+patch.yValue)%2===0){
            patch.color=namedColor("white");
        }else{
            patch.color=namedColor("red");
        }
    });
    env.spawn(SimpleAgent).setup();
};


