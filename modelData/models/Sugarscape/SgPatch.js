/**
 * Utilitarian classes
 */
 
checkBoundaries=(value:Number,max?:Number):Number =>{
    if (max === undefined){
        return Math.max(0, Math.min(1, value));  
    }else {
        return Math.max(0, Math.min(max, value)); 
    }
} 
    
/**
 * Describes the sugarscape patch
 */

class SgPatch extends ABMPatch {
    static black=namedColor("black");
    
    static MaxEnergyMean = 0.8;
    static MaxEnergyStdDev = 0.1;
    static GrowRateMean = 0.04;
    static GrowRateStdDev = 0.001;
    
    maxEnergy
    currEnergy;
    growRate;

    constructor(env: SgEnv, x: Number, y: Number) {
        super(env, x, y);
        this.maxEnergy = checkBoundaries(
            randomNormal(SgPatch.MaxEnergyMean, SgPatch.MaxEnergyStdDev));
        this.currEnergy = this.maxEnergy;
        this.growRate = checkBoundaries(
            randomNormal(SgPatch.GrowRateMean, SgPatch.GrowRateStdDev));
        this.color = rgbColor(0,Math.floor(this.currEnergy*255),0);
        
    }


    eatFromPatch(energy:Number): void {
        this.currEnergy -= energy;
    }

    step(): void {
        this.currEnergy = 
            checkBoundaries(this.currEnergy+this.growRate,this.maxEnergy);
        this.color = rgbColor(0,Math.floor(this.currEnergy*255),0);
    }

}