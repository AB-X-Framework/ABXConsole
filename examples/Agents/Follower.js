const env = new ABMEnv();

class RelAgent extends ABMAgent{
    setup():RelAgent{
        this.color =  this.color = rgbColor(
            randomInt(256),
            randomInt(256),
            randomInt(256));
        return this;
    }
    step(){
        this.rotateDeg(random(25));
        this.fw(2);
    }
}
env.setup = function (): void {
    this.patches().each((patch: ABMPatch): void => {
        if ((patch.xValue + patch.yValue) % 2 === 0) {
            patch.color = namedColor("gray");
        } else {
            patch.color = namedColor("pink");
        }
    });
    this.follower = this.spawn(RelAgent).setup();
    this.follower.label="Follower";
    this.follower.setRandomLocation()
    this.leader = this.spawn(RelAgent).setup();
    this.leader.label="Leader";
    this.leader.setRandomLocation();
    const rel =this.follower.createRelation("follows",this.leader);
    rel.visible=true;
    rel.label="Follows"
}

env.setupEnv({w: 30, h: 20, gridType: "torus"});
setEnv(env);
setScale(20);
