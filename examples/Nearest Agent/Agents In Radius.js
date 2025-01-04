/**
 * Here distancePerRound is in meters but the env is in km.
 * The framework automatically translates from m to km
 */
enableSIDistance(true);
class Wanderer extends ABMAgent {
    distancePerRound;

    static red = namedColor("red");
    static green = namedColor("green");
    setup(distancePerRound:UnitSystem){
        this.size =2;
        this.label = "Hi";
        this.fontStyle= "italic";
        this.setRandomLocation();
        this.rotateDeg(random(45));
        this.distancePerRound=distancePerRound;

    }
    step(): void {
        this.rotateDeg(random(1));
        this.fw(this.distancePerRound);
    }
}

class Center extends ABMAgent {
    radius;

    setup(centerX,centerY){
        //Radius is half of size
        this.size = centerY;
        this.radius=centerY/2;
        this.layer = "center";
        this.setLocation(centerX,centerY);
        this.rotateDeg(random(360));
        this.color = namedColor("yellow");
        this.fontSize=30;
        this.fontName="Serif";
        this.fontStyle = "bold";
        this.step();
    }

    step(): void {
        let count = 0;

        this.env.agentSet[Wanderer].each((agent:Wanderer):void=>{
            agent.color = Wanderer.red;
            agent.layer = "outside";

        });
        this.eachAgentInRadius(this.radius,(agent:Wanderer):void=>{
            ++count;
            agent.color = Wanderer.green;
            agent.layer = "inside";
        },Wanderer);
        this.label = "Inside agents "+count;
    }
}

class InRadiusAMB extends ABMEnv{
    setup(specs) {
        this.patches().each((patch:ABMPatch) =>{
            if ((patch.xValue+patch.yValue)%2===0){
                patch.color=namedColor("gray");
            }else{
                patch.color=namedColor("darkGray");
            }
        });
        for (let i =0 ; i<specs.wanderers;++i){
            this.spawn(Wanderer).setup(specs.distancePerRound);
        }
        this.spawn(Center).setup(specs.w*.4,specs.h/2);
    }
}
const env = new InRadiusAMB();
env.setupEnv({"w":120*km,"h":80*km,"wanderers":15,
    "distancePerRound":1000*m,"layers":["center","inside","outside"],"gridType":"torus"});
setEnv(env);
setScale(7)
