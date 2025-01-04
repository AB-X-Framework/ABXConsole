include("{script}/Agent.js");

class PanEnv extends ABMEnv{
    constructor() {
        super(Agent);
    }
    
    sickCount;
    size;
    trustData;
    
    sickRatio;
    juiceTrustPercentage;
    amuletTrustPercentage;
    maskTrustPercentage;
    
    calcTrust(){
        let juiceTrust=0;
        let amuletTrust =0;
        let maskTrust =0;
        this.patches().each((agent:Agent):void=>{
           juiceTrust+=agent.juiceTrust; 
           amuletTrust+=agent.amuletTrust;
           maskTrust+=agent.maskTrust;
        });
        juiceTrust=100*(juiceTrust/this.size);
        amuletTrust =100*(amuletTrust/this.size);
        maskTrust=100*(maskTrust/this.size);
        
        this.trustData = {
            "juiceTrust":juiceTrust,
            "amuletTrust":amuletTrust,
            "maskTrust":maskTrust
        }
        this.sickRatio.push(100*(this.sickCount/this.size));
        this.juiceTrustPercentage.push(juiceTrust);
        this.amuletTrustPercentage.push(amuletTrust);
        this.maskTrustPercentage.push(amuletTrust);
    }
    
    setup(specs){
        //Init
        this.maxSteps = specs.maxSteps;
        Agent.setInfluencePower(specs.influencerPower/100);
        this.sickCount = 0;
        this.sickRatio=[];
        this.juiceTrustPercentage=[];
        this.amuletTrustPercentage=[];
        this.maskTrustPercentage=[];
        
        //Network
        this. size = specs.w * specs.h;
        const url = `http://localhost:9000/stats?size=${this.size}&influencerCount=${specs.influencerCount}`;
        const client = createHttpClient();
        const content = JSON.parse(client.get(url).asString());
        const agents = [];
        for (let i = 0; i < specs.w;++i){
            for (let j = 0; j < specs.h;++j){
                agents.push(this.patchAt(i,j));
            }
        }
        for (let i = agents.length-1;i>=0;--i){
            agents[i].setup(agents,content[i]);
        }
        this.step();
        const sickChart =  this.addTimeChart("Sick Ratio", {
            "Sick Ratio":(env:PanEnv):Number=>  100*(env.sickCount / env.size)
        }).setYAxis("%").setYLimits(0).setXLimits(0,this.maxSteps,50);
        
        const trustChart =  this.addTimeChart("Trust Chart", {
            "Juice Trust":(env:PanEnv):Number=>   env.trustData.juiceTrust,
            "Amulet Trust":(env:PanEnv):Number=>   env.trustData.amuletTrust,
            "Mask Trust":(env:PanEnv):Number=>   env.trustData.maskTrust,
            
        }).setYAxis("%").setYLimits(0).setXLimits(0,this.maxSteps,50);
        
        trustChart.getSeries("Juice Trust").setColor(namedColor("orange"));
        trustChart.getSeries("Amulet Trust").setColor(namedColor("red"));
        trustChart.getSeries("Mask Trust").setColor(namedColor("blue"));
            
    }
    
    sendResultMessage():void {
        const client = createHttpClient();
        const postResult = client.createPost("http://localhost:9000/results"); 
        postResult.
                addPart("framework", "AB-X").
                addPart("influencers",(Agent.influencerPower * 100) + "").
                addPart("sickRatio", JSON.stringify(this.sickRatio)).
                addPart("juiceTrust", JSON.stringify(this.juiceTrustPercentage)).
                addPart("amuletTrust", JSON.stringify(this.amuletTrustPercentage)).
                addPart("maskTrust", JSON.stringify(this.maskTrustPercentage));
        client.process(postResult);
    }
    
    step(){
        this.sickCount=0;
        this.patches().each((agent:Agent):void=>{
            agent.step();
        });
        this.calcTrust();
        if (this.currStep == this.maxSteps) {
            this.complete = true;
            this.sendResultMessage();
        }
    }
}