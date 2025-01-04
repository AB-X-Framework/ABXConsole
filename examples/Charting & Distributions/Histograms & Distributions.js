class HistogramExampleEnv extends ABMEnv {

    setup(specs: Object) {
        const oneTo1000 = this.addHistogram("1 to 1000 - 5 no limits", ()=>{
            const values = [];
            for (let i = 1; i <= 1000;++i){
                values.push(i);
            }
            return values;
        },"replace").setXAxis("Elements").setYAxis("Element count").setLegend("Historic data");


        this.addHistogram("As a line - limits 500-600", ()=>{
            const values = [];
            for (let i = 1; i <= 1000;++i){
                values.push(i);
            }
            return values;
        },"replace").setSlots(10).setType("line").setLimits(500,600);



        this.addHistogram("1 to 100 - 1 slot - min max ", ()=>{
            const values = [];
            for (let i = 1; i <= 100;++i){
                values.push(i);
            }
            return values;
        },"replace").setSlots(1).setLimits(-100,200);



        this.addHistogram("Adding only one ", ()=>{
            return randomNormal(100,50);
        },"add").setSlots(1).setLimits(-100,200);

        this.addHistogram("Normal 100 samples per step", ()=>{
            const values = [];
            for (let i = 1; i <= 100;++i){
                values.push( randomNormal(100,50));
            }
            return values;
        },"addAll").setSlots(25).setXAxis("Normal Curve").setLimits(-100,300);


        this.addHistogram("Random 100 samples per step", ()=>{
            const values = [];
            for (let i = 1; i <= 100;++i){
                values.push( random());
            }
            return values;
        },"addAll").setSlots(25).setLimits(0,1);


        this.addHistogram("Random int 100 samples per step", ()=>{
            const values = [];
            for (let i = 1; i <= 100;++i){
                values.push( randomInt(100));
            }
            return values;
        },"addAll").setSlots(25).setLimits(0,100);


        this.addHistogram("Random range 100 samples per step", ()=>{
            const values = [];
            for (let i = 1; i <= 100;++i){
                values.push( randomInt(500,1000));
            }
            return values;
        },"addAll").setSlots(25);

        const emptyHistogram = this.addHistogram("Empty Histogram", ()=>[],"replace");
    }

    step(){
        this.sampleHistograms();
        this.setPaused(true);
    }


}

setEnv(new HistogramExampleEnv().setupEnv({}));
setScale(100);
