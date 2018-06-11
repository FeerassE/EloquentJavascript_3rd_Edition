/**************** Chapter 8 ****************/
/************ Bugs and Errors *************/


// To traverse the contents. Crtl-F the star plus the name of the subheading. ex: Crtl-F[* Classes]
//   Table of Contents
//   -----------------------------
// * Language
// * Strict Mode
// * Types
// * Testing
// * Debugging
// * Error Propagation
// * Exceptions
// * Cleaning Up After Exceptions
// * Selective Catching
// * Assertions



//********* * Language ***********/

/*
JavaScript has vague concepts for bindings and properties that make it difficult
for the language to find typos before compiling.

There are somethings JavaScript does complain about:
- writing a program that does not follow the language's grammar
- calling something that's not a function
- looking up a property on an undefined value

The process of finding mistakes is called debugging
*/


//********** * Strict Mode ***********/

// Javascript can be made a little more strict by writing the string
// "use strict" above a file or function body

// Example:

function canYouSpotTheProblem() {
    "use strict";
    for(counter = 0; counter < 10; counter++) {
        console.log("Happy happy");
    }
}

// canYouSpotTheProblem();
// log: ReferenceError: counter is not defined

// When you forget to put a 'let' infront of counter, JavaScript normally
// and quietly makes a global binding and uses that. Here it shows an 
// error instead.


// In strict mode, the 'this' binding holds the value 'undefined' in functions
// that are not called as methods. 
// When making a call like this outside of strict mode, 'this' refers to the global
// scope object, whose properties are the global bindings. 

// The function below calls a constructor function without the 'new' keyword. So
// 'this' will refer to the global binding.

function Person(name) {
    this.name = name;
}
let ferdinand = Person("Ferdinand"); // forgot 'new' keyword
console.log(name);
//log: Ferdinand
console.log(ferdinand);
//log: undefined

"use strict";
function Person(name) {this.name = name};
let ferdinand2 = Person("Ferdinand"); // Forgot 'new' keyword
// log: TypeError: Cannot set property 'name' of undefined

// Conscturcotrs created with the 'class' keyword will always complain if they
// are called without the word 'new';


// "use strict" also disallows giving a function multiple parameters with the 
// same name.

//********** * Types ****************//

