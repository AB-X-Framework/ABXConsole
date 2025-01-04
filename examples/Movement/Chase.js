const env =new ABMEnv();
const  darkOrange=namedColor("orange").darker();
env.setup = function(specs: Object) {
    this.rounds = 0;
    this.patches().each((patch:ABMPatch):void=>{
        if ((patch.xValue+patch.yValue)%2===0){
            patch.color=namedColor("gray");
        }else{
            patch.color=darkOrange;
        }
    });

    this.choosenPatch=this.patches().one(true);
    this.choosenPatch.color = namedColor("black");
};

env.step=function(){
    if (this.rounds>20){
        this.rounds=0;
        if ((this.choosenPatch.xValue+this.choosenPatch.yValue)%2===0){
            this.choosenPatch.color=namedColor("gray");
        }else{
            this.choosenPatch.color=darkOrange;
        }

        this.choosenPatch=this.patches().one(true);
        this.choosenPatch.color = namedColor("black");
    }else {
        ++this.rounds;
    }
}

env.setupEnv( {w: 40, h: 30, gridType:"torus",seamless:true});
const agent = env.spawn(ABMAgent);
agent.color =  namedColor("green").darker();
agent.shape = "delta";
agent.size = 1.5
agent.setLocation(env.patches().one(true));
agent.step = function(){
    this.dropAllRelations();
    const rel = this.createRelation("chasing",this.env.choosenPatch);
    rel.visible = true;
    rel.label = "Chasing";
    this.face(this.env.choosenPatch);
    this.fw(.5);
    sleep(50)
}
setEnv(env);
setScale(20);
