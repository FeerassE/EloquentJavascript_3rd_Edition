//************ * Asynchronous Programming ************/

/* 

To traverse the contents. Crtl-F the star plus the name of the subheading. ex: Crtl-F[* Classes]
  Table of Contents
  -----------------------------
* Asynchronicity
* Crow Tech
* Callbacks
* Promises
* Failure
* Networks are Hard
* Collections of Promises
* Network Flooding
* Message Routing
* Async Functions
* Generators
* The Event Loop
* Asynchronous Bugs
* Summary

*/



/*
The processor carries out the instructions of the program sequentially. 

Programs also communicate with things outside the processor, like 
computer networks. Communications on a computer network are much
slower than a processor.

It would be great if we could something else while those slow instructions 
are trying to resolve. 

*/


/************ * Asynchronicity *********/

/*
In synchronous programming, things happen one at a time.
If a step takes a long time, it will only continue to the next step once
that long-running step has finished.
*/


/*
An asynchronous model allows multiple things to happen at the same time.
When you start an action, the program continues to run. 
When the actions finishes, the program is informed and gets access to the result.
*/

/*

/*
Aight, I'm going to explain what I've understood:

'synchronous' & 'asynchronous' have very little to do with multiple threads. 
It has more to do with "do task's inputs require the outputs of another 
task to run (synchronous)" and "can you begin tasks before other tasks have ended"
*/

/*
The solution for synchronous actions is to have more than one thread of control.

Both Node.js and the browser run things asynchronously instead of relying on threads.
*/


/*
Here's more info:

The browser environment gives us WepAPIs like ajax.

What happens in async is that async actions actually wait in the web api's. When they're done resolving for a value,
they get pushed NOT to the callstack but to the callback qeue, where it waits until the stack is finished. THEN the event loop pushes
the callback to the callstack when the callstack is empty.



*/


/************* * Crow Tech *************/

/*
Working with nodes and synchronicity.

Premise is crows and termites have built a network across small
village in france. Each node point is a termite hill or something.
*/

// Callback Functions
// When functions take a while to produce a result,
// you can give these functions another function called
// the "Callback function". The "Callback function" will
// be called when the parent function finishes it's action.


setTimeout(() => console.log("Tick"), 500);


// setTimeout() waits in milliseconds before calling the callback function.

// Crows write JSON data. 
// readStorage() takes time to fetch the data.
// "food caches" holds an array of location names that describe where the data
// is actually stored.


import {bigOak} from "./crow-tech";

bigOak.readStorage("food caches", caches => {
  let firstCache = caches[0];
  bigOak.readStorage(firstCache, info => {
    console.log(info);
  });
});


// The indentation gets worse and worse with more actions that are needed 
// for "Callback funcitons".


// Crows' Nests communicate using request-response pairs.
// So when a nest sends a request message, the recieving 
// nest will send a response message with a confirming receipt and possibly
// a reply. 

// Each message is tagged with 'type', which tells us how to handle it.
// The 'handler' is a function that's called and then produces a response to the received message.


/*
"./crow-tech" gives us an interface that uses callback-based functions.

The function 'send' will send a request and expects four arguments.
1. The name of the target nest
2. The type of request
3. The content of the request 
4. A callback function when a response is recieved.
*/

bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7PM",
            () => console.log("Note delivered."));

// We must define the type 'note' so that all nests can recieve this 
// request type.

import {defineRequestType} from '.crow/tech';

defineRequestType("note", (nest, content, source, done) => {
  console.log(`${nest.name} received note: ${content}`);
  done();
})


// I don't understand. Is defineRequestType() representing the nest
// sending the message or the one receiving.
// The one receiving, I believe.
// That the console.log in the body, shouldn't it only be called
// when the request has gotten a response back.
// Yes it should, because defineRequestType, is not the actual
// request call, it is only defining what should happen after
// the type!

// So defineRequestType adds support for "note" requests.
// I think the nest argument refers to the 'receiving' nest.

// The 'done' function is a callback function

// This section is poorly written. We have no idea
// what the body of the defineRequestType function
// looks like, so it's hard to figure out how it's integratedinto
// the rest of the funciton.

// So the defineRequestType() function gives the request handler
// the arguments in the parantheses. (I think)


// What it's saying about the 'done' function is that
// it is needed instead of the return value of the 


// I can't make sense of this at all. 
// done() is called because we need a callback function to signal
// when a response is available or something.

// It says that functions that do asynchronous work 'return' before
// the work is done. So we need a callback function to be called
// once the work is actually complete.


// Asynchronicity is contagious. A
// Any function that calls a function asynchronously must be 
// asynchronous 



/************ * Promises ************/

// The 'Promise' Class allow us to return an OBJECT that represents 
// a future event.

