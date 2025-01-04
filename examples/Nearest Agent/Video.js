include("{script}/Baseline.js");
const env = new FEnv();
env.setupEnv({"w":192,"h":108,"influencers":15,"followers":5,"agentSize":2,"gridType":"torus","speed":0.5})
setEnv(env);
startVideoRecording("{script}/Result.mp4","24");
for (let i = 0; i < 240;++i) {
    env.envStep();
    appendImg(env.getImg(10, ["baseline"]));
}
closeVideoStream();