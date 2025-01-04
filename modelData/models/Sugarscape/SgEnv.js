/**
 * The full environment
 */
include("{script}/SgAgent.js");

class SgEnv extends ABMEnv{
    maxSteps;
    
    constructor() {
        super(SgPatch);
    }
    
    setup (specs: Object):void {
        this.maxSteps= specs.maxSteps;
        for (let i = 0;i< specs.females;++i){
            this.spawn(SgFemale).setup();
        }
        for (let i = 0;i< specs.males;++i){
            this.spawn(SgMale).setup();
        }
        
        const aliveChart =  this.addTimeChart("Alive agents", {
            "Total":(env:SgEnv):Number=>  env.agentSet[SgAgent].size(),
            "Males":(env:SgEnv):Number=>  env.agentSet[SgMale].size(),
            "Females":(env:SgEnv):Number=>  env.agentSet[SgFemale].size()
        }).setYAxis("Count").setYLimits(0).setXLimits(0,500,50);
        
        aliveChart.getSeries("Total").setColor(namedColor("black"));
        aliveChart.getSeries("Males").setColor(namedColor("blue"));
        aliveChart.getSeries("Females").setColor(namedColor("red"));
        
        const agentEnergy =  this.addTimeChart("Avg Agent Energy", {
            "Avg Energy":(env:SgEnv):Number=>  env.agentSet[SgAgent].avg("currEnergy")
        }).setYAxis("Energy").setYLimits(0).setXLimits(0,500,50);;
        agentEnergy.getSeries("Avg Energy").setColor(namedColor("black"));
        
        const patchEnergy =  this.addTimeChart("Patch Energy", {
            "Avg Energy":(env:SgEnv):Number=>  {
                let energy = 0;
                env.patches().each((patch)=>{
                    energy += patch.currEnergy;
                });
                return energy/env.patches().size();
            }
        }).setYAxis("Energy").setYLimits(0).setXLimits(0,500,50);;
        patchEnergy.getSeries("Avg Energy").setColor(namedColor("green").darker());
        
    };

    step (specs: Object):void {
        this.patches().each((patch: SgPatch) => patch.step());
        if (this.currStep === this.maxSteps){
            this.complete = true;
        }
    };
}