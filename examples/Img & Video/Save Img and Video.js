include("{script}/Baseline.js");
const env = new TestEnv();
env.setupEnv( {w: 80, h: 40, gridType:"torus",agents:10});
writeImg("{script}/Result.png",env.getImg(10,["baseline"]));
startVideoRecording("{script}/Result.mp4","24");
for (let i = 0; i < 240;++i) {
    env.envStep();
    appendImg(env.getImg(10, ["baseline"]));
}
closeVideoStream();
println("DONE");