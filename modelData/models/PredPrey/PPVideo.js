/**
 * This simulation specs
 */
include("{script}/PPEnv.js");

const env = new PPEnv();
const maxSteps = 1000;
env.setupEnv( {w: 500, h: 500, gridType:"torus", rabbits:250, wolves:25, maxSteps:maxSteps});

startVideoRecording("{script}/PredPrey.mp4","24");
for (let i = 0; i < maxSteps;++i) {
    env.envStep();
    clear();
    println(env.agentSet[Wolf].size());
    appendImg(env.getImg(2, ["baseline"]));
}
closeVideoStream();