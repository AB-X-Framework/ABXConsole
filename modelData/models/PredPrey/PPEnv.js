include("{script}/Rabbit.js");
include("{script}/Wolf.js");

class PPEnv extends ABMEnv{
    maxSteps;
    
    setup (specs: Object):void {
        this.maxSteps= specs.maxSteps;
        for (let i = 0;i< specs.rabbits;++i){
            this.spawn(Rabbit).first();
        }
        for (let i = 0;i< specs.wolves;++i){
            this.spawn(Wolf).first();
        }
        const black = namedColor("black");
        this.patches().each((patch: ABMPatch) => patch.color = black);
        
        
                
        const aliveChart =  this.addTimeChart("Alive agents", {
            "Rabbits":(env:PPEnv):Number=>  env.agentSet[Rabbit].size(),
            "Wolves":(env:PPEnv):Number=>  env.agentSet[Wolf].size()
        }).setYAxis("Count").setYLimits(0).setXLimits(0,1000,100);
        aliveChart.getSeries("Rabbits").setColor(namedColor("yellow"));
        aliveChart.getSeries("Wolves").setColor(namedColor("red"));
        
        
        const percentage =  this.addTimeChart("Agent Percentage", {
            "Rabbits":(env:PPEnv):Number=>  (env.agentSet[Rabbit].size()*100)/env.agentSet[ABMAgent].size(),
            "Wolves":(env:PPEnv):Number=>  (env.agentSet[Wolf].size()*100)/env.agentSet[ABMAgent].size()
        }).setYAxis("%").setYLimits(0).setXLimits(0,1000,100).setType("bar").setStacked(true);
        percentage.getSeries("Rabbits").setColor(namedColor("yellow"));
        percentage.getSeries("Wolves").setColor(namedColor("red"));
    }
    
    
    step(){
        //println(tick());
        if (this.currStep === this.maxSteps){
            this.complete = true;
        }
        
        
    }
        
}