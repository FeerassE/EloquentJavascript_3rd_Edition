

/************ Chapter 10 Modules **********/

/* 

To traverse the contents. Crtl-F the star plus the name of the subheading. ex: Crtl-F[* Classes]
  Table of Contents
  -----------------------------
* Modules
* Packages
* Improvised Modules
* Evaluating Data as Code
* CommonJS
* ECMAScript Modules
* Building and Bundling
* Module Design

*/


/*********** * Modules **********/

/*

Modules is an organized piece of program that gives functionality for
other modules.

Modules allows us to organize a program into detachable pieces so we can
fit and match different functionality for different contexts.

Relationships between modules are called "dependencies". 
When a module needs a piece from another module, it is said
to depend on that module.


*/

// Scope

/*

To separate modules, they must be in their own private 
scope.

Remember that even if different parts of the code
are in different files, that doesn't mean that they
are completely separated. They share a common 'global'
namespace.
They can accidently or intentionally, interfere 
with each other's bindings.

*/



/************ * Packages ************/

// The books describes packages as small programs or 
// pieces of code that you can add to other programs. They 
// give an advantage, which is to be able to fix and update
// the package across all programs that use the package.

// NPM is the infrastructure to find, store, install and
// upgrade packages.

// NPM is an online service to download and upload packages and 
// it is also a program (bundled with Node.js apparently) that helps
// you install and manage them.



/********** * Improvised Modules **********/

// The example below is an antiquated method to
// create modules.
// It keeps the scope of the bindings inside
// the local scope of the function

const weekDay = function() {
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
                   "Thursday", "Friday", "Saturday"];
    return {
      name(number) { return names[number]; },
      number(name) { return names.indexOf(name); }
    };
  }();
  
  console.log(weekDay.name(weekDay.number("Sunday")));
  // → Sunday

  // A problem is that this method of creating 
  // modules doesn't let us declare dependencies
  // and just puts its interface into the global
  // scope.

  // Apparently, if we want to make dependencies 
  // a thing, we'll ahve to take control of loading dependencies.
  // This will require that are able to execute strings, as code.

  // Javascript can do this.




/*********** * Evaluating Data as Code ************/

// Many ways to run data(a string of code) and run it
// as part of the program.


// eval allows us to execute a string in the 
// 'current' scope.

// For some reason this is a bad idea because
// it breaks some of the properties that scopes normally have.

const x = 1;
function evalAndReturnX(code) {
    eval(code);
    return x;
}
console.log(evalAndReturnX("var x = 2"));
// log: 2
console.log(x);
// log: 1


// So when we call the binding x from the function 'evalAndReturnX' it will
// return x to us from the scope of this particular function.
// When we call the binding x without calling the function 'evalAndReturnX', the 
// program will call x from the global scope, hence the discrepency between the numbers.


// Better to use the 'Function' constructor.
// It takes two arguments:
// - a string containing a comma-separated list of argument names
// - a string containing the function body.

// It wraps the code in a function value so that it gets its own scope.

let plusOne = Function("n", "return n + 1;");
console.log(plusOne(4));
// log: 5


// I still am confused as to why this is a better solution than the one above, given
// that they are both functions anways.
// I think the problem with the syntax above, is that it just makes it difficult to understand
// where the string will get executed. 




/************ * CommonJS ***********/

// The most common way to use added modules is 'CommonJS modules'.
// Node.js uses this



// Main concept of CommonJS is a function called 'require'.

// When 'require' is called with the module name of a dependency, 
// it makes sure the module is loaded and returns its interface.

// Notice that because it wraps the module in a function, modules
// already get their own local scope.
// All they have to do is call 'require' to access dependencies, and put their
// interface in the object bound to 'exports'.

// Below is a date-formatting function.

// Use two packages:
// - 'ordinal' converts numbers to strings like "1st" and "2nd"
// - 'date-names' to get the English names for weekdays and months

// 'date-names' exports a single function 'formatDate' which takes a 
// Date object and a template string

// Okay so the way the programs works is by taking a Date object(which has the raw information the date),
// and a format of your choice within someparameters, like the year should look like this YYYY. 

// You could give it a string like "MMMM Do YYYY" to get output like “November 22nd 2017”.

const ordinal = require("ordinal");
const {days, months} = require("date-names");

