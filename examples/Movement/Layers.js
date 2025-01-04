/*As SI distance is enabled m is for meter
*/
enableSIDistance(true);

class TestAgent extends ABMAgent {
    counter;
    setup(type: String){
        //true is to shuffle
        this.setLocation(this.patches().one(true));
        this.size = 1.1;
        this.counter = 0;
        switch (type){
            //Move to nearby patch
            case "red":{
               this.shape="triangle";    
               this.layer = "red";
               this.color = namedColor("red");
               break;
            }
            //Choose destination and then move
            case "green":{
               this.shape="delta";    
               this.layer = "green";
               this.color = namedColor("green");
               break;
            }
            //Choose destination and then move
            case "blue":{
               this.shape="delta";    
               this.layer = "blue";
               this.color = namedColor("blue");
               break;
            }
        }
         this.setDirDeg(randomInt(0,360));
    }
    
    step(){
        if (this.counter ===10){
            this.counter = 0;
            this.rotateDeg(randomInt(0,10));
        }else{
            ++this.counter;
            this.fw(random(0.3)*m);
        }
    }
}


const env =new ABMEnv();
env.setup = function(specs: Object) {
    this.patches().each((patch:ABMPatch):void=>{
        if ((patch.xValue+patch.yValue)%2===0){
            patch.color=namedColor("gray");
        }else{
            patch.color=namedColor("pink").brighter();
        }
    });
    for (let i = 0; i< 100;++i){
        this.spawn(TestAgent).setup("red");
        this.spawn(TestAgent).setup("green");
        this.spawn(TestAgent).setup("blue");
    }
};

env.setupEnv( {w: 60*m, h: 30*m, gridType:"torus",layers:['red','green','blue']});
setEnv(env);
setScale(20);
