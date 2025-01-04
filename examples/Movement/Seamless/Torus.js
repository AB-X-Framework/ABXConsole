/**
 * Seamless is not valid in torus
 */
include("{script}/Baseline.js");
env.setupEnv( {w: 2, h: 2, gridType:"torus",seamless:true});
setEnv(env);
setScale(200);