exports.formatDate = function(date, format) {
  return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
    if (tag == "YYYY") return date.getFullYear();
    if (tag == "M") return date.getMonth();
    if (tag == "MMMM") return months[date.getMonth()];
    if (tag == "D") return date.getDate();
    if (tag == "Do") return ordinal(date.getDate());
    if (tag == "dddd") return days[date.getDay()];
  });
};

// Okay so the function just takes a format that you want and a date 
// and puts the date data into that format. 

// 'ordinal' is just a function that takes a number and returns that number
// with "st" or "nd" after it.

// 'date-names' exports an object containing functions and arrays namely the 'day' and 
// 'month' array.

// The module adds its interface function to 'exports' so that various dependencies(like what?) get
// access to it.

// We can also use it like this:

const {formatDate} = require("./format-date");


console.log(formatDate(new Date(2017, 9, 13),
                       "dddd the Do"));
// → Friday the 13th


// Deconstructring require:

require.cache = Object.create(null);

function require(name) {
    // name is a file name, so require goes and looks for a file with
    // the module in it. Then loads the module

    // 'require' keeps a store(cache) of already loaded modules
    // The check below makes sure that the module has not been loaded
    // yet
    if(!(name in require.cache)) {
        let code = readFile(name);
        let module = {exports: {}};
        require.cache[name] = module;
        let wrapper = Function("require, exports, module", code);
        // Remember the 'Function' constructor's first parameter sets the names for the
        // paramaters of the new function being constructed.

        // The values below are given to the wrapper function to make sure
        // their available to the scope of the module.
        wrapper(require, module.exports, module);
    }
    return require.cache[name].exports;
}

// readFile is a made-up function that reads a file and returns 
// its contents as a string. Standard JavaScript provides no such 
// functionality.
// Other JavaScript enviornments like the browser and Node.js provide
// a way to access them.


// CommonJS modules create an empty interface object for you (bound to 
// exports)
// We can replace that object with anything by changing the binding 
// to 'module.exports'
// Why would we want to do this????


const {parse} = require("ini");

console.log(parse("x = 10\ny = 20"));
// → {x: "10", y: "20"}




/*********** * ECMAScript Modules **********/

// apparently the things you add to exports aren't available to local scope...
// What does that mean!?!?!?! 
// I thought it was available to the module's scope??????
// Whatever...


// Okay so JavaScript has its own way of accounting for dependencies:

// Use the 'import' keyword to access dependencies

// Use 'export' to export dependencies. What does it mean to export
// a dependency?


import ordinal from "ordinal";
import {days, months} from "date-names";

export function formatDate(date, format) { /*...*/ }

// You can export a function, class or binding definition (let, const or var)

// Alright the next part is confusing:

/*

An ES module's interface is not a single value by a bunch of named bindings.

So if we export a module, we can change the value of its bindings at any point and 
the importing module will get the changed value. 

The binding named 'default' is the module's main exported value.

If we import the module 'ordinal', without braces around the binding name
we get the default binding.
*/

export default ["Winter", "Spring", "Summer", "Autumn"];

// It's possible to rename imported bindings using the word 'as'

import {days as dayNames} from "date-names";
console.log(dayNames.length);
// → 7


// Another important difference is that ES module imports happen before a 
// module’s script starts running.


/************ * Building and Bundling **********/

/*
Because fetching a single big file tends to be faster than fetching a lot of 
tiny ones, web programmers have started using tools that roll their programs 
(which they painstakingly split into modules) back into a single big file before 
they publish it to the Web. Such tools are called bundlers.


*/




/************* * Module Design *************/

/*
This dijkstrajs package uses a graph format similar to ours, but instead 
of arrays, it uses objects whose property values are numbers—the weights 
of the edges.


So if we wanted to use that package, we’d have to make sure that our graph 
was stored in the format it expects. All edges get the same weight since our 
simplified model treats each road as having the same cost (one turn).
*/

const {find_path} = require("dijkstrajs");

let graph = {};
for (let node of Object.keys(roadGraph)) {
    let edges = graph[node] = {};
    for (let dest of roadGraph[node]) {
        edges[dest] = 1;
    }
}
console.log(find_path(graph, "Post Office", "Cabin"));

// log: ["Post Office", "Alice's House", "Cabin"]