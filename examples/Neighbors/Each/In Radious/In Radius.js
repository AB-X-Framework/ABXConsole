/**
 * Here distancePerRound is in meters but the env is in km.
 * The framework automatically translates from m to km
 */
enableSIDistance(true);

class Center extends ABMAgent {
    radius;
    setup(radius){
        //Radius is half of size
        this.radius=radius;
        this.size = radius*2;
        this.setRandomLocation();
        this.color = namedColor("yellow");
        this.fontSize=30;
        this.fontName="Serif";
        this.fontStyle = "bold";
    }
    step(): void {
        for (const patch of this.patchesInRadius(this.radius)){
            patch.color=namedColor("green");
        }
        this.visible = !this.visible;
    }
}

class InRadiusEnv extends ABMEnv{
    setup(specs) {
        this.patches().each((patch:ABMPatch) =>{
            patch.color=namedColor("darkGray");
        });
        this.spawn(Center).setup(specs.radius);
    }
}