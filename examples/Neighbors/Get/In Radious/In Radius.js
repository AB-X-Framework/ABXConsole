/**
 * Here distancePerRound is in meters but the env is in km.
 * The framework automatically translates from m to km
 */
enableSIDistance(true);

class Center extends ABMAgent {
    radius;
    green;
    setup(radius){
        //Radius is half of size
        this.radius=radius;
        this.size = radius*2;
        this.setRandomLocation();
        this.color = namedColor("yellow");
        this.green = namedColor("green");
        this.fontSize=30;
        this.fontName="Serif";
        this.fontStyle = "bold";
    }
    step(): void {
        this.eachPatchInRadius(radius,(patch)=>{
            patch.color=green;
        });
        this.visible = !this.visible;
    }
}

class InRadiusEnv extends ABMEnv{
    setup(specs) {
        const darkGray=namedColor("darkGray");
        this.patches().each((patch:ABMPatch) =>{
            patch.color=darkGray;
        });
        this.spawn(Center).setup(specs.radius);
    }
}