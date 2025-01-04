/**
 * Wolf implementation of the PredPrey
 */
 class Wolf extends ABMAgent {
    static color = namedColor("red")
    static maxTTL = 10;
    ttl;
    
    first(){
        this.setRandomLocation();
        this.setup();
    }
    
    setup(){
        this.shape = "delta";
        this.size = 8;
        this.color = Wolf.color;
        this.ttl = Wolf.maxTTL;
    }
    
    step(){
        this.dropRelations();
        const rabbit = this.nearestAgent(Rabbit, ViewDistance);
        
        if (rabbit === null){
            this.setDirDeg(random(360));
            this.fw(WalkingDistance);
            --this.ttl;
        }else {
            const dist = this.distanceTo(rabbit);
            if (dist<=WalkingDistance){
                this.setLocation(rabbit);
                rabbit.die();
                this.hatch(Wolf).setup();
                this.ttl = Wolf.maxTTL;
            }else {
                this.face(rabbit);
                this.fw(WalkingDistance);
                --this.ttl;
            }
        }
        if (this.ttl === 0){
            this.die();
        }
        
    }
}