// This is done instead of calling a function at some later time.

// The 'Promise' class returns a 'promise' which is an asynchronous
// action that when completes produces a VALUE.

// Promise.resolve() wraps the value you give it in a promise.

let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`Got ${value}`));
// Got 15

// Remember how asynchronous functions, are always added to the callstack
// once it's empty! Does this mean that the value above will only be returned
// if the callstack is empty? I believe so because Promise.resolve() will make
// it an asynchronous value. I think...

// You can use the 'then' method to use a callback function on a promise.
// You can attach multiple callback functions to one promise, using
// the 'then' method.


// Promises allow us to make values asynchronous.
// The value is either already there or might appear in the future.

// You can use the Promise constructor.
// The constructor expects a function as an argument, which it 
// immediately calls, passing it a function that it can use to 
// resolve the promise.

function storage(nest, name) {
  return new Promise(resolve => {
    nest.readStorage(name, result => resolve(result));
  });
}

storage(bigOak, "enemies").then(value => console.log("Got", value));


/*
What is a promise from FunFunFunctions youtube channel:

A promise is an object that takes one callback function:

new Promise(() => {

})

The callback function takes two arguments, a resolve function and a reject function:

new Promise((resolve, reject) => {
  value.onLoad = function() {
    resolve(value)
  }

  value.onError = function() {
    reject(new Error(msg))
  }
})


The resolve and the reject functions are called one you have the values you're trying to get.

*/

// Resolve returns a Promise that is resolved with the given value.

// What does it mean to resolve?

// I think resolving is something like 'having the value finally available'.



/********** * Failure **********/

// Asynchronous functions need to be able to throw errors in case something
// like a request not working.

// Apparently the problem with the callback style is that it makes it extremely
// difficult to make sure failurs are properly reported ot the callbacks.

// Promises make this easier, they can be either resolved or rejected.

// Resolve handlers (registered with 'then') are called only when the 
// action is successful, and rejections are automatically sent to the 
// new promised returned by 'then'.

// When a handler throws an 'exception', this causes the promise produced
// by its 'then' call to be rejected.

// Any element in a chain of asynchronous actions that fails, will mark
// the whole chain as rejected and no success handlers are called beyond
// the point it failed.


// Resolving a function provides a value.
// Rejecting one also provides a value which is called 'reason' of the rejection.

// Promise.reject() creates an immediately rejected promise.

// Promises have a 'catch' method that registers a handler to be called when a 
// promise is rejected.

// 'then' also accepts a rejection handler as the second argument


// Notice below how the Promise has a chain of 'then' methods and 'catch' methods.

new Promise((_, reject) => reject(new Error("Fail")))
  .then(value => console.log("Handler 1"))
  .catch(reason => {
    console.log("Caught failure " + reason);
    return "nothing";
  })
  .then(value => console.log("Handler 2", value));
// → Caught failure Error: Fail
// → Handler 2 nothing


/*********** * Networks are Hard ***********/

// We'll add timeouts so that if a response value
// is never sent back, we deal with that.

// We'll also make it try sending the request
// a few times.


class Timeout extends Error {}

function request(nest, target, type, content) {
  return new Promise((resolve, reject) => {
    let done = false;
    function attempt(n) {
      // We're keeping track of the parameter 'n' which 
      // represents the number of events.

      nest.send(target, type, content, (failed, value) => {
        // nest.send will do a request and should resolve to a value
        done = true;
        if (failed) reject(failed);
        else resolve(value);
      });
      // setTimeout will call 'attempt' again after 250 milliseconds if we're below 2 attempts(n).

      // notice that nest.send is an async function so setTimeout will be called even if .send has not
      // has not received a response and it's callback has not been called. 
      setTimeout(() => {
        if (done) return;
        else if (n < 3) attempt(n + 1);
        else reject(new Timeout("Timed out"));
      }, 250);
    }
    attempt(1);
  });
}


// Apparently regular loops don't allow you to stop and wait for retries. 
// That's why attempt is called recursively.

// What if the handler's taking some time, so we end up with multiple requests back.



function requestType(name, handler) {
  // I think requestType tells the nests what type of request it will receive and what to do about it.
  defineRequestType(name, (nest, content, source, callback) => {
    try {
      Promise.resolve(handler(nest, content, source))
      .then(response => callback(null, response),
            failure => callback(failure));
    } 
    catch (exception) {
      callback(exception);
    }
  });
}

// I have very little idea what requestType does.

// Seems to use defineRequestType, but gives it  a handler. The handler is wrapped in a promise
// so we can expect that the handler resolves to a value.

// I think the callback returns an error so we propogate the error to the 'catch'???




/************ * Collections of Promises *************/


// EAch nest computer has a property called 'neighbors' that contains
// an array of nearby computers.

