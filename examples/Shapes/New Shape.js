/**
 * Reading shape from CSV
 * Then changing from String to number
 */
const csv = toCSV(readString("{script}/Arrow.csv"));
for (const row of csv){
    const length = row.length;
    for (let i = 0; i<length; ++i){
        row[i]=parseFloat(row[i]);
    }
}
println(csv)
addShape("arrow",csv);

class ArrowAgent extends ABMAgent{
    setup() {
        this.color =  namedColor("green").darker();
        this.size =3;
        this.shape = "arrow";
        this.counter = 0;
        this.setLocation(5,5);
        this.step = function(){
            if (this.counter === 50){
                this.rotateDeg(15);
                this.counter=0;
            }else {
                ++this.counter;
            }
            this.fw(0.2);
        };
    }
}

const env =new ABMEnv();
env.setup = function() {
    this.patches().each((patch:ABMPatch):void=>{
        if ((patch.xValue+patch.yValue)%2===0){
            patch.color=namedColor("white");
        }else{
            patch.color=namedColor("red");
        }
    });
    env.spawn(ArrowAgent).setup();
};
env.step =()=>sleep(30);
env.setupEnv( {w: 10, h: 10, gridType:"torus",seamless:true});
setEnv(env);
setScale(20);
