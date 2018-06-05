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

function closestNode(parcels) {
  // Choose the closest parcel when we have no parcels at our current location
  // Drop off parcel or pick up another parcel? Need to do this based off of graph

}



function parcelChoosingRobot({place, parcels}, route){
  if (route.length == 0){
    let parcel;

    let possibleRoutes = [];
    for(let i = 0; i < parcels.length; i++) {
      if (parcels[i].place == place) {
        parcel = parcels[i];
        possibleRoutes = [];
        break;
      }
      else {
        let possibleRoute = findRoute(roadGraph, place, parcels[i].place);
        possibleRoutes.push(possibleRoute.length);
      }
    }
    
    if(parcel == undefined) {
      let smallestRoute = Math.min.apply(null, possibleRoutes);
      let index = possibleRoutes.indexOf(smallestRoute);
      parcel = parcels[index];
      console.log(parcel);
    }

    //Now we should have our next parcel, which should also be the closest one.
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

compareRobots(parcelChoosingRobot, [], goalOrientedRobot, []);
