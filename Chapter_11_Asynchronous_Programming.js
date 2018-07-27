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
      nest.send(target, type, content, (failed, value) => {
        done = true;
        if (failed) reject(failed);
        else resolve(value);
      });
      setTimeout(() => {
        if (done) return;
        else if (n < 3) attempt(n + 1);
        else reject(new Timeout("Timed out"));
      }, 250);
    }
    attempt(1);
  });
}