/**
 * This simulation specs
 */
include("{script}/PandemicsEnv.js");
 
const env = new PanEnv();

env.setupEnv( {w: 100, h: 100, influencerCount:10,influencerPower:2,maxSteps:1200});
setEnv(env);
setScale(5);