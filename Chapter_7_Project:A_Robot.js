
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
    "Alice's House-Bob's House", "Alice's House-Cabin", "Alice's House-Post Office", 
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


// We're converting the list of roads to a data structure that, for each place, tell us what can be
// reached from there. We're doing this because the array of strings above is difficult to work with.

function buildGraph(edges) {
    let graph = Object.create(null);
    // So we're creating an OBJECT of 'froms' which are our starting positions. 
    // Each 'from' consists of an ARRAY of destinations which are other places in the village.
    function addEdge(from, to){
        if (graph[from] == null){
            // If this starting position doesn't exist, create an element with the name
            // of the starting address as the 'key' and it's 'value' will be
            // an array with the destination inside it. 
            // This is our starting position.
            graph[from] = [to]; 

            // Example Output: {"Alice's House": [Bob's House]}
        } 
        else {
            // Else, if the starting address(from) property already
            // exists, add a destination to the array of destinations.
            graph[from].push(to);
        }
    }
    for (let [from, to] of edges.map(r => r.split("-"))) {
        // The 'split' method returns an ARRAY of strings. So that's why it iterates
        // over edges looking for an array with two elements in them.
        // Ex: The string "Alice's House-Bob's House" in const roads becomes
        // [Alice's House, Bob's House]

        // edges.map will return an ARRAY of ARRAYS of [from, to]. The output will look like this:
        // [[Alice's House, Bob's House], [Alice's House, Cabin], [Alice's House, Post Office], etc...]

        // It then uses the addEdge function to create a new property(we can also call this a 'key') 
        // on the edges OBJECT.

        addEdge(from, to);
        addEdge(to, from);
    }
        return graph;
}

        // Here is something confusing. Let's use the array we got out of the first iteration :
        // [Alice's House, Bob's House].
        // IN THIS 'for' LOOP, Alice's House is 'from' and Bob's House is 'to'.

        // However, the only thing the function 'addEdge' cares about, is what is in the 'first'
        // parameter, and what is in the 'second' parameter. 

const roadGraph = buildGraph(roads);


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
    constructor(place, parcels) {
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

                // This is what is happening, any parcels whose current place is not the current place that the robot is at, 
                // keep it the same. This accounts for parcels that are somewhere else already. ***
                // Then it says, any parcels that the robot has NOW, we're going to MOVE to the destination and make sure
                // that the parcel keeps it's address because that tells us our destination.
            }).filter(p => p.place != p.address);
            // filter returns an array where each parcel's place does not equal the parcel's address... Why is it doing this?
            // Because filter is DELIVERING the parcels to the new address. 
            // So any parcels whose place(the destination) is the SAME as the address, we remove from the array because
            // they have been delivered.
            return new VillageState(destination, parcels);
        }
    }
}


// Summary of Village State: 
/*
    In the constructor, 
    this.place is the current place that the robot is in. 
    this.parcels is an array of parcel objects with a 'place property'(current location of parcel) and 
    'address property' (where it is being sent to).
    
    The 'move(destination)' function will either return a new state for the village 
    if the destination is valid, or will return the current state if there are 
    no roads to the destination

    So then we move into augmenting the array of parcels. 
    *Note* that some parcels are not with the robot.

    * if (p.place != this.place) return p;  <-- This returns the parcel as it, if it is not
                                                 with the robot at the CURRENT place.
    Else if it is at the CURRENT place, then we'll move it by setting its place property,
    which represents its current location, to that of the destination. 
    
    *Note* the filter function returns an ARRAY with elements that PASS the test given.

    It then filters out the parcel if the place and address ARE the same. We do this because
    their current location and their delivery address are now the same, which means they've
    been delivered.

    We then return a new instance of the VillageState class. 

    *Note*, the old state still exists! Also notice that parcel objects aren't changed but
    are recreated! The old state stays the same! 

*/

let first = new VillageState(
    "Post Office",
    [{place: "Post Office", address: "Alice's House"}]
);
let next = first.move("Alice's House");

console.log(next.place);
// log: Alice's House

console.log(next.parcels);
// log: []

console.log(first.place);
// log: Post Office

console.log(first.parcels)


/************** * Persistent Data **************/

// Data Structures that don't change are called immutable or persistent. 
// There is a function called 'Object.freeze' that changes an object so that
// writings to its properties is ignored.

// This is dangerous because when checking for bugs, it is hard to find this function. 
// Also makes the computer do extra work. Better to just know not to update the object.

let object = Object.freeze({value: 5});
object.value = 10;
console.log(object.value);
// log: 5

// We use immutability to manage complexity. Objects that change
// over time are difficult to manage.



/**************** * Simulation ***************/

// Delivery robot looks at the world and decides which direction it want to move.
// A robot is a function that takes a VillageState object and returns the name of
// a nearby place.


function runRobot(state, robot, memory){
    for(let turn = 0;; turn++) {
        if (state.parcels.length == 0) {
            console.log(`Done in ${turn} turns`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Moved to ${action.direction}`);
    }
}