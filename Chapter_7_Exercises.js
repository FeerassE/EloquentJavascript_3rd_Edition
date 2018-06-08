// Exercises are below Robot program

const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin", "Alice's House-Post Office", 
    "Bob's House-Town Hall", "Daria's House-Ernie's House", "Daria's House-Town Hall", 
    "Ernie's House-Grete's House", "Grete's House-Farm", "Grete's House-Shop",
    "Marketplace-Farm", "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall",
]

function buildGraph(edges) {
    let graph = Object.create(null);
    function addEdge(from, to) {
      if (graph[from] == null) {
        graph[from] = [to];
      } else {
        graph[from].push(to);
      }
    }
    for (let [from, to] of edges.map(r => r.split("-"))) {
      addEdge(from, to);
      addEdge(to, from);
    }
    return graph;
  }
  
  const roadGraph = buildGraph(roads);


  class VillageState {
    constructor(place, parcels) {
      this.place = place;
      this.parcels = parcels;
    }
  
    move(destination) {
      if (!roadGraph[this.place].includes(destination)) {
        return this;
      } else {
        let parcels = this.parcels.map(p => {
          if (p.place != this.place) return p;
          return {place: destination, address: p.address};
        }).filter(p => p.place != p.address);
        return new VillageState(destination, parcels);
      }
    }
  }


  function runRobot(state, robot, memory) {
    for (let turn = 0;; turn++) {
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

  function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomRobot(state) {
  return {direction: randomPick(roadGraph[state.place])};
}

VillageState.random = function(parcelCount) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
      let address = randomPick(Object.keys(roadGraph));
      let place;
      do {
        place = randomPick(Object.keys(roadGraph));
      } while (place == address);
      parcels.push({place, address});
    }
    return new VillageState("Post Office", parcels);
};

  function findRoute(graph, from, to) {
    let work = [{at: from, route: []}];
    for (let i = 0; i < work.length; i++) {
      let {at, route} = work[i];
      for (let place of graph[at]) {
        if (place == to) return route.concat(place);
        if (!work.some(w => w.at == place)) {
          work.push({at: place, route: route.concat(place)});
        }
      }
    }
  }

  const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
  ];
  function routeRobot(state, memory) {
    if (memory.length == 0) {
      memory = mailRoute;
    }
    return {direction: memory[0], memory: memory.slice(1)};
  }

  function goalOrientedRobot({place, parcels}, route){
    if (route.length == 0) {
      let parcel = parcels[0];
      if (parcel.place != place) {
        // Pick up parcel
        route = findRoute(roadGraph, place, parcel.place);
      } else {
        // Deliver Parcel
        route = findRoute(roadGraph, place, parcel.address);
      }
    }
    return {direction: route[0], memory: route.slice(1)};
  }


/**** Measuring a Robot ******/

/*
It’s hard to objectively compare robots by just letting them solve a few scenarios. 
Maybe one robot just happened to get easier tasks, or the kind of tasks that it is good at, whereas the other didn’t.

Write a function compareRobots that takes two robots (and their starting memory). 
It should generate 100 tasks and let each of the robots solve each of these tasks. 
When done, it should output the average number of steps each robot took per task.

For the sake of fairness, make sure that you give each task to both robots, rather 
than generating different tasks per robot.
*/




  // create an array of random village states, with different numbers of parcels. Robot 1 will go and then robot 2

  // Create 100 tasks
  // Robots do each task, one at a time
  // We should return a number of steps each robot took to compelete the task
  // We should record the step number in an array
  // We should compute the average number of steps for each array.

  function generateRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }


  function runRobotCompare(state, robot, memory) {
    for (let turn = 0;; turn++) {
      if (state.parcels.length == 0) {
        return turn;
      }
      let action = robot(state, memory);
      state = state.move(action.direction);
      memory = action.memory;
    //   console.log(`Moved to ${action.direction}`);
    }
  }


  function compareRobots(robot1, memory1, robot2, memory2) {
    let taskArray = [];
    // Generate Tasks
    for (let i = 0; i < 100; i++){
        let parcelCount = generateRandomInt(15);
        taskArray.push(VillageState.random(parcelCount));
    }

    let robotOneStepsPerTask = [];
    let robotTwoStepsPerTask = [];

    for(let i = 0; i < taskArray.length; i++) {
        let steps1 = runRobotCompare(taskArray[i], robot1, memory1);
        let steps2 = runRobotCompare(taskArray[i], robot2, memory2);
        robotOneStepsPerTask.push(steps1);
        robotTwoStepsPerTask.push(steps2);
    }
    let averageRobotOne = robotOneStepsPerTask.reduce((accum, curr) => 
                        {return accum + curr})/ robotOneStepsPerTask.length;

    let averageRobotTwo = robotTwoStepsPerTask.reduce((accum, curr) => 
                        {return accum + curr})/ robotTwoStepsPerTask.length;
    console.log("First Robot: " + averageRobotOne);
    console.log("Second Robot: " + averageRobotTwo);
  }
  


/*
Robot efficiency

Can you write a robot that finishes the delivery task faster 
than goalOrientedRobot? If you observe that robot’s behavior, what obviously 
stupid things does it do? How could those be improved?

If you solved the previous exercise, you might want to use your compareRobots 
function to verify whether you improved the robot.

// Your code here

*/

// Not finding an ideal path based on first parcel in list but closes parcel to current location.
// Or finding an ideal path 
// We could create a closest parcel function that find the closest parcel to the current location of a parcel
// Then we do that for every possible element in the array
// Needs to be able to make the decision, deliver first or get parcel?

