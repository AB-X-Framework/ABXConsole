/**
 * This simulation specs
 */
include("{script}/SgEnv.js");

const env = new SgEnv();
const maxSteps = 500;
env.setupEnv( {w: 150, h: 200, gridType:"torus","males":75,"females":75,"maxSteps":maxSteps});

startVideoRecording("{script}/Sugarscape.mp4","24");
for (let i = 0; i < maxSteps;++i) {
    env.envStep();
    appendImg(env.getImg(4, ["baseline"]));
}
closeVideoStream();