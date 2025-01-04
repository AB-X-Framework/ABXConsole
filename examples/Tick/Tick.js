/**
 * Tick is a function which prints the time since last tick
 * the first tick is the time since the engine started
 */
println(tick());

sleep(1000);
println(tick());

sleep(10000);
println(tick());

sleep(100_000);
println(tick());
println("DONE");