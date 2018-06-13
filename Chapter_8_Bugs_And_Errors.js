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

/* 
Some languages care about the types of all your bindings, in that they won't even run
the program before it knows all of the types of your bindings and expressions. 

JavaScript only considers types when actually running the program. It even tries to 
implicitly convert values to the type it expects, so it's not much help

Try and comment in what the types are for you function

TypeScript adds checks to the language and checks them. It is a dialect of JavaScript.
*/



//*********** * Testing **************//


function test(label, body) {
    if (!body()) console.log(`Failed: ${label}`);
  }
  
  test("convert Latin text to uppercase", () => {
    return "hello".toUpperCase() == "HELLO";
  });
  test("convert Greek text to uppercase", () => {
    return "Χαίρετε".toUpperCase() == "ΧΑΊΡΕΤΕ";
  });
  test("don't convert case-less characters", () => {
    return "مرحبا".toUpperCase() == "مرحبا";
  });


  // 'Test Suites' provide many useful tests.
  // They give us a bunch of tests that we call 'Test Runners'




  /************* * Debugging **************/



  /* 
  The program below tries to convert a whole number to a string in a given base (decimal, binary and so on),
  by repeatedly picking out the last digit and then dividing the number to get rid of this digit. However, the 
  strange output it produces has a bug. 
  */
  function numberToStringWrong(n, base = 10) {
    let result = "", sign = "";
    if (n < 0) {
      sign = "-";
      n = -n;
    }
    do {
      result = String(n % base) + result;
      n /= base;
    } while (n > 0);
    return sign + result;
  }
//   console.log(numberToStringWrong(13, 10));
// → 1.5e-3231.3e-3221.3e-3211.3e-3201.3e-3191.3e-3181.3…


// remember the modulo operator (%) returns the remainder of being divided by a number
// 10 % 3 returns 1


/*
Putting a few strategic console.log calls into the program is a good way to get additional 
information about what the program is doing. In this case, we want n to take the values 13, 1, and then 0.
 Let’s write out its value at the start of the loop.

13
1.3
0.13
0.013
…
1.5e-323

Right. Dividing 13 by 10 does not produce a whole number. Instead of n /= base, what we 
actually want is n = Math.floor(n / base) so that the number is properly “shifted” to the right.
*/

function numberToString(n, base = 10) {
    let result = "", sign = "";
    if (n < 0) {
      sign = "-";
      n = -n;
    }
    do {
      console.log("n is: "+ n);
      result = String(n % base) + result;
      console.log("result is: " + result);

      n = Math.floor(n/base);
    } while (n > 0);
    return sign + result;
  }
console.log(numberToString(13, 2));

/*

1:1
2:10
3:11
4:100
5:101
6:110
7:111
8:1000
9:1001
10:1010
11:1011
12:1100
13:1101
*/




//************* * Error Propagation ***********//

// How do we respond to outside faulty input? Don't let the program just crash.

// The function below asks for a whole numbers and returns it.
// What happens if the user inputs "orange".

// One option is to return a special value. Ex: Null, undefined
// or -1.

function promptNumber(question) {
    let result = Number(prompt(question));
    if (Number.isNaN(result)) return null;
    else return result;
}
console.log(promptNumber("How many trees do you see?"));

// This works but what if we're dealing with a function
// that can return any kind of value. Example below returns
// an element from an array.

// We'll return an object with a property called failed
// that explicitly is true or false.

function lastElement(array) {
    if (array.length == 0) {
        return {failed: true};
    } else {
        return {element: array[array.length - 1]};
    }
}


/************ * Exceptions ************/

/*
When a function can't proceed normally, we want to stop what we are
doing and jump to a place that knows how to handle the problem.
*/


// Exceptions allow code that runs into a problem to raise or 
// throw an exception. Allows the code to keep running.
// Exceptions can be any value.

// An exception is a super return?
// Exceptions zoom down the call stack and throw away all the 
// call contexts it encounters
// Their power apparently comes from setting "obstacles" along the stack to 'catch' exception as it
// zooms down. 

// Once you've caught an exception, you can do something with to address the problem and then continue 
// to run the program. 

function promptDirection(question) {
    let result = prompt(question);
    if (result.toLowerCase() == "left") return "L";
    if (result.toLowerCase() == "right") return "R";
    throw new Error("Invalid direction: " + result);
}

function look() {
    if (promptDirection("Which way?") == "L") {
        return "a house";
    } else {
        return "two angry bears";
    }
}

try {
    console.log("You see", look());
} catch (error) {
    console.log("Something went wrong: " + error);
}

// The 'throw' keyword is used to raise an exception.
// Catching an exception is done by using a 'try' block.
// When the code in the 'try' block causes an exception to be raised
// the catch block is evaluated.
// After the try block finishes, the program proceeds beneath both
// the catch and the try block.

// Here we used the 'Error' constructor to create an exception value.
// The 'Error' constructor has a 'message' property. 
// This constructor also gathers information about the call stack that 
// existed when the exception was thrown, which is called the 'stack trace'.
// 'stack trace' has information about where the error happened and which function
// may have caused the error. 

// Notice that the 'look()' function doesn't seem to have to worry about any errors
// happening.



/************** * Cleaning Up After Exceptions *************/

