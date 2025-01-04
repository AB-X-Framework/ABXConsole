class Influencer extends ABMAgent {
    setup(size:Number,speed:Number){
        this.shape = "delta";
        this.size =size;
        this.setRandomLocation();
        this.rotateDeg(random(360));
        this.color = namedColor("red");
    }
    step(): void {
        this.rotateDeg(random(1));
        this.fw(2);
    }
}

class Follower extends ABMAgent {
    setup(size:Number,speed:Number){
        this.shape = "delta";
        this.size =size;
        this.setRandomLocation();
        this.rotateDeg(random(360));
        this.color = namedColor("green");
    }
    step(): void {
        this.dropAllRelations();
        const nearestAgent = this.nearestAgent(Influencer);
        if (nearestAgent!==null){
            this.face(nearestAgent);
            this.fw(1);
            const rel= this.createRelation("Following",nearestAgent);
            rel.visible = true;
            rel.label="Following";
        }else {
            this.setDirDeg(random(360));
            this.fw(1);
        }
    }
}
class FEnv extends ABMEnv{
    setup(specs):void{
        this.patches().each((patch:ABMPatch) =>{
            if ((patch.xValue+patch.yValue)%2===0){
                patch.color=namedColor("gray");
            }else{
                patch.color=namedColor("darkGray");
            }
        });
        for (let i = 0; i < specs.influencers;++i){
            this.spawn(Influencer).setup(specs.agentSize,specs.speed);
        }
        for (let i = 0; i < specs.followers;++i){
            this.follower = this.spawn(Follower);
            this.follower.setup(specs.agentSize,specs.speed/3);
        }
    }
}

