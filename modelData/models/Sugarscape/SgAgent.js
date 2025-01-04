/**
 * The agent specification
 */
include("{script}/SgPatch.js");

class SgAgent extends ABMAgent {
    static MaxEnergyMean = 0.9;
    static MaxEnergyStdDev = 0.1;
    static MetabolismMean = 0.2;
    static MetabolismStdDev = 0.01;
    static RangeMean = 10;
    static RangeStdDev = 1;
    static MateNeedGrowRateMean=0.1;
    static MateNeedGrowRateStdDev=0.01;
    static MaxDeathProability=0.1;
    static NaturalDeathProbabilityMean=0.01;
    static NaturalDeathProbabilityStdDev=0.001;
    
    /**
     * Final values
     */
    maxEnergy;
    metabolism;
    range;
    mateNeedGrowRate;
    naturalDeathProbability;
    
    /**
     * Variable values
     */
    currEnergy;
    mateNeed;
    
    defaultSetup(){
        this.size = 1.2;
        this.mateNeed = 0;
    }
    
    initialAgentStatus():void{
        this.defaultSetup();
        this.setRandomLocation();
        
        this.maxEnergy=checkBoundaries(
            randomNormal(SgAgent.MaxEnergyMean,SgAgent.MaxEnergyStdDev));
            
        this.metabolism=checkBoundaries(
            randomNormal(SgAgent.MetabolismMean,SgAgent.MetabolismStdDev));
            
        this.range=randomNormal(SgAgent.RangeMean,SgAgent.RangeStdDev);
        
        this.mateNeedGrowRate=checkBoundaries(
            randomNormal(SgAgent.MateNeedGrowRateMean,
            SgAgent.MateNeedGrowRateStdDev));
            
        this.naturalDeathProbability=checkBoundaries(
            randomNormal(
                SgAgent.NaturalDeathProbabilityMean,
                SgAgent.NaturalDeathProbabilityStdDev),
            SgAgent.MaxDeathProability);
        
        this.currEnergy=this.maxEnergy;
    }
    
    statusFromParents(mother: SgFemale, father:SgMale):SgAgent{
        const geneLotto=(value)=>{
            const lottoMother = random();
            const lottoFather = 1-lottoMother;
            return mother[value]*lottoMother+father[value]*lottoFather;
        }
        this.defaultSetup();
        this.maxEnergy = geneLotto("maxEnergy");
        this.metabolism = geneLotto("metabolism");
        this.range = geneLotto("range");
        this.mateNeedGrowRate = geneLotto("mateNeedGrowRate");
        this.naturalDeathProbability = geneLotto("naturalDeathProbability");
        this.currEnergy=mother.currEnergy;
        return this;
    }
    
    findBestPatch():SgPatch{
        return arrayToList(this.patchesInRadius(this.range)).best("currEnergy");
    }
    
    eatPatch(patch:SgPatch):void{
        const foodToEat = Math.min(
            this.maxEnergy-this.currEnergy,patch.currEnergy);
        patch.eatFromPatch(foodToEat);
        this.currEnergy += foodToEat;
    }
    
    gotoFood(): void{
        const bestPatch = this.findBestPatch();
        this.setLocation(bestPatch);
        this.eatPatch(bestPatch);
    }
    
    doMetabolism(): void{
        this.currEnergy -= this.metabolism;
        if (this.currEnergy <= 0){
            this.die();
            return;
        } 
        if (this.naturalDeathProbability > random()){
            this.die();
            return;
        }
        this.mateNeed  = checkBoundaries(this.mateNeed+this.mateNeedGrowRate);
    }
    
    /**
     * Mate decision which is used for both males and females, but in different ways. 
     * The mate decision threshold is based on the amount of stored energy 
     *    ie. (Curr-Energy / Metabolism ) and the Mate-need value. 
     * The probability to chose mating grows with the  mate-need and stored energy.
     */
    needsMate(){
        return this.mateNeed > random();
    }
    
}

class SgMale extends SgAgent {
    static agentColor = namedColor("blue");
    
    
    setup():void{
        this.initialAgentStatus();
        this.color = SgMale.agentColor;
    }
    
    /**
     * Looks for a female mate
     */
    lookForMate():SgFemale|null{
        //Chooses one randomly from the list
        return arrayToList(this.agentsInRadius(this.range,SgFemale)).one();
    }
    
    step():void{
        if (this.needsMate()){
            const foundFemale = this.lookForMate();
            if (foundFemale === null){//Mate not found
                this.fw(this.range);
                this.eatPatch(this.patchOf());
                this.mateNeed /= 2;
            }else {//Mate found
                this.setLocation(foundFemale.patchOf());
                if (foundFemale.confirmMate(this)){
                    this.mateNeed = 0;
                }else {
                    this.mateNeed /= 2;
                    this.eatPatch(this.patchOf());
                }
            }
        } else {
            this.gotoFood();
        }
        this.doMetabolism();
    }
    
}

class SgFemale extends SgAgent {
    static agentColor = namedColor("red");
    setup():void{
        this.initialAgentStatus();
        this.color = SgFemale.agentColor;
    }
    
    confirmMate( prospectParent:SgMale):Boolean{
        if (this.needsMate()){
            this.mateNeed = 0;
            let offprint;
            if (random()>0.5){
                this.hatch(SgFemale).statusFromParents(this,prospectParent).
                    color = SgFemale.agentColor;
            }else {
                this.hatch(SgMale).statusFromParents(this,prospectParent).
                    color = SgMale.agentColor;
            }
            return true;
        }else {
            return false;
        }
    }
    
    step():void{
        this.gotoFood();
        this.doMetabolism();
    }
}