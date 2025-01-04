/**
 * Rabbit implementation of the PredPrey
 */
const ViewDistance = 20;
const WalkingDistance = ViewDistance/2;
class Rabbit extends ABMAgent {
    static maxIntensity = 1;
    static maxRot = π/8;
    static TimeToBreed = 15;
    static color = namedColor("yellow");
    
    desiredForce;
    breedCounter;
    
    first(layer):Rabbit{
        this.setup();
        this.setRandomLocation();
        return this;
    }
    
    flockPersonalForce(){
        let flock = 0;
        let personal = 0;
        this.eachAgentInRadius(ViewDistance,(rabbit:Rabbit):void=>{
            const vec  = this.vectorTo(rabbit);
            flock += vec;
            personal += vec/-40;
            
        }, Rabbit);
        return [flock, personal];
    }
    
    fearForce(){
        let fear = 0;
        this.eachAgentInRadius(ViewDistance,(wolf:Wolf):void=>{
            const vec  = this.vectorTo(wolf);
            fear += vec.withMag(-200);
        }, Wolf);
        return fear;
    }
    
    setup(){
        this.breedCounter = 0;
        this.shape = "delta";
        this.size = 4;
        this.color = Rabbit.color;
        this.desiredForce = Polar(random(Rabbit.maxIntensity), random(2*π));
    }
    
    step(){
        if (this.breedCounter === Rabbit.TimeToBreed){
            this.hatch().setup();
            this.breedCounter = 0;
        }else {
            ++this.breedCounter;
        }
        let force = 0;
        force +=this.desiredForce;
        const [flock,personal]= this.flockPersonalForce();
        force += flock;
        force += personal;
        force += this.fearForce();
        force = force.withMaxMag(Rabbit.maxIntensity);
    
        const dist = force* WalkingDistance;
        this.desiredForce = this.desiredForce.rotateRad(
            random(-Rabbit.maxRot,Rabbit.maxRot));
        this.walk(dist);
    }
}