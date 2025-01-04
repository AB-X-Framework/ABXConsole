class CustomChartEnv extends ABMEnv {

    setup(specs: Object):void {
        this.addChart("Adding 10 samples per step", {"randData":()=> {
                const values = [];
                for (let i = 1; i <= 10; ++i) {
                    values.push(randomNormal(100, 50));
                }
                return values;
            }
        },"addAll").setXAxis("Rand Values").addLine([0,0,1,1],namedColor("black"));

        const lim = 50;
        this.addChart("Always 100", {"Random up":():Array=> {
                const values = [];
                for (let i = -lim; i <= lim; ++i) {
                    values.push(i+random());
                }
                return values;
            }, "Random down":(): Array=> {
                const values = [];
                for (let i = -lim; i <= lim; ++i) {
                    values.push(-i+random());
                }
                return values;
            }
        },"replace", ():Array=>{
            const values = [];
            for (let i = -lim; i <= lim; ++i) {
                values.push(i);
            }
            return values;
        }).setXAxis("Rand Values").
            setXLimits(-lim-1,lim+1,10).
            setYLimits(-lim-1,lim+1,10).
            addLine([0.5,0,0.5,1],namedColor("black")).
            addLine([0,0.5,1,0.5],namedColor("red")).
            getSeries("Random up").setColor(namedColor("green"));;

        this.addChart("One at a time", {"Neg":():Number=> {
                return 1;
            }
        },"add", ():Number=>{
            return randomInt(1000);
        });
    }

    step():void{
        this.sampleCharts();
        if (this.currStep=== 5) {
            this.complete = true;
        }
    }
}
setEnv(new CustomChartEnv().setupEnv({}));
setScale(100);
