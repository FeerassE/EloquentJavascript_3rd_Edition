/******* Chapter 10 exercise 2 graph module */

const roads = [
    "Alice's House-Bob's House",   "Alice's House-Cabin",
    "Alice's House-Post Office",   "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop",          "Marketplace-Farm",
    "Marketplace-Post Office",     "Marketplace-Shop",
    "Marketplace-Town Hall",       "Shop-Town Hall"
];

function createEdges(roads) {
    let edges = [];
    for(road of roads) {
       let edge = road.split("-")
       edges.push(edge);
       console.log(edge);
    }
    return edges
}



// createEdges works

function buildGraph(edges) {
    let roadGraph = {};
    for(let i = 0; i < edges.length; i++) {
        if(!((edges[i][0]) in roadGraph)) {
            roadGraph[edges[i][0]] = [];
        }
        roadGraph[edges[i][0]].push(edges[i][1]);
    }
    return roadGraph;
}

module.exports = {
    createEdges,
    buildGraph
};

