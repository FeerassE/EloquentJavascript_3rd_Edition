
/*
Any time you wrap a portion of code into a function and specify that it 
should be executed in response to some event (timer, mouse click, Ajax response, etc.), 
you are creating a later chunk of your code, and thus introducing asynchrony to your program.


console.log is implemented by the hosting enviornment, not the javascript engine. 

The JavaScript engine has no innate sense of time.
The engine simply executes the next scheduled event.

The hosting enviornment schedule's events and then sends the next coming one to the JavaScript
engine's event loop.
*/


// Psuedocode for the event loop:

// `eventLoop` is an array that acts as a queue (first-in, first-out)
var eventLoop = [ ];
var event;

// keep going "forever"
while (true) {
	// perform a "tick"
	if (eventLoop.length > 0) {
		// get the next event in the queue
		event = eventLoop.shift();

		// now, execute the next event
		try {
			event();
		}
		catch (err) {
			reportError(err);
		}
	}
}

/*
It's very common to conflate the terms "async" and "parallel," but they are actually quite different. 
Remember, async is about the gap between now and later. But parallel is about things being able to 
occur simultaneously.
*/

/*
Concurrency is when two or more chains of events interleave over time, such that from a high-level 
perspective, they appear to be running simultaneously (even though at any given moment only one event 
is being processed).

Concurrency is when two or more "processes" are executing simultaneously over the same period, regardless 
of whether their individual constituent operations happen in parallel (at the same instant on separate 
processors or cores) or not.
*/

/*
Non-Determinism is if a program:
- If it uses external state other than user input, global variables, hardware timer value, random value
  or stored disc data.
- Operates in a time sensitive way ex: writing to data in the same location.
- If hardware errors cause its state to change in an unexpected way.
*/

/*
Noninteraction is when two processes are interleaving their events but don't need or 
affect each other's values.
*/

/*
Interaction 
*/

/*
So Jobs are how Promises work in JavaScript.
Jobs are scheduled at the end of the next event loop tick, aka, they happen at the end
of the next event that occurs. It's like saying "I want you to do this Job later but ASAP".

In the code below, the output is ACDB
*/

console.log( "A" );

setTimeout( function(){
	console.log( "B" );
}, 0 );

// theoretical "Job API"
schedule( function(){
	console.log( "C" );

	schedule( function(){
		console.log( "D" );
	} );
} );

// log: ACDB


/*
I'm still wondering what the difference is between async where one line happens ten lines before
and async where an event occurs later or a user inputs data and sets a value.
*/