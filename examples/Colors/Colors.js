/**
 * List add named colors
 */
class ColorEnv extends ABMEnv {

    colors;

    setup(specs: Object):void {
        this.colors = specs.colors;
        let counter = 0;
        for (const color of this.colors){
            println(color);
            this.patchAt(counter,0).color=namedColor(color);
            this.patchAt(counter,1).color=namedColor(color);
            ++counter;
        }
    }

    step():void{
        for (let i = 0; i < this.colors.length; i++){
            let color = this.patchAt(i,0).color=rgbaColor(
                randomInt(256),
                randomInt(256),
                randomInt(256),
                randomInt(256));
            println(asRGBA(color));
            color = this.patchAt(i,1).color=rgbColor(
                randomInt(256),
                randomInt(256),
                randomInt(256));
            println(asRGB(color));
        }
        this.setPaused(true);
    }

}

const env = new ColorEnv();
const desiredColors = namedColors();
env.setupEnv({"w":desiredColors.length,"h":2,"colors":desiredColors});
setEnv(env);
setScale(30);