/*
What is control flow?

The effects of exceptions are another kind of control flow. Every actions that might 
cause an exception, which is almost all function calls and property acces, might control to suddenly
leave you code. *********** WHAT DOES THIS MEAN?

When code has several side effects, even if its "regular" control flow looks like they'll always all happen, 
an exception might prevent some of them from taking place.

Below is very bad banking code
*/

const accounts = {
    a: 100,
    b: 0,
    c: 20,
};

function getAccount() {
    let accountName = prompt("Enter an account name");
    if (!accounts.hasOwnProperty(accountName)) {
        throw new Error(`No such account: ${accountName}`);
    }
    return accountName;
}

function transfer(from, amount) {
    if (accounts[from] < amount) return;
    accounts[from] -= amount;
    accounts[getAccount()] += amount;
}

// Transfer function needs to know from which account to take money from. Then 
// in the body of the transfer function, the 'getAccount()' function, will prompt
// the user and ask for which account to transfer TO. 

// HOWEVER, notice that if getAccount() is broken off and does proceed, the money
// has ALREADY BEEN REMOVED from the old account. So the money just disappears and 
// goes nowhere.



// We could move 'getAccount()' to before but problems like this can show up
// in more subtle ways.


// The book adovcates for a programming style that uses few side effects.
// It says we should compute new values instead of changing existing data. 
// If a piece of code stops running in the middle of creating a new value, we won't end
// up seeing the half finished value.

// This isn't always practical so there is another feature that 'try' statements have. They 
// may be followed by a 'finally' block. 'finally' can either replace or be in addition 
// to a 'catch' block. 

// 'finally' block says "no matter what happens, run this code after trying to run the code
// in the try block."


function transfer(from, amount) {
    if(accounts[from] < amount) return;
    let progress = 0;
    try {
        accounts[from] -= amount;
        progress = 1;
        accounts[getAccount()] += amount;
        progress = 2;
    } finally {
        if (progress == 1) {
            accounts[from] += amount;
        }
    }
}

// If the 'finally' block finds that the progress is only at 1, it will add the amount back to
// the account. 

// The 'finally' block doesn't mess with the exception. After the 'finally' block runs,
// the stack continues to unwind (wtf does that mean?);



/********** * Selective Catching ***************/

/*
If the exception makes it all the way to the bottom of the stack
without being caught, it get handled by the JavaScript enviornment. 

Node.js is more careful about data corruption and aborts the whole
process when an unhandled exception occurs.

Allowing an error to go through and letting the browser show the error,
is a reasonable way to signal a broken program. 

For problems that are expected to happen during routine use, this is a 
terrible strategy. 

We can actually catch errors like when something that isn't a function is called, 
or when looking up a property on null or referencing a nonexistant binding. 


JavaScript doesn't provide direct support for selectively catching exceptions:
either it catches all of them or it doesn't catch any. So if it catches an error,
that wasn't the intended error, you might not notice it! 
*/

// Program below ATTEMPTS to keep calling promptDirection until it gets a valid answer:

for(;;) {
    try {
        let dir = promtDirection("Where?") ; // typo!   Should be promptDirection
        console.log("You chose", dir);
        break;
    } catch(e) {
        console.log("Not a valid direction. Try again.")
    }
}


// The for(;;) this makes a loop that doesn't break on its own. 

/*
We misspelled promptDirection which will result in an "undefined variable" error. 
The catch block wrongly treats the binding error as indicating bad input. It doesn't do anything
with (e) the exception value.
*/

// Don't blanket-catch exceptions unless it's for routing them somwhere
// like telling another system over a network that the program crashed.

// How do we make sure we get the exception that we want?

// We won't compare the message property in the error with the error we expect
// because the message is meant for human consumption not for progrommatic
// decisions.

class InputError extends Error {}

function promptDirection(question) {
    let result = prompt(question);
    if (result.toLowerCase() == "left") return "L";
    if (result.toLowerCase() == "right") return "R";
    throw new InputError("Invalid direction: " + result);
}

// Okay so we've created an instance of the 'Error' object.
// 'InputError' objects behave like 'Error' objects but have a different
// class by which we recognize them. 
// 'Error' objects expect a string message as an argument.

// So what will happen is that if no direction is chosen, the promptDirection function will throw
// a 'InputError' error, and the catch block in the for loop below will catch it. If any other 
// error occurs, the catch block will catch that error as well. 

for (;;) {
    try {
      let dir = promptDirection("Where?");
      console.log("You chose ", dir);
      break;
    } catch (e) {
      if (e instanceof InputError) {
        console.log("Not a valid direction. Try again.");
      } else {
        throw e;
      }
    }
}


/********** * Assertions ***********/

/*
Assertions are checks inside a program to verify that something is
the way it's supposed to be.
Made to find programer mistakes

The function 'firstElement' below checks to see if the array is empty.
If it is, it throws an error
*/

function firstElement(array) {
    if(array.length == 0) {
        throw new Error("firstElement called with []");
    }
    return array[0];
}

// Instead of return undefined, the program will loudly show you
// the error. 


/************ * Summary ****************/
// Throwing an exception causes the call stack to be unwound until the next enclosing
// try/catch block or until the bottom of the stack.

// The exception values are given to the 'catch' block, which should verify that it is
// actually the expected kind of exception and then it should do something with it.

// 'finally' block acn be used to ensure that a piece of code always runs when a block 
// finishes.

// So basically throwing an error interrupts a program and immediately runs the error and goes 
// to the catch blox;
