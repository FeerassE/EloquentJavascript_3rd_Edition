
import {bigOak} from "./crow-tech";

bigOak.readStorage("food caches", caches => {
  let firstCache = caches[0];
  bigOak.readStorage(firstCache, info => {
    console.log(info);
  });
});


bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7PM",
            () => console.log("Note delivered."));

// We must define the type 'note' so that all nests can recieve this 
// request type.

import {defineRequestType} from '.crow/tech';

defineRequestType("note", (nest, content, source, done) => {
  console.log(`${nest.name} received note: ${content}`);
  done();
})

function storage(nest, name) {
    return new Promise(resolve => {
      nest.readStorage(name, result => resolve(result));
    });
  }
  
  storage(bigOak, "enemies").then(value => console.log("Got", value));



new Promise((_, reject) => reject(new Error("Fail")))
  .then(value => console.log("Handler 1"))
  .catch(reason => {
    console.log("Caught failure " + reason);
    return "nothing";
})
  .then(value => console.log("Handler 2", value));


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

function requestType(name, handler) {
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
  

requestType("ping", () => "pong");

function availableNeighbors(nest) {
  let requests = nest.neighbors.map(neighbor => {
    return request(nest, neighbor, "ping")
      .then(() => true, () => false);
  });
  return Promise.all(requests).then(result => {
    return nest.neighbors.filter((_, i) => result[i]);
  });
}


import {everywhere} from "./crow-tech";

everywhere(nest => {
  nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null) {
  nest.state.gossip.push(message);
  for (let neighbor of nest.neighbors) {
    request(nest, neighbor, "gossip", message);
  }
}

requestType("gossip", (nest, message, source) => {
  if (nest.state.gossip.includes(message)) return; // If the message is already there, return.
  console.log(`${nest.name} received gossip '${message}' from ${source}`);
  sendGossip(nest, message, source);
})