/**
 * This simulation specs
 */
include("{script}/PPEnv.js");
 
const env = new PPEnv();
env.setupEnv( {w: 500, h: 500, gridType:"torus", rabbits:250, wolves:25, maxSteps:1000});
setEnv(env);
setScale(2);