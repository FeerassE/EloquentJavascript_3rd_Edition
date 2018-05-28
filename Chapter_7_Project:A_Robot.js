
// ************* Chapter 7 ************* //

// ************* Project: A Robot ************** // 

// In project chapters we read through programs. //

// We're going to build an automaton. A little program
// that performs tasks in a virtual world. 

// The automaton will be a mail-delivery robot pciking up
// and dropping off parcels.


// To traverse the contents. Crtl-F the star plus the name of the subheading. ex: Crtl-F[* Classes]
//   Table of Contents
//   ---------------------------
// * Meadowfield
// * The Task
// * Persistent Data
// * Simulation
// * The mail truck’s route
// * Pathfinding


//******** * Meadowfield **********/

// There is a village named Meadowfield. It has 11 places and 14 roads between them. 
// It is described with this array of roads:

const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin", "Alices House-Post Office", 
    "Bob's House-Town Hall", "Daria's House-Ernie's House", "Daria's House-Town Hall", 
    "Ernie's House-Grete's House", "Grete's House-Farm", "Grete's House-Shop",
    "Marketplace-Farm", "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall",
]

// Okay so This array above describes what each place in the village is connected to. 
// A connection is symbolized by the dash '-' symbol between two places.

// There is a reference image used in EQJS 3rd edition that you can refer to of the village.

// The network of villages forms a 'graph'. A graph is a collection of points (places in the village)
// with lines between them(roads).


// We're converting the list of roaads to a data structure that, for each place, tellus what can be
// reached from there. We're doing this because the array of strings above is difficult to work with.

function buildGraph(edges) {
    let graph = Object.create(null);
    // So we're creating an OBJECT of 'froms' which are our starting positions. 
    // Each from consists of destinations which are other places in the village.
    function addEdge(from, to){
        if (graph[from] == null){
            // if this starting position doesn't exist, create an array with the destination inside it. 
            // This is our starting position.
            graph[from] = [to];
        } else {
            // adds a destination to an already existing starting position array
            graph[from].push(to);
        }
        for (let [from, to] of edges.map(r => r.split("-"))) {
            // The 'split' method returns an array of strings. So that's why it iterates
            // over edges looking for an array with two elements in them.
            // Ex: The string "Alice's House-Bob's House" in const roads becomes
            // [Alice's House, Bob's House]

            addEdge(from, to);
            addEdge(to, from);
        }
        return graph;
    }

    const roadGraph = buildGraph(roads);
}

// An edge is a connection between two points.
// So given an array of edges, buildGraph creates a map object that,
// for each node, stores an array of connected nodes.

// Explaining the string method again:

/*
It uses the split method to go from the road strings, 
which have the form "Start-End", to two-element arrays 
containing the start and end as separate strings.
*/



/***************** * The Task ********************/

// The robot will move around the village. 
// There are parcels in different places each addressed to another
// location. 

// The robot picks up parcels when it comes to them and delivers them when
// it arrives at their destinations. 

// The automaton must decide, at each point, where to go next. It has 
// finished its task when all parcels have been delivered. 

// To simulate this, we will define a virtual world that can 
// describe this.

// The model tells us where the robot is and where the parcel is.
// When the robot has decided to move somewhere, we need to
// update the model to reflect the new situation.

// Should we make a class for the robot, the parcel and one for places?
// Each class would have its own state, so for example, one place
// would have a property that keeps track of the number of parcles at that location.
// No this is a bad idea. 
// Again this is a bad idea!


// We would end up with a collection of interconnected objects that each have their own internal, changing state.
// Such programs are hard to understand and easy to break.

// Instead we're going to condense the village's state down to the minimal set of values that define it.
// These are:
// The robot's current location.
// The collection of undelivered parcels, each of which has a current location and destination address. 

// We won't CHANGE the state when the robot moves, but rather compute a NEW state for the situation after the move. 

class VillageState {
    constructor(place, parcles) {
        this.place = place;
        this.parcels = parcels;
    }

    move(destination) {
        if(!roadGraph[this.place].includes(destination)){
            // .includes is a method that determines whether an array includes a certain element,
            // returning 'true' or 'false' as appropriate.

            // So if the location we are in does NOT include a road to the destination, return
            // the current state. 
            return this;
        } else {
            let parcels = this.parcels.map(p => {
                if (p.place != this.place) return p;

                // okay so parcels will be an array of parcels because 'map' returns an array.
                return {place: destination, address: p.address};

                // so we're saying, if the parcel.place is not the current place, then just return the parcel.
                // else return an object with the place being the destination and the address being the parcel's address. 
            }).filter(p => p.place != p.address);
            // filter creates an array where each parcel's place does not equal the parcel's addres... Why is it doing this?
            return new VillageState(destination, parcels);
        }
    }
}



