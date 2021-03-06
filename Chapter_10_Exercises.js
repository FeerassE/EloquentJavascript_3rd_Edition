/*********** * Chapter 10 Exercises ***********/


/*
A modular robot

These are the bindings that the project from Chapter 7 creates:

roads
buildGraph
roadGraph
VillageState
runRobot
randomPick
randomRobot
mailRoute
routeRobot
findRoute
goalOrientedRobot

If you were to write that project as a modular program, what modules 
would you create? Which module would depend on which other module, and 
what would their interfaces look like?

Which pieces are likely to be available prewritten on NPM? Would you 
prefer to use an NPM package or write them yourself?
*/


//Answer:

/*
I would make randomPick into a modular program and probably buildGraph

*/




/*

s module

Write a CommonJS module, based on the example from Chapter 7, that contains 
the array of roads and exports the graph data structure representing them as 
roadGraph. It should depend on a module ./graph, which exports a function 
buildGraph that is used to build the graph. This function expects an array of 
two-element arrays (the start and end points of the roads).


*/

// Add dependencies and exports

const {createEdges} = require("./graph");
const {buildGraph} = require("./graph");
const roads = [
    "Alice's House-Bob's House",   "Alice's House-Cabin",
    "Alice's House-Post Office",   "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop",          "Marketplace-Farm",
    "Marketplace-Post Office",     "Marketplace-Shop",
    "Marketplace-Town Hall",       "Shop-Town Hall"
  ];

  let fromToArray = createEdges(roads);
  let roadGraph = buildGraph(fromToArray)

  console.log(roadGraph)



 /*
Circular dependencies
A circular dependency is a situation where module A depends on B, and B also, directly 
or indirectly, depends on A. Many module systems simply forbid this because whichever 
order you choose for loading such modules, you cannot make sure that each module’s 
dependencies have been loaded before it runs.

CommonJS modules allow a limited form of cyclic dependencies. As long as the modules do 
not replace their default exports object and don’t access each other’s interface until 
after they finish loading, cyclic dependencies are okay.

The require function given earlier in this chapter supports this type of dependency cycle. 
Can you see how it handles cycles? What would go wrong when a module in a cycle does replace 
its default exports object?
 */

 //Answer:
 // Not really sure, but it has to account for the 
 // Is it by how it checks if there's a module already loaded?



 // Actual Answer:

 /*
The trick is that require adds modules to its cache before it starts loading the module. 
That way, if any require call made while it is running tries to load it, it is already 
known, and the current interface will be returned, rather than starting to load the module 
once more (which would eventually overflow the stack).

If a module overwrites its module.exports value, any other module that has received 
its interface value before it finished loading will have gotten hold of the default 
interface object (which is likely empty), rather than the intended interface value.
 */