// The goal oriented robot does this:
// It only makes the decision of whether to drop off the parcel if it has one or
// to go pick up a parcel if it does not have one
// It finds the shortest route to either of those decisions

// We should try to find a way to organize which parcels we choose to pick up instead of
// just choosing the next one in the array list. We can also try and figure out if we want ot pick up
// more parcels or to deliver instead

// Keep in mind that the parcels Array contains all the parcel locations and addresses


function parcelChoosingRobot({place, parcels}, route){
  if (route.length == 0){
    let parcel;
    let possibleRoutes = [];
    let parcelsToPickUp = parcels;

    for(let i = 0; i < parcelsToPickUp.length; i++) {
      if (parcelsToPickUp[i].place == place) {
        parcel = parcelsToPickUp[i];
        possibleRoutes = [];
        break;
      }
      else {
        let possibleRoute = findRoute(roadGraph, place, parcelsToPickUp[i].place);
        possibleRoutes.push(possibleRoute.length);
      }
    }
    
    
    if(parcel == undefined) {
      let smallestRoute = Math.min.apply(null, possibleRoutes);
      let index = possibleRoutes.indexOf(smallestRoute);
      parcel = parcelsToPickUp[index];
      parcelsToPickUp.splice(index, 1);

      console.log(parcelsToPickUp);
    }

    //Now we should have our next parcel, which should also be the closest one.
    if (parcelsToPickUp.length > 1) {
      // Pick up parcel
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      // Deliver Parcel
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}




// Need to rewrite, need to prioritize picking up parcels over delivering
// Need to choose shortest route to picking up

// So prioritizing parcels may not be that great of an idea because what if you had a bunch of 
// package nodes connected in the form of a circle and each one had it's delivery address node connected
// to it's respective package. You would have to circle around twice, first picking up the packages and second 
// delivering them.

function closestParcel(graph, place, parcels) {
  // Choose the closest parcel when we have no parcels at our current location
  // Drop off parcel or pick up another parcel? Need to do this based off of graph

  let work = [];

  for(let i=0; i<parcels.length; i++) {
    let route = findRoute(graph, place, parcels[i].place);
    work.push({parcel: parcels[i], routeLength: route.length})
  }

  let closestParcel = undefined;

  for(let i = 0; i<work.length; i++) {
    if (closestParcel === undefined) {
      closestParcel = work[i];
    }
    else if (closestParcel.routeLength > work[i].routeLength) {
      closestParcel = work[i];
    }
  }

  return closestParcel.parcel;
}

function improvedRobot({place, parcels}, route) {
  
  if (route.length == 0){
    let parcel = closestParcel(roadGraph, place, parcels);

    if (parcel.place != place) {
        route = findRoute(roadGraph, place, parcel.place);
    } else {
    // If it's at our current location, we go and find a route to deliver the parcel
        route = findRoute(roadGraph, place, parcel.address);
    }
  }
return {direction: route[0], memory: route.slice(1)};
}


compareRobots(improvedRobot, [], goalOrientedRobot, []);

// Okay I was right actually, choosing the closest parcel does work.




/********** * Persistent group ***********/
/*

Most data structures provided in a standard JavaScript environment aren’t very well suited for 
persistent use. Arrays have slice and concat methods, which allow us to easily create new arrays
 without damaging the old one. But Set, for example, has no methods for creating a 
 new set with an item added or removed.

Write a new class PGroup, similar to the Group class from Chapter 6, which stores a set of values. 
Like Group, it has add, delete, and has methods.

Its add method, however, should return a new PGroup instance with the given member added, and 
leave the old one unchanged. Similarly, delete creates a new instance without a given member.

The class should work for values of any type, not just strings. It does not have to be efficient 
when used with large amounts of values.

The constructor shouldn’t be part of the class’ interface (though you’ll definitely want to 
use it internally). Instead, there is an empty instance, PGroup.empty, that can be used as a starting value.

Why do you need only one PGroup.empty value, rather than having a function that creates a 
new, empty map every time?

class PGroup {
  // Your code here
}

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false

*/



class PGroup{
  constructor(input) {
    this.group = [];
    if(Array.isArray(input)) {
      this.group = this.group.concat(input);
    }
    else if (input == undefined) {
      this.group = [];
    }
    else{
      this.group.push(input);
    }
  }

  add(value) {
    if (this.group.indexOf(value) === -1) {
      let workArray = [...this.group];
      workArray.push(value);
      return new PGroup(workArray);
    }
  }
  delete(value) {
      if (this.group.indexOf(value) > -1){
        let workArray = [...this.group];
        workArray.splice(workArray.indexOf(value), 1);

        return new PGroup(workArray);
    }
  }

  has(value){
    if(this.group.indexOf(value) > -1){
      return true;
    }
    else{
      return false;
    }
  }
}

let a = new PGroup("a");
console.log(a.group);
let ab = a.add("b");
console.log(ab.group)
let b = ab.delete("a");
console.log(b.group)
// console.log(b.has("b"));
// // → true
// console.log(a.has("b"));
// // → false
// console.log(b.has("a"));
// // → false



// We are running into problems if immutability

// const characters = [ 'Obi-Wan', 'Vader' ]
// const newCharacters = characters
// newCharacters.push('Luke')
// console.log(characters === newCharacters) // true :-(


// Solution SPREAD OPERATOR

const characters = [ 'Obi-Wan', 'Vader' ]
const newCharacters = [ ...characters, 'Luke' ]
console.log(characters === newCharacters) // false
console.log(characters) // [ 'Obi-Wan', 'Vader' ]
console.log(newCharacters) // [ 'Obi-Wan', 'Vader', 'Luke' ]