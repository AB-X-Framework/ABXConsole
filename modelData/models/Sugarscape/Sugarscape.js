/**
 * This simulation specs
 */
include("{script}/SgEnv.js");
 
const env = new SgEnv();
env.setupEnv( {w: 150, h: 200, gridType:"torus","males":75,"females":75,"maxSteps":500});
//env.setupEnv( {w: 10, h: 10, gridType:"torus","males":10,"females":10});
setEnv(env);
setScale(4);
