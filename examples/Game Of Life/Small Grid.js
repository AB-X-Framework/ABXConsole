/**
 * Using Game of life Base Model and a small grid with a 10x scale
 */
include("{script}/Base Model.js");

setEnv(new GOLEnv().setupEnv({w: 60, h: 60, aliveCount: 50, gridType:'torus', delta:1}));
setScale(10);