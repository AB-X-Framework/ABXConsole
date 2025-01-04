/**
 * Using Game of life Base Model and a 200x200 grid with a 3x scale
 */
include("{script}/Base Model.js");
setEnv(new GOLEnv().setupEnv({w: 200, h: 200, aliveCount: 150, gridType:'torus', delta:1}));
setScale(3);