// We're going to send a 'ping' to those that are reachable.

// Promise.all returns a promise that ways for all the promises in the array to resolve.
// If one promise is rejected, the result of Promise.all is rejected.


requestType("ping", () => "pong");


function availableNeighbors(nest) {
  let requests = nest.neighbors.map(neighbor => {
    return request(nest, neighbor, "ping")
    .then(() => true, () => false)
    // How come .then doesn't return true or false. Why does it call a callback function?
    // I think the request will call these anonymous functions when the promise is resolved,
    // however they're only calling values. If you return on an anymous function that contains a value,
    // does that value get returned?
    // Please randomTest file for answer.
    // No that's not exactly what's happening.
    // So '.then' is actually returning a Promise. 
    // The Promise can either resolve (() => true) or it can reject (() => false).
    // Mozilla's telling me that we are returning true or false actually. How are we doing that?

    // No idea how the line above is happening. 
  });
  return Promise.all(requests).then(result => {
    // Filters out the neighbors element who's corresponding index in the 'result' array is a falsey value (The value would be literally
    // 'false').
    return nest.neighbors.filter((_,i) => result[i]);
  });
}


// Okay this is really important. 
// Promise.all returns a single promise, however if any of the promises in the array passed to 
// Promise.all are rejected, all of Promise.all is rejected.
// 'requests' is an array of true and false values. The corresponding index of each element of the array also corresponds to the index
// of the elements in the 'neighbors' array. 
// The '.filter' method does the work of removing falsey values by only passing truthy values(the being the true values)



/*********** * Network Flooding ************/

// What if we want to talk to nests outside of a nest's neighbors?

// We'll create a type of request that sends automatically to our 
// nest's neighbours. It will then send it automatically to their 
// neighbours.


import {everywhere} from "./crow-tech";

everywhere(nest => {
  nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null) {
  nest.state.gossip.push(message); // So we're adding the message to the gossip array
  for (let neighbor of nest.neighbors) {
    request(nest, neighbor, "gossip", message); // We send a message to the neighbor of type gossip.
  }
}

requestType("gossip", (nest, message, source) => {
  if (nest.state.gossip.includes(message)) return; // If the message is already there, return.
  console.log(`${nest.name} received gossip '${message}' from ${source}`);
  sendGossip(nest, message, source);
});

// We avoid sending the message around the network forever by keep track if gossip is 
// already in the gossip array. 
// That means once a nest receives gossip it should send it to other nests. Where does this happen?
//    I think requestType actually does this...
//    All everywhere does is set up the state. Each nest must push the message into it's state.gossip
//    property only when it RECEIVES the message.

// The everywhere function runs code on every nest, to add the state property to each nest and 
// store gossip there.'


// When one node sends a message contagiously in this way, this style
// of network communication is called "flooding".

sendGossip(bigOak, "Kids with airgun in the park.")


/*********** * Message Routing ************/

// So now we want to send more specific messages from one node
// to the next.

// We'll want to do this by "flooding" across the network but 
// I think we're going to try and keep track of whether we've
// checked that nest before.

// Also we're flooding because we don't know the layout so we'll
// have to search the neighbors.

requestType("connections", (nest, {name, neighbors}, source) => {
  // So we're checking below if the connections object has the 
  // same neighbors as the nest we're looking at.
  // If it does, we 'return' instead of doing anything because we've
  // already been here.
  let connections = nest.state.connections;
  if (JSON.stringify(connections.get(name)) == 
      JSON.stringify(neighbors)) return;
      // Apparently we stringify because objects and arrays 
      // will only be true if they're the exact same.
      // Why will they not be the exact same?

  connections.set(name, neighbors);
  broadcastConnections(nest, name, source);
  // Now we spread the message to this nest.
});

function broadcastConnections(nest, name, exceptFor = null) {
  // We do multiple calls to request, each time with a new neighbor
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    // request function actually carries out the request,
    // and we specify the type as connections.

    request(nest, neighbor, "connections", {
      name,
      neighbors: nest.state.connections.get(name)
      // nest.state.connections should be the current nest we're at
    });
  }
}

everywhere(nest => {
  nest.state.connections = new Map;
  // What is map? I think it's a data structure.
  nest.state.connections.set(nest.name, nest.neighbors)
  // nest.state.connections is probably an object with a name and 
  // an array of neighbors as it's property.
  broadcastConnections(nest, nest.name);
});


function findRoute(from, to, connections) {
  let work = [{at: from, via: null}];
  for (let i = 0; i < work.length; i++) {
    let {at, via} = work[i];
    for(let next of connections.get(at) || []) {
      if (next == to) return via;
      if (!work.some(w => w.at == next)) {
        work.push({at: next, via: via || next});
      }
    }
  }
}


// I'm going to take a break from this chapter.

