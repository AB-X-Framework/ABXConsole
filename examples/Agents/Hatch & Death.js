class KillableAgent extends ABMAgent {
    counter;

    setup() {
        this.counter = 0;
        this.size = 0.1;
        this.color = rgbColor(
            randomInt(256),
            randomInt(256),
            randomInt(256));
        this.shape = KnownShapes().one(true);
        this.setDirDeg(randomInt(-180, 180));
        this.setRandomLocation();
    }

    fromParent(parent: ABMAgent): void {
        this.size = 0.1;
        this.counter = 0;
        this.shape = parent.shape;
        this.color = parent.color;
        this.dir = parent.dir;
    }

    step(): void {
        if (this.counter > 20) {
            this.counter = 0;
            if (random() > 0.5) {
                this.die();
            } else {
                this.hatch().fromParent(this);
                this.setDirDeg(randomInt(-180, 180));
            }
        } else {
            ++this.counter;
            this.size+=0.01;
            this.fw(0.3);
        }
    }
}

const env = new ABMEnv();
env.setup = function (specs: Object) {
    this.patches().each((patch: ABMPatch): void => {
        if ((patch.xValue + patch.yValue) % 2 === 0) {
            patch.color = namedColor("gray");
        } else {
            patch.color = namedColor("pink");
        }
    });
    for (let i = 0; i < 100; ++i) {
        this.spawn(KillableAgent).setup();
    }
    this.addTimeChart("Alive", {
        "alive": (env: ABMEnv): Number => {
            return env.agents().size();
        }
    });
}
env.step=()=>sleep(50);
env.setupEnv({w: 30, h: 20, gridType: "torus"});
setEnv(env);
setScale(20);
