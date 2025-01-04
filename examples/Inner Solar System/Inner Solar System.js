enableSIDistance(true);
enableSIAngle(true);
enableSITime(true);
let systemSize=500*Gm;

class Planet extends ABMAgent{
    setup(label:String, dist:UnitSystem,size:Number,
          angularVelocity:UnitSystem, color):Planet{
        this.label = label;
        this.setLocation(systemSize/2+dist,systemSize/2);
        this.angularVelocity = angularVelocity;
        this.size = size;
        this.color = color;
        this.penDown();
        return this;
    }

    rotate(sun:Star, time:UnitSystem){
        const angle = this.angularVelocity*time;
        this.rotateAround(sun,angle)
    }
}

class Star extends ABMAgent{
    setup(label){
        this.size =14;
        this.color = namedColor("yellow");
        this.label = label
        this.setLocation(systemSize/2,systemSize/2);
        return this;
    }

    starStep(delta:UnitSystem){
        for (const planetRelation of this.getRelationsList("planet")){
            const planet = planetRelation.dest;
            planet.rotate(this,delta);
        }
    }
}


class Space extends ABMEnv {
    sun;
    setup(){
        this.patches().each(patch=>patch.color=namedColor("black"));
        this.sun = this.spawn(Star).setup("Sun");
        const fullCircle = 360*deg;
        this.sun.createRelation("planet", this.mercury = this.spawn(Planet).
        setup("Mercury", 52.2*Gm,2,fullCircle/(88*day),namedColor("gray")));
        this.sun.createRelation("planet", this.venus = this.spawn(Planet).
        setup("Venus", 107*Gm,5,fullCircle/(225*day),namedColor("cyan")));
        this.sun.createRelation("planet", this.venus = this.spawn(Planet).
        setup("Earth", AU,5,fullCircle/(365*day),namedColor("blue")));
        this.sun.createRelation("planet", this.mars = this.spawn(Planet).
        setup("Mars", 208*Gm,3,fullCircle/(687*day),namedColor("red")));
    }

    step(delta:UnitSystem){
        this.sun.starStep(delta);
    }
}


space = new Space().setupEnv({w:systemSize,h:systemSize,"delta":day})
setEnv(space);
setScale(2)