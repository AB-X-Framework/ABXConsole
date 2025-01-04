class Agent extends ABMPatch{
    static Influences = "Influences";
    static InfluencedBy = "InfluencedBy";
    static IntialSickProbability = 0.21;
    static DeltaSickProbability = 0.20;
    


    static setInfluencePower(influencerPower){
        Agent.influencerPower = influencerPower;
        Agent.personalPower = 1 - Agent.influencerPower;
    }
    
    juiceTrust;
    amuletTrust;
    maskTrust;

    juiceChosen;
    amuletChosen;
    maskChosen;

    activeReinforce;
    inactiveReinforce;

    isSick;

    
    setup(agents:Array, status:Object):void{
        this.isSick =false; 
        this.juiceTrust = status.juice / 100;
        this.amuletTrust = status.amulet / 100;
        this.maskTrust = status.mask / 100.0;
        this.activeReinforce = status.activeReinforce / 100.0;
        this.inactiveReinforce = status.inactiveReinforce / 100.0;
        const allInfluences = status.influences;
        this.juiceChosen=false;
        this.amuletChosen=false;
        this.maskChosen=false;
        for (let i = allInfluences.length - 1; i >= 0; --i) {
            const jsonInfluenced = allInfluences[i];
            const influencedId = jsonInfluenced.agent;
            const influencePower = jsonInfluenced.power;
            const influenced = agents[influencedId];
            this.setInfluence(influenced,influencePower);
        }
    }
    
    /**
     * This agent influences the influenced agent
     */
    setInfluence(influenced:Agent, influencePower:Number):void {
        this.createRelation(Agent.Influences,influenced);
        const influencedBy = influenced.createRelation(Agent.InfluencedBy,this);
        influencedBy.influencePower = influencePower;
        influencedBy.messages = [];
    }

    checkBounds(value:Number):Number {
        return Math.min(1.0, Math.max(value, 0));
    }
    
    
    consumeMessages():void{
        let messageJuiceTrust = 0;
        let messageAmuletTrust = 0;
        let messageMaskTrust = 0;
        let messagePower = 0;
        for (const relation of this.getRelationsList(Agent.InfluencedBy)) {
            for (const message of relation.messages){
           
                const influencePower = relation.influencePower;
                messagePower +=influencePower;
                messageJuiceTrust += (message.juiceTrust * influencePower);
                messageAmuletTrust += (message.amuletTrust * influencePower);
                messageMaskTrust += (message.maskTrust * influencePower);
            }
            relation.messages = [];
        }
        if (messagePower === 0){
            return;//No messages
        }
        this.juiceTrust =  this.juiceTrust * Agent.personalPower
                + ((messageJuiceTrust / messagePower) * Agent.influencerPower);
        this.amuletTrust =  this.amuletTrust * Agent.personalPower
                + ((messageAmuletTrust / messagePower) * Agent.influencerPower);
        this.maskTrust =  this.maskTrust * Agent.personalPower
                + ((messageMaskTrust / messagePower) * Agent.influencerPower);
    }
    
    forwardTrust():void{
        const trustMessage = {
            "juiceTrust": this.juiceTrust,
            "amuletTrust":this.amuletTrust,
            "maskTrust":this.maskTrust
        };
        const map = this.getRelationsMap(Agent.Influences);
        for (const rel of Object.keys(map) ){
            const influenced = map[rel].dest;
            //INfluenced agent
            //Assertions.assertTrue(influenced instanceof Agent)
            const relInfluencedBy = influenced.getRelationWith(Agent.InfluencedBy,this);
            relInfluencedBy.messages.push(trustMessage);
        };
    }
    
    step():void{
        this.consumeMessages();
        this.juiceChosen = random() < this.juiceTrust;
        this.amuletChosen = random() < this.amuletTrust;
        this.maskChosen = random() < this.maskTrust;
        let sickProbability = Agent.IntialSickProbability;
        if (this.amuletChosen) {
            sickProbability += Agent.DeltaSickProbability;
        }
        if (this.maskChosen) {
            sickProbability -= Agent.DeltaSickProbability;
        }
        this.isSick = random() < sickProbability;
        this.color =this.getColor();
        //Rebalance process
        let chosenDelta;
        let notChosenDelta;
        if (this.isSick) {
            ++env.sickCount;
            chosenDelta = -2 * this.activeReinforce;
            notChosenDelta = this.inactiveReinforce;
        } else {
            chosenDelta = this.activeReinforce;
            notChosenDelta = -this.inactiveReinforce;
        }
        const juiceDelta = this.juiceChosen ? chosenDelta : notChosenDelta;
        const amuletDelta = this.amuletChosen ? chosenDelta : notChosenDelta;
        const maskDelta = this.maskChosen ? chosenDelta : notChosenDelta;

        this.juiceTrust = this.checkBounds(this.juiceTrust + juiceDelta);
        this.amuletTrust = this.checkBounds(this.amuletTrust + amuletDelta);
        this.maskTrust = this.checkBounds(this.maskTrust + maskDelta);

        this.forwardTrust();
    }
     
     
    getColor():Object{
        let colorIndex = 0;
        if (this.amuletChosen) {
            --colorIndex;
        }else {
            ++colorIndex;
            
        }
        if (this.maskChosen) {
            ++colorIndex;
        }else{
            --colorIndex;
        }
        let color;
        if (this.juiceChosen) {
            color = namedColor("orange");
        } else {
            color = namedColor("green");
        }
        colorIndex -= 2;
        while (colorIndex < 0){
            color = color.darker();
            colorIndex += 1;
        }
        return color;
    